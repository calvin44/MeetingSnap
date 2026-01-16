import { getDocumentTabs } from '@/lib/services/tabs'
import { ApiErrorResponse, TabsResponse } from '@/lib/types'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * GET: Retrieves a list of tabs from the Master Google Doc.
 * Now a thin wrapper around the shared service function.
 */
export async function GET(): Promise<NextResponse<TabsResponse[] | ApiErrorResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tabList = await getDocumentTabs()
    return NextResponse.json(tabList)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to retrieve document structure', details: message },
      { status: 500 },
    )
  }
}
