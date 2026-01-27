'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

/**
 * SessionGuard: A client-side listener that monitors the session status.
 * If it detects the 'SessionRevoked' flag from our server-side check,
 * it triggers a graceful logout and redirects to the login page with an error.
 */
export default function SessionGuard() {
    const { data: session } = useSession()

    useEffect(() => {
        if (session?.error === 'SessionRevoked') {
            console.warn('Access revoked. Signing out...')
            // We sign out and redirect to the login page with a specific error flag
            signOut({ callbackUrl: '/login?error=SessionRevoked', redirect: true })
        }
    }, [session])

    return null // This component doesn't render anything
}
