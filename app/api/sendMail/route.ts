import { sendMeetingMinutesEmail } from '@/lib/services/email'
import { ApiErrorResponse, SendEmailRequest, SendEmailResponse } from '@/lib/types'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * POST: Sends the exported HTML content via Gmail SMTP.
 * Now a thin wrapper around the shared email service.
 */
export async function POST(
  req: Request,
): Promise<NextResponse<SendEmailResponse | ApiErrorResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body: SendEmailRequest = await req.json()
    const { to, subject, tabTitle, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Recipient, subject, and HTML content are all required.' },
        { status: 400 },
      )
    }

    const info = await sendMeetingMinutesEmail({ to, subject, tabTitle, html })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const statusCode = (error as { responseCode?: number })?.responseCode || 500

    return NextResponse.json(
      { error: 'Failed to send email via SMTP', details: message },
      { status: statusCode },
    )
  }
}
