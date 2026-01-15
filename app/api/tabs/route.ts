import { getGoogleClient } from '@/lib/google'
import { logger } from '@/lib/logger'
import { ApiErrorResponse, TabMetadata, TabsResponse } from '@/lib/types'
import type { docs_v1 } from 'googleapis'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

/**
 * GET: Retrieves a list of tabs from the Master Google Doc.
 * Uses strict union typing for robust frontend integration.
 */
export async function GET(): Promise<NextResponse<TabsResponse[] | ApiErrorResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const docId = process.env.MASTER_DOC_ID

  try {
    // 1. CONFIGURATION VALIDATION
    if (!docId) {
      logger.error('CRITICAL: MASTER_DOC_ID environment variable is missing')
      const errorPayload: ApiErrorResponse = { error: 'Server configuration error', code: 500 }
      return NextResponse.json(errorPayload, { status: 500 })
    }

    const { docs } = await getGoogleClient()

    // 2. DATA RETRIEVAL
    // Optimization: Requesting only metadata fields to minimize latency and payload size
    const { data } = await docs.documents.get({
      documentId: docId,
      includeTabsContent: true,
      fields: 'tabs(tabProperties(tabId,title),documentTab)',
    })

    if (!data.tabs) {
      logger.warn({ docId }, 'Document returned no tab structure')
      return NextResponse.json([]) // Returns empty array as a valid TabsResponse[]
    }

    // 3. DATA TRANSFORMATION
    // Type-safe filter to ensure tabId exists before mapping
    const tabList: TabMetadata[] = data.tabs
      .filter(
        (tab): tab is docs_v1.Schema$Tab & { tabProperties: { tabId: string } } =>
          !!tab.tabProperties?.tabId,
      )
      .map((tab) => ({
        id: tab.tabProperties.tabId,
        title: tab.tabProperties.title || 'Untitled Tab',
        hasContent: !!tab.documentTab,
      }))

    // 4. OPERATIONAL LOGGING
    logger.info(
      {
        count: tabList.length,
        duration: Date.now() - startTime,
      },
      'Successfully retrieved document tabs',
    )

    return NextResponse.json(tabList)
  } catch (error: any) {
    // 5. STRUCTURED ERROR HANDLING
    const statusCode = error.code || 500
    const googleReason = error.errors?.[0]?.reason

    logger.error(
      {
        err: error.message,
        docId,
        statusCode,
        googleReason,
        context: 'GET_TABS_ROUTE',
      },
      'Failed to retrieve document structure',
    )

    const userMessage =
      statusCode === 404
        ? 'Document not found'
        : statusCode === 403
        ? 'Permission denied'
        : 'Failed to retrieve document structure'

    const errorResponse: ApiErrorResponse = {
      error: userMessage,
      code: statusCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }

    return NextResponse.json(errorResponse, { status: statusCode })
  }
}
