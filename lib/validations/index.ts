/**
 * Central export point for all validation schemas
 *
 * Import from this file in your application code:
 * import { contactFormSchema, replaySubmissionSchema, ... } from '@/lib/validations';
 */

// Export primitives for reusable validation schemas
export * from './primitives';

// Export contact form schemas
export * from './contact';

// Export booking and replay submission schemas
export * from './booking';

// Export blog schemas
export * from './blog';
