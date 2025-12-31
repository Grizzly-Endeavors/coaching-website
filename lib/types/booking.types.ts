/**
 * Type definitions for bookings
 * Based on Prisma model: Booking
 */

export interface Booking {
  id: string;
  email: string;
  sessionType: string;
  scheduledAt: string;
  status: string;
  notes: string | null;
}

export type BookingStatus = 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
