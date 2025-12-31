/**
 * Type definitions for replay submissions and replay codes
 * Based on Prisma models: ReplaySubmission and ReplayCode
 */

export interface ReplayCode {
  id: string;
  code: string;
  mapName: string;
  notes: string | null;
}

export interface Submission {
  id: string;
  email: string;
  discordTag: string | null;
  coachingType: string;
  rank: string;
  role: string;
  hero: string | null;
  inGameName: string | null;
  status: string;
  reviewNotes: string | null;
  reviewUrl: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  replays: ReplayCode[];
}

export type SubmissionStatus = 'ALL' | 'AWAITING_PAYMENT' | 'PAYMENT_RECEIVED' | 'PAYMENT_FAILED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
