import { handlers } from '@/lib/auth';

/**
 * NextAuth.js API Route Handler
 *
 * This handles all NextAuth.js authentication routes:
 * - GET/POST /api/auth/signin - Sign in page and handler
 * - GET/POST /api/auth/signout - Sign out handler
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - Get CSRF token
 * - GET /api/auth/providers - Get configured providers
 *
 * For more information see: https://next-auth.js.org/configuration/initialization#route-handlers-app
 */

export const { GET, POST } = handlers;
