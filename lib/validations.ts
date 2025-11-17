import { z } from 'zod';

/**
 * Validation schemas for API endpoints
 */

// Import the main replay submission schema from booking validations
export { replaySubmissionSchema, type ReplaySubmissionData as ReplaySubmissionInput } from './validations/booking';

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// Blog post query params schema
export const blogPostQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  tag: z.string().optional(),
});

export type BlogPostQuery = z.infer<typeof blogPostQuerySchema>;

// Google Calendar webhook schema (simplified)
export const googleCalendarWebhookSchema = z.object({
  kind: z.string(),
  id: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  start: z.object({
    dateTime: z.string().optional(),
    date: z.string().optional(),
  }),
  end: z.object({
    dateTime: z.string().optional(),
    date: z.string().optional(),
  }),
  attendees: z
    .array(
      z.object({
        email: z.string().email(),
        responseStatus: z.string().optional(),
      })
    )
    .optional(),
});

export type GoogleCalendarWebhookInput = z.infer<typeof googleCalendarWebhookSchema>;
