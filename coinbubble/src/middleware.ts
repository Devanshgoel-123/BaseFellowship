import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow access to the game page without authentication
  if (request.nextUrl.pathname === '/game') {
    return NextResponse.next();
  }

  // For other pages, continue with your existing auth logic
  // ...
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
