import { z } from 'zod';
import { emailSchema, replayCodeSchema as replayCodePrimitive, shortTextSchema } from './primitives';

/**
 * Validation schemas for booking and replay submission
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

// Individual replay code schema with map and notes
export const replayCodeSchema = z.object({
  code: replayCodePrimitive,
  mapName: z.string()
    .min(2, 'Map name is required')
    .max(100, 'Map name is too long'),
  notes: z.string()
    .max(500, 'Notes are too long (max 500 characters)')
    .optional(),
});

// Replay submission schema with multiple codes
export const replaySubmissionSchema = z.object({
  email: emailSchema,
  discordTag: z.string().optional(),
  coachingType: z.enum(coachingTypes, {
    errorMap: () => ({ message: 'Please select a coaching type' }),
  }),
  rank: z.enum(rankOptions, {
    errorMap: () => ({ message: 'Please select your rank' }),
  }),
  role: z.enum(roleOptions, {
    errorMap: () => ({ message: 'Please select your role' }),
  }),
  hero: z.string()
    .min(2, 'Please specify which hero you played')
    .max(50, 'Hero name is too long')
    .optional(),
  replays: z.array(replayCodeSchema)
    .min(1, 'At least one replay code is required')
    .max(5, 'Maximum 5 replay codes allowed'),
});

export type ReplaySubmissionData = z.infer<typeof replaySubmissionSchema>;
export type ReplayCodeData = z.infer<typeof replayCodeSchema>;

// Regex pattern for quick replay code validation
export const replayCodeRegex = /^[A-Z0-9]{6,10}$/;
