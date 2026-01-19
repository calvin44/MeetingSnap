'use server'

import { sendMeetingMinutesEmail } from '@/lib/services/email'
import { logger } from '@/lib/logger'
import { getServerSession } from 'next-auth'

export type ActionState = {
    error?: string
    success?: boolean
} | null

/**
 * Server Action to dispatch the email.
 * Optimized: Calls the service layer directly (no fetch-to-self).
 */
export async function sendEmailAction(
    data: { tabId: string; tabTitle: string; html: string },
    _prevState: ActionState,
): Promise<ActionState> {
    const session = await getServerSession()

    if (!session) {
        return { error: 'Unauthorized' }
    }

    const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    try {
        const info = await sendMeetingMinutesEmail({
            to: 'all@iscoollab.com',
            subject: `✨ Meeting Minutes: ${data.tabTitle} - ${date}`,
            html: data.html,
            tabTitle: data.tabTitle,
        })

        return { success: true }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        logger.error({ err, context: 'SEND_ACTION' }, 'Email Action Failed')
        return { error: message }
    }
}

/**
 * Server Action to retrieve tab content directly.
 * Replaces the need for /api/extract-notes
 */
import { extractTabContent } from '@/lib/services/tabs'

export async function getContentAction(tabId: string): Promise<{ html: string } | { error: string }> {
    const session = await getServerSession()

    if (!session) {
        return { error: 'Unauthorized' }
    }

    try {
        const result = await extractTabContent(tabId)
        return { html: result.html }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        logger.error({ err, context: 'GET_CONTENT_ACTION' }, 'Content Extraction Failed')
        return { error: message }
    }
}
