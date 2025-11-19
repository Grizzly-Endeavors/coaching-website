import { hash } from 'bcryptjs';

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
