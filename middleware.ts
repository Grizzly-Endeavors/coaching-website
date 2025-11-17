import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * Middleware to protect admin routes
 *
 * This middleware runs on every request and checks if the user is authenticated
 * when trying to access admin routes. If not authenticated, redirects to login page.
 *
 * Protected routes: /admin/*
 * Excluded routes: /admin/login (login page itself)
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Check if the request is for an admin route (excluding login page)
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // If trying to access admin route (not login) and not authenticated
  if (isAdminRoute && !isLoginPage && !req.auth) {
    // Build the login URL with callback parameter
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login page, redirect to admin dashboard
  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

/**
 * Configure which routes the middleware should run on
 *
 * This matcher ensures the middleware only runs on:
 * - /admin routes (all admin pages)
 * - /api/admin routes (all admin API endpoints)
 *
 * It excludes:
 * - Static files (_next/static)
 * - Images (_next/image)
 * - Favicon and other public files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
