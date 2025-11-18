import { z } from 'zod';
import { emailSchema, nameSchema } from './primitives';

/**
 * Validation schema for contact form submissions
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1,000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Alias for consistency with other schemas
export type ContactFormInput = ContactFormData;
