import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow access to /admin/login without authentication
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // If accessing other admin routes without auth, redirect to login
    if (!req.nextauth.token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow /admin/login without token
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }
        // Require token for all other admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  // Protect all /admin routes except /admin/login
  matcher: ['/admin/:path*'],
};
