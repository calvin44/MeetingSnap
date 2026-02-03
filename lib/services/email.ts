import { cleanGoogleHtml, wrapWithBranding } from '@/lib/email-template'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'
import nodemailer from 'nodemailer'

/**
 * Shared service to handle email dispatch with branding.
 */
export async function sendMeetingMinutesEmail({
    to,
    subject,
    tabTitle,
    html,
}: {
    to: string
    subject: string
    tabTitle: string
    html: string
}) {
    const startTime = Date.now()

    // 1. BRANDING & SANITIZATION
    const sanitized = cleanGoogleHtml(html, tabTitle)
    const brandedHtml = wrapWithBranding(sanitized)

    // 2. TRANSPORTER INITIALIZATION
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
        },
    })

    // 3. SEND
    const info = await transporter.sendMail({
        from: env.EMAIL_FROM_ADDRESS,
        to,
        subject,
        html: brandedHtml,
    })

    logger.info(
        {
            messageId: info.messageId,
            to,
            duration: `${Date.now() - startTime} ms`,
        },
        'Email dispatched successfully in service layer',
    )

    return info
}
