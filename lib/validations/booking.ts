import { z } from 'zod';
import { emailSchema, replayCodeSchema as replayCodeStringSchema, shortTextSchema } from './primitives';

/**
 * Validation schemas for booking and replay submission
 *
 * Note: Error messages are hardcoded to work in Edge Runtime
 * For localized UI validation errors, handle them in the UI layer
 */

// Rank options for Overwatch (consolidated tiers)
export const rankOptions = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
  'Master',
  'Grandmaster',
  'Top 500',
] as const;

export const roleOptions = ['Tank', 'DPS', 'Support'] as const;

export const coachingTypes = ['review-async', 'vod-review', 'live-coaching'] as const;

// Individual replay code object schema with map and notes
// Note: The string validator (replayCodeStringSchema) is available from '@/lib/validations/primitives'
export const replayCodeObjectSchema = z.object({
  code: replayCodeStringSchema,
  mapName: z.string()
    .min(2, 'Map name is required')
    .max(100, 'Map name must not exceed 100 characters'),
  notes: z.string()
    .max(500, 'Notes must not exceed 500 characters')
    .optional(),
});

// Replay submission schema with multiple codes
export const replaySubmissionSchema = z.object({
  email: emailSchema,
  discordTag: z.string().optional(),
  coachingType: z.enum(coachingTypes, {
    message: 'Please select a coaching type',
  }),
  rank: z.enum(rankOptions, {
    message: 'Please select your rank',
  }),
  role: z.enum(roleOptions, {
    message: 'Please select your role',
  }),
  hero: z.string()
    .min(2, 'Hero name must be at least 2 characters')
    .max(50, 'Hero name must not exceed 50 characters')
    .optional(),
  inGameName: z.string()
    .min(1, 'In-game name is required')
    .max(50, 'In-game name must not exceed 50 characters')
    .optional(), // Optional to match existing schema pattern, but can be enforced if needed
  replays: z.array(replayCodeObjectSchema)
    .min(1, 'At least one replay code is required')
    .max(5, 'Maximum 5 replay codes allowed'),
});

export type ReplaySubmissionData = z.infer<typeof replaySubmissionSchema>;
export type ReplayCodeData = z.infer<typeof replayCodeObjectSchema>;

// Regex pattern for quick replay code validation
export const replayCodeRegex = /^[A-Z0-9]{6,10}$/;
