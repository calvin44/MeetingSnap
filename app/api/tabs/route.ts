import { getGoogleClient } from '@/lib/google'
import { logger } from '@/lib/logger'
import { TabMetadata } from '@/lib/types'
import type { docs_v1 } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
  const docId = process.env.MASTER_DOC_ID
  try {
    if (!docId) {
      console.error('[CONFIG_ERROR]: MASTER_DOC_ID is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { docs } = await getGoogleClient()

    const { data } = await docs.documents.get({
      documentId: docId,
      includeTabsContent: true,
    })

    // LOG: Debug - Useful for performance monitoring
    const tabCount = data.tabs?.length || 0
    logger.debug({ tabCount }, 'Retrieved raw tab data from Google')

    if (!data.tabs) {
      logger.warn({ docId }, 'Document returned no tabs')
      return NextResponse.json([])
    }

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

    // LOG: Milestone - Success
    logger.info({ count: tabList.length }, 'Successfully processed top-level tabs')

    return NextResponse.json(tabList)
  } catch (error: unknown) {
    const apiError = error as any
    const statusCode = typeof apiError?.code === 'number' ? apiError.code : 500
    const isGoogleApiError = apiError?.errors?.[0]?.reason // Google-specific

    logger.error(
      {
        err: error instanceof Error ? error : new Error(String(error)),
        docId,
        statusCode,
        googleReason: isGoogleApiError,
        requestPath: '/api/tabs',
      },
      'Failed to retrieve document structure',
    )

    // Return different messages based on error type
    const userMessage =
      statusCode === 404
        ? 'Document not found'
        : statusCode === 403
        ? 'Permission denied'
        : 'Failed to retrieve document structure'

    return NextResponse.json({ error: userMessage, code: statusCode }, { status: statusCode })
  }
}
