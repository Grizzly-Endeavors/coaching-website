import { z } from 'zod';

/**
 * Authentication validation schemas
 * Centralized validation schemas for authentication
 *
 * Note: Error messages are hardcoded to work in Edge Runtime (middleware)
 * For localized UI validation errors, handle them in the UI layer
 */

/**
 * Schema for login credentials
 * Used in lib/auth.ts for credential validation
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});
