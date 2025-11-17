import { hash, compare } from 'bcryptjs';
import { auth } from './auth';
import { redirect } from 'next/navigation';

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
 * Verify a password against a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }

  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Get the current server-side session
 * Wrapper around NextAuth's auth() function
 * @returns Session object or null if not authenticated
 */
export async function getServerSession() {
  return await auth();
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
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new Error('Unauthorized - Authentication required');
  }

  return session;
}

/**
 * Require authentication for server pages
 * Redirects to login page if not authenticated
 * Use this in page.tsx files
 *
 * @example
 * ```ts
 * export default async function AdminPage() {
 *   await requireAuthPage();
 *   // ... protected page logic
 * }
 * ```
 *
 * @returns Session object
 */
export async function requireAuthPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect('/login');
  }

  return session;
}

/**
 * Check if a user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session && !!session.user;
}

/**
 * Get the current user's ID
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id ?? null;
}

/**
 * Get the current user's email
 * @returns User email or null if not authenticated
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.email ?? null;
}

/**
 * Generate a secure random password
 * Useful for initial admin creation or password reset
 *
 * @param length - Length of the password (default: 16)
 * @returns Randomly generated secure password
 *
 * @example
 * ```ts
 * const password = generateSecurePassword();
 * console.log(password); // "aB3$xY9@mN5!qW2#"
 * ```
 */
export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + symbols;

  // Ensure at least one character from each category
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
