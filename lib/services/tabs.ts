import { TabMetadata } from '../types'
import { headers } from 'next/headers'

export async function getDocumentTabs(): Promise<TabMetadata[]> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  try {
    // 1. Grab all headers from the browser's original request
    const requestHeaders = await headers()

    const res = await fetch(`${baseUrl}/api/tabs`, {
      method: 'GET',
      // 2. Pass the entire header object.
      // This ensures Cookies, CSRF tokens, and User-Agents stay intact.
      headers: requestHeaders,
      next: { revalidate: 0 },
    })

    const contentType = res.headers.get('content-type')

    if (!res.ok || !contentType?.includes('application/json')) {
      // This is where your error was logging
      console.error(`Invalid response: ${res.status} ${contentType}`)
      return []
    }

    return await res.json()
  } catch (error) {
    console.error('Tabs Service Error:', error)
    return []
  }
}
