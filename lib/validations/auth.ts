import { z } from 'zod';

/**
 * Authentication validation schemas
 * Centralized validation schemas for authentication
 */

/**
 * Schema for login credentials
 * Used in lib/auth.ts for credential validation
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
