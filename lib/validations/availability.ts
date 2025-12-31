import { z } from 'zod';

/**
 * Availability validation schemas
 * Centralized validation schemas for availability management
 */

// ===========================
// Availability Slot Schemas
// ===========================

/**
 * Schema for creating availability slots
 * Used in POST /api/admin/availability
 */
export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 6 = Saturday
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  sessionType: z.enum(['vod-review', 'live-coaching']),
  slotDuration: z.number().optional().default(60),
  isActive: z.boolean().optional().default(true),
});

/**
 * Schema for updating availability slots
 * Used in PATCH /api/admin/availability/[id]
 */
export const updateSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  sessionType: z.enum(['vod-review', 'live-coaching']).optional(),
  slotDuration: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ===========================
// Availability Exception Schemas
// ===========================

/**
 * Schema for creating availability exceptions (blocking time)
 * Used in POST /api/admin/availability/exceptions
 */
export const createExceptionSchema = z.object({
  slotId: z.string().optional(), // Optional - can block without linking to specific slot
  date: z.string().datetime(), // ISO 8601 datetime
  endDate: z.string().datetime(), // ISO 8601 datetime
  reason: z.enum(['blocked', 'holiday']), // 'booked' is created automatically by booking system
  notes: z.string().optional(),
});
