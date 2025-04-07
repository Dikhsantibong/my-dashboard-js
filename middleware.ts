import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /admin)
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // If the path is public and user is logged in, redirect to appropriate dashboard
  if (isPublicPath && token) {
    try {
      // Try to get user data from localStorage (if available)
      const userData = request.cookies.get('user')?.value
      if (userData) {
        const user = JSON.parse(decodeURIComponent(userData))
        if (user.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (user.role === 'VOTER') {
          return NextResponse.redirect(new URL('/user-dashboard', request.url))
        }
      }
    } catch (error) {
      // If there's an error parsing user data, continue with the request
      console.error('Error parsing user data:', error)
    }
  }

  // If the path requires authentication and user is not logged in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/user-dashboard/:path*',
  ],
}
