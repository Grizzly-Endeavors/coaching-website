import { z } from 'zod';
import { BookingStatus, SubmissionStatus } from '@prisma/client';

/**
 * Admin validation schemas
 * Centralized validation schemas for admin API routes
 */

// ===========================
// Blog Admin Schemas
// ===========================

/**
 * Schema for querying blog posts in admin panel
 * Used in GET /api/admin/blog
 */
export const adminBlogQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  published: z.enum(['true', 'false', 'all']).optional().default('all'),
  sort: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Schema for updating blog posts in admin panel
 * Used in PATCH /api/admin/blog/[id]
 */
export const adminBlogUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens'
  ).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/**
 * Schema for creating new blog posts in admin panel
 * Used in POST /api/admin/blog
 */
export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional().default(false),
});

// ===========================
// Booking Admin Schemas
// ===========================

/**
 * Schema for querying bookings in admin panel
 * Used in GET /api/admin/bookings
 */
export const adminBookingsQuerySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  sort: z.enum(['scheduledAt', 'createdAt', 'updatedAt']).optional().default('scheduledAt'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
  upcoming: z.enum(['true', 'false']).optional(),
});

/**
 * Schema for updating bookings in admin panel
 * Used in PATCH /api/admin/bookings/[id]
 */
export const adminBookingUpdateSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional().or(z.literal('')),
});

// ===========================
// Submission Admin Schemas
// ===========================

/**
 * Schema for querying replay submissions in admin panel
 * Used in GET /api/admin/submissions
 */
export const adminSubmissionsQuerySchema = z.object({
  status: z.nativeEnum(SubmissionStatus).optional(),
  sort: z.enum(['submittedAt', 'reviewedAt', 'status']).optional().default('submittedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(), // Search by submission ID or email
});

/**
 * Schema for updating replay submissions in admin panel
 * Used in PATCH /api/admin/submissions/[id]
 */
export const adminSubmissionUpdateSchema = z.object({
  status: z.nativeEnum(SubmissionStatus).optional(),
  reviewNotes: z.string().optional(),
  reviewUrl: z.string().url().optional().or(z.literal('')),
  sendDiscordNotification: z.boolean().optional().default(false),
});
