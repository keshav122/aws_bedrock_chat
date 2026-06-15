import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Check for the password cookie
  const authCookie = request.cookies.get('auth_token');
  const expectedPassword = process.env.APP_PASSWORD;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // If no password is set in the environment, we don't enforce it.
  if (!expectedPassword) {
    return NextResponse.next();
  }

  // If there's an auth cookie and it matches the password, let them in.
  // Note: For a more secure app, we'd hash this or use a real JWT, 
  // but for a simple personal gate, a plain value in an HttpOnly cookie or standard cookie is okay.
  const isAuthenticated = authCookie?.value === expectedPassword;

  if (!isAuthenticated && !isLoginPage) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isLoginPage) {
    // Redirect authenticated users away from the login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};
