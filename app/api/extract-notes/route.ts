import { getGoogleClient } from '@/lib/google'
import { logger } from '@/lib/logger'
import { ExportResponse } from '@/lib/types'
import type { docs_v1, drive_v3 } from 'googleapis'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request): Promise<NextResponse<ExportResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  let tempDocId: string | undefined = undefined
  let driveClient: drive_v3.Drive | null = null

  try {
    // 1. INPUT VALIDATION & CONFIGURATION CHECK
    const { tabId } = await req.json()
    const masterDocId = process.env.MASTER_DOC_ID
    const landingZoneFolderId = process.env.SHARED_DRIVE_ID

    if (!masterDocId || !landingZoneFolderId) {
      logger.error('CRITICAL: Environment variables MASTER_DOC_ID or SHARED_DRIVE_ID are missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (!tabId || typeof tabId !== 'string') {
      return NextResponse.json({ error: 'A valid tabId is required' }, { status: 400 })
    }

    const { docs, drive } = await getGoogleClient()
    driveClient = drive

    // 2. STEP 1: DUPLICATE THE ENTIRE DOCUMENT
    // We create a full copy in the shared landing zone to inherit permissions.
    const copyResponse = await drive.files.copy({
      fileId: masterDocId,
      supportsAllDrives: true,
      requestBody: {
        name: `MinuteSlicer_Buffer_${tabId}_${startTime}`,
        parents: [landingZoneFolderId],
      },
      fields: 'id', // Optimization: Only fetch the new ID
    })

    tempDocId = copyResponse.data.id ?? undefined
    if (!tempDocId) throw new Error('Google Drive failed to return a temporary File ID')

    // 3. STEP 2: RETRIEVE CLONED STRUCTURE
    // We only fetch tab metadata (tabId) to keep the response lean
    const { data: tempDocStructure } = await docs.documents.get({
      documentId: tempDocId,
      includeTabsContent: true,
      fields: 'tabs(tabProperties(tabId))',
    })

    // 4. STEP 3: PRUNE UNWANTED TABS
    // Create a batch of delete requests for every tab that ISN'T our target.
    const deleteRequests = (tempDocStructure.tabs || [])
      .map((tab) => tab.tabProperties?.tabId)
      .filter((id): id is string => !!id && id !== tabId)
      .map((id) => ({
        deleteTab: { tabId: id },
      } as docs_v1.Schema$Request))

    if (deleteRequests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: tempDocId,
        requestBody: { requests: deleteRequests },
      })
      logger.debug({ count: deleteRequests.length }, 'Pruned unwanted tabs from buffer')
    }

    // 5. STEP 4: CONVERT TO HTML
    // Exporting as 'text' ensures the response is a clean string of HTML content.
    const exportResponse = await drive.files.export(
      { fileId: tempDocId, mimeType: 'text/html' },
      { responseType: 'text' },
    )

    const htmlContent = exportResponse.data as string

    logger.info(
      {
        tabId,
        duration: Date.now() - startTime,
        size: htmlContent.length,
      },
      'Tab export completed successfully',
    )

    return NextResponse.json({ html: htmlContent, tabId })
  } catch (error: unknown) {
    // Standardize Google API error logging
    const message = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = (error as { code?: number })?.code || 500
    logger.error(
      {
        err: message,
        docId: tempDocId,
        code: statusCode,
        context: 'EXPORT_ROUTE',
      },
      'Failed to process tab export',
    )

    return NextResponse.json(
      { error: 'An error occurred during document processing' },
      { status: statusCode },
    )
  } finally {
    if (tempDocId && driveClient) {
      try {
        // A Contributor can sometimes 'trash' a file they just created,
        // but they cannot 'delete' it permanently.
        await driveClient.files.update({
          fileId: tempDocId,
          supportsAllDrives: true,
          requestBody: {
            trashed: true,
          },
        })
        logger.debug({ tempDocId }, 'Cleanup: Successfully moved to Trash')
      } catch (cleanupError: any) {
        // If this fails, it's a confirmed Permission issue.
        logger.error(
          {
            err: cleanupError.message,
            hint: "Service Account needs 'Content Manager' role to delete/trash in Shared Drives",
            tempDocId,
          },
          'Cleanup failed',
        )
      }
    }
  }
}
