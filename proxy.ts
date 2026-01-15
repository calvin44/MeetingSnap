import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/auth/error']

/**
 * Proxy Middleware: Handles edge-level authentication and routing.
 * * Order of operations:
 * 1. Health/Internal checks (optional)
 * 2. API security (401 vs Redirect)
 * 3. Auth-page redirection (LoggedIn -> Dashboard)
 * 4. Private-page protection (LoggedOut -> Login)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    // Ensure the secret is provided to avoid decryption failures at the edge
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 1. API Route Protection
  // We exclude auth internal routes to allow login/session refresh flows
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Valid session required' },
        { status: 401 },
      )
    }
    return NextResponse.next()
  }

  // 2. Auth Page Redirection
  // If user is already logged in, they shouldn't see the login page.
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // 3. Root Path Switch
  if (pathname === '/') {
    const target = token ? '/dashboard' : '/login'
    return NextResponse.redirect(new URL(target, req.url))
  }

  // 4. General Page Protection
  const isPublic = PUBLIC_PATHS.includes(pathname)
  const isAuthInternal = pathname.startsWith('/api/auth')

  if (!isPublic && !isAuthInternal && !token) {
    // Use the 'pathname' you already defined at the top
    const loginUrl = new URL('/login', req.url)

    // ARCHITECT TIP: Use req.nextUrl.href instead of req.url
    // req.nextUrl is already a WHATWG object provided by Next.js
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.href)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser icon)
     * - public folder files (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
