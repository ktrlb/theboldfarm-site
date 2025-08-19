import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip password protection for development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Check if user is already authenticated
  const authHeader = request.headers.get('authorization')
  
  if (authHeader) {
    const encoded = authHeader.split(' ')[1]
    const decoded = Buffer.from(encoded, 'base64').toString()
    const [username, password] = decoded.split(':')
    
    // Check credentials (you can change these)
    if (username === process.env.SITE_USERNAME && password === process.env.SITE_PASSWORD) {
      return NextResponse.next()
    }
  }

  // Return authentication challenge
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="The Bold Farm"',
      'Content-Type': 'text/plain',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
