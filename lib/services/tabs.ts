import { env } from '@/lib/env'
import { getGoogleClient } from '@/lib/google'
import { logger } from '@/lib/logger'
import { TabMetadata } from '@/lib/types'
import type { docs_v1 } from 'googleapis'

/**
 * Direct server-side call to retrieve Google Doc tabs.
 * Can be called from Server Components or API routes.
 */
export async function getDocumentTabs(): Promise<TabMetadata[]> {
  const startTime = Date.now()
  const docId = env.MASTER_DOC_ID

  try {
    const { docs } = await getGoogleClient()

    // Requested metadata fields only to minimize latency
    const { data } = await docs.documents.get({
      documentId: docId,
      includeTabsContent: true,
      fields: 'tabs(tabProperties(tabId,title),documentTab)',
    })

    if (!data.tabs) {
      return []
    }

    const EXCLUDE_REGEX = /copy.*template/i
    const tabList: TabMetadata[] = data.tabs
      .filter((tab): tab is docs_v1.Schema$Tab & { tabProperties: { tabId: string } } => {
        const title = tab.tabProperties?.title || ''
        const hasId = !!tab.tabProperties?.tabId
        return hasId && !EXCLUDE_REGEX.test(title)
      })
      .map((tab) => ({
        id: tab.tabProperties.tabId,
        title: tab.tabProperties.title || 'Untitled Tab',
        hasContent: !!tab.documentTab,
      }))

    logger.info(
      { count: tabList.length, duration: Date.now() - startTime },
      'Successfully fetched doc tabs',
    )
    return tabList
  } catch (error) {
    logger.error({ err: error, docId }, 'Failed to fetch document tabs')
    return []
  }
}

/**
 * Extracts specific tab content by duplicating, pruning, and exporting to HTML.
 * Shared logic for preview and internal processing.
 */
export async function extractTabContent(tabId: string): Promise<{ html: string; tabId: string }> {
  const startTime = Date.now()
  const masterDocId = env.MASTER_DOC_ID
  const landingZoneFolderId = env.SHARED_DRIVE_ID
  let tempDocId: string | undefined = undefined
  const { docs, drive } = await getGoogleClient()

  try {
    // 1. DUPLICATE ENTIRE DOCUMENT
    const copyResponse = await drive.files.copy({
      fileId: masterDocId,
      supportsAllDrives: true,
      requestBody: {
        name: `MinuteSlicer_Buffer_${tabId}_${startTime}`,
        parents: [landingZoneFolderId],
      },
      fields: 'id',
    })

    tempDocId = copyResponse.data.id ?? undefined
    if (!tempDocId) throw new Error('Google Drive failed to return a temporary File ID')

    // 2. RETRIEVE CLONED STRUCTURE & PRUNE
    const { data: tempDocStructure } = await docs.documents.get({
      documentId: tempDocId,
      includeTabsContent: true,
      fields: 'tabs(tabProperties(tabId))',
    })

    const deleteRequests = (tempDocStructure.tabs || [])
      .map((tab) => tab.tabProperties?.tabId)
      .filter((id): id is string => !!id && id !== tabId)
      .map(
        (id) =>
          ({
            deleteTab: { tabId: id },
          }) as docs_v1.Schema$Request,
      )

    if (deleteRequests.length > 0) {
      await docs.documents.batchUpdate({
        documentId: tempDocId,
        requestBody: { requests: deleteRequests },
      })
    }

    // 3. EXPORT TO HTML
    const exportResponse = await drive.files.export(
      { fileId: tempDocId, mimeType: 'text/html' },
      { responseType: 'text' },
    )

    const htmlContent = exportResponse.data as string
    return { html: htmlContent, tabId }
  } finally {
    // 4. CLEANUP (Fire and forget, but logged)
    if (tempDocId) {
      drive.files
        .update({
          fileId: tempDocId,
          supportsAllDrives: true,
          requestBody: { trashed: true },
        })
        .catch((err) => logger.error({ err, tempDocId }, 'Cleanup failed during service execution'))
    }
  }
}
