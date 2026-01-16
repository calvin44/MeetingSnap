import { extractTabContent } from '@/lib/services/tabs'
import { ExportResponse } from '@/lib/types'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST: Extracts notes from a specific document tab.
 * Now a thin wrapper around the shared service function.
 */
export async function POST(req: Request): Promise<NextResponse<ExportResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { tabId } = await req.json()

    if (!tabId || typeof tabId !== 'string') {
      return NextResponse.json({ error: 'A valid tabId is required' }, { status: 400 })
    }

    const result = await extractTabContent(tabId)
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = (error as { code?: number })?.code || 500

    return NextResponse.json(
      { error: 'An error occurred during document processing', details: message },
      { status: statusCode },
    )
  }
}
