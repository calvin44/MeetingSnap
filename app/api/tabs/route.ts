import { getGoogleClient } from '@/lib/google'

export async function GET() {
  const { docs } = await getGoogleClient()
  const docId = process.env.MASTER_DOC_ID || ''

  // We only need the tab metadata, not the full content
  const { data } = await docs.documents.get({ documentId: docId })

  const tabList =
    data.tabs?.map((tab) => ({
      id: tab.tabId,
      title: tab.tabVisualProperties?.title || 'Untitled Tab',
    })) || []

  return Response.json(tabList)
}
