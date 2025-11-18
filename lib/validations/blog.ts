import { z } from 'zod';

/**
 * Validation schemas for blog-related endpoints
 */

// Blog post query parameters schema
export const blogPostQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  tag: z.string().optional(),
});

export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>;
