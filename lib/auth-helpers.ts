import { hash } from 'bcryptjs';
import { auth } from './auth';

/**
 * Number of salt rounds for bcrypt hashing
 * Higher values = more secure but slower
 * 10 is recommended for production
 */
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt with cost factor 10
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length === 0) {
    throw new Error('Password cannot be empty');
  }

  return await hash(password, SALT_ROUNDS);
}

/**
 * Require authentication for API routes and server components
 * Throws error if not authenticated
 * Use this in API routes to protect endpoints
 *
 * @example
 * ```ts
 * export async function GET(request: Request) {
 *   const session = await requireAuth();
 *   // ... protected route logic
 * }
 * ```
 *
 * @returns Session object
 * @throws Error if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error('Unauthorized - Authentication required');
  }

  return session;
}
