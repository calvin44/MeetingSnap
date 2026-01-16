import { cleanGoogleHtml, wrapWithBranding } from '@/lib/email-template'
import { logger } from '@/lib/logger'
import { ApiErrorResponse, SendEmailRequest, SendEmailResponse } from '@/lib/types'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * POST: Sends the exported HTML content via Gmail SMTP using an App Password.
 */
export async function POST(
  req: Request,
): Promise<NextResponse<SendEmailResponse | ApiErrorResponse>> {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()

  try {
    // 1. DATA EXTRACTION & VALIDATION
    const body: SendEmailRequest = await req.json()
    const { to, subject, tabTitle, html } = body

    // Wrap the raw Google HTML with our app branding
    const sanitized = cleanGoogleHtml(html, tabTitle)
    const brandedHtml = wrapWithBranding(sanitized)

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Recipient, subject, and HTML content are all required.' },
        { status: 400 },
      )
    }

    // 2. TRANSPORTER INITIALIZATION
    // Gmail works best on port 587 with STARTTLS (secure: false).
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Shortcut for host: smtp.gmail.com
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // 3. EMAIL EXECUTION
    const info = await transporter.sendMail({
      from: `"MeetingSnap" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html: brandedHtml, // This HTML includes the tables and styling from Google Docs
    })

    logger.info(
      {
        messageId: info.messageId,
        to,
        duration: `${Date.now() - startTime} ms`,
      },
      'Email dispatched successfully via Gmail App Password',
    )

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    logger.error(
      {
        err: message,
        context: 'SENDMAIL_ROUTE',
      },
      'SMTP Transmission failed',
    )

    const statusCode = (error as { responseCode?: number })?.responseCode || 500

    return NextResponse.json(
      {
        error: 'Failed to send email via SMTP',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: statusCode },
    )
  }
}
