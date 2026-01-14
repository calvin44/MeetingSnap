import { getGoogleClient } from '@/lib/google'
import { logger } from '@/lib/logger'
import { TabMetadata } from '@/lib/types'
import type { docs_v1 } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = Date.now()
  const docId = process.env.MASTER_DOC_ID

  try {
    // 1. CONFIGURATION VALIDATION
    if (!docId) {
      logger.error('CRITICAL: MASTER_DOC_ID environment variable is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { docs } = await getGoogleClient()

    // 2. DATA RETRIEVAL
    // Optimization: Only request tab metadata, not the actual document content
    const { data } = await docs.documents.get({
      documentId: docId,
      includeTabsContent: true,
      fields: 'tabs(tabProperties(tabId,title),documentTab)',
    })

    if (!data.tabs) {
      logger.warn({ docId }, 'Document returned no tab structure')
      return NextResponse.json([])
    }

    // 3. DATA TRANSFORMATION
    // Filter out malformed tabs and map to internal TabMetadata type
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

    return NextResponse.json({ error: userMessage, code: statusCode }, { status: statusCode })
  }
}
