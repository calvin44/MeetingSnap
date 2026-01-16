import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingSnap',
  description: 'Send out meeting minutes',
}

/**
 * RootLayout: Centralizes font management and suppresses hydration warnings
 * caused by browser extensions (e.g., Grammarly).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
