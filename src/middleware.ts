import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  const { pathname } = request.nextUrl

  // When deployed, the sign-up page should redirect to a 404 page
  // Never expose the sign-up page in production
  if (process.env.NODE_ENV === 'production' && pathname === '/signup') {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Redirect to the sign-in page if the user is not authenticated
  if (!sessionCookie && pathname === '/upload') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/signup', '/upload']
}