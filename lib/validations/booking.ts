import { z } from 'zod';

// Rank options for Overwatch
export const rankOptions = [
  'Bronze 5', 'Bronze 4', 'Bronze 3', 'Bronze 2', 'Bronze 1',
  'Silver 5', 'Silver 4', 'Silver 3', 'Silver 2', 'Silver 1',
  'Gold 5', 'Gold 4', 'Gold 3', 'Gold 2', 'Gold 1',
  'Platinum 5', 'Platinum 4', 'Platinum 3', 'Platinum 2', 'Platinum 1',
  'Diamond 5', 'Diamond 4', 'Diamond 3', 'Diamond 2', 'Diamond 1',
  'Master 5', 'Master 4', 'Master 3', 'Master 2', 'Master 1',
  'Grandmaster 5', 'Grandmaster 4', 'Grandmaster 3', 'Grandmaster 2', 'Grandmaster 1',
  'Top 500',
] as const;

export const roleOptions = ['Tank', 'DPS', 'Support'] as const;

// Replay code validation schema
export const replaySubmissionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  discordTag: z.string().optional(),
  replayCode: z.string()
    .min(6, 'Replay code must be at least 6 characters')
    .max(10, 'Replay code is too long')
    .regex(/^[A-Z0-9]+$/, 'Replay code must contain only uppercase letters and numbers'),
  rank: z.enum(rankOptions, {
    errorMap: () => ({ message: 'Please select your rank' }),
  }),
  role: z.enum(roleOptions, {
    errorMap: () => ({ message: 'Please select your role' }),
  }),
  hero: z.string().min(2, 'Please specify which hero you played').max(50, 'Hero name is too long').optional(),
  notes: z.string().max(500, 'Notes are too long (max 500 characters)').optional(),
});

export type ReplaySubmissionData = z.infer<typeof replaySubmissionSchema>;

export const replayCodeRegex = /^[A-Z0-9]{6,10}$/;
