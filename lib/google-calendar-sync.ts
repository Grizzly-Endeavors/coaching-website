/**
 * Google Calendar Sync Module
 *
 * This module provides high-level functions for synchronizing Google Calendar events
 * with the local database. It wraps the calendar-sync module with convenient function
 * names for easy integration.
 *
 * Functions:
 * - syncCalendarToDatabase: Sync all upcoming events from calendar to database
 * - processCalendarEvent: Process a single calendar event and sync to database
 *
 * This module is used by:
 * - Webhook handlers to process calendar notifications
 * - Scheduled jobs to keep calendar and database in sync
 * - Admin scripts for manual synchronization
 */

import {
  syncEventToDatabase,
  syncAllUpcomingEvents,
  handleEventCreated,
  handleEventUpdated,
  handleEventDeleted,
  cleanupCancelledEvents,
} from './calendar-sync';
import { CalendarEvent } from './google-calendar';
import { BookingStatus } from '@prisma/client';

/**
 * Sync all upcoming calendar events to the database
 *
 * Fetches upcoming events from Google Calendar and ensures they all exist
 * in the local database. This is useful for:
 * - Initial setup/sync
 * - Periodic reconciliation (e.g., daily cron job)
 * - Manual admin-triggered sync
 *
 * @param maxResults Maximum number of events to sync (default: 100)
 * @param sendConfirmationEmails Whether to send confirmation emails for new bookings (default: false)
 * @returns Sync statistics with counts of created/updated/failed syncs
 *
 * @example
 * const result = await syncCalendarToDatabase(50, false);
 * console.log(`Synced ${result.synced} events: ${result.created} new, ${result.updated} updated`);
 */
export async function syncCalendarToDatabase(
  maxResults: number = 100,
  sendConfirmationEmails: boolean = false
): Promise<{
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}> {
  return syncAllUpcomingEvents(maxResults, sendConfirmationEmails);
}

/**
 * Process a single calendar event and sync to database
 *
 * Takes a Google Calendar event and creates or updates the corresponding
 * booking in the database. Extracts client email from attendees and maps
 * calendar event fields to the Booking model.
 *
 * This function:
 * - Extracts client email from event attendees (filters out coach email)
 * - Maps calendar event to Booking model fields
 * - Creates new booking if it doesn't exist
 * - Updates existing booking if it already exists
 * - Handles event cancellations by updating booking status
 * - Optionally sends confirmation email for new bookings
 *
 * @param event Calendar event to process
 * @param sendEmail Whether to send confirmation email for new bookings (default: false)
 * @returns Created or updated booking record
 * @throws Error if client email is not found or database operation fails
 *
 * @example
 * const event = await getEventById('event123');
 * const booking = await processCalendarEvent(event, true);
 * console.log(`Booking created/updated: ${booking.id}`);
 */
export async function processCalendarEvent(
  event: CalendarEvent,
  sendEmail: boolean = false
): Promise<{
  id: string;
  email: string;
  googleEventId: string;
  sessionType: string;
  scheduledAt: Date;
  status: BookingStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}> {
  return syncEventToDatabase(event, sendEmail);
}

/**
 * RE-EXPORT: Additional webhook handler functions
 *
 * These functions are used by the webhook endpoint to handle different
 * types of calendar notifications.
 */

/**
 * Handle calendar event creation notification
 *
 * Processes webhook notification for newly created events.
 * Fetches the event from Google Calendar and creates a booking in the database.
 *
 * @param eventId Google Calendar event ID
 * @returns Created booking or null if failed
 */
export { handleEventCreated };

/**
 * Handle calendar event update notification
 *
 * Processes webhook notification for updated events.
 * Fetches the latest event data and updates the booking in the database.
 *
 * @param eventId Google Calendar event ID
 * @returns Updated booking or null if failed
 */
export { handleEventUpdated };

/**
 * Handle calendar event deletion notification
 *
 * Processes webhook notification for deleted/cancelled events.
 * Marks the corresponding booking as cancelled in the database.
 *
 * @param eventId Google Calendar event ID
 * @returns Updated booking or null if not found
 */
export { handleEventDeleted };

/**
 * Clean up cancelled events
 *
 * Reconciles booking statuses between Google Calendar and database.
 * Finds bookings that are cancelled in calendar but not in database, and vice versa.
 *
 * @returns Cleanup statistics
 */
export { cleanupCancelledEvents };

/**
 * Type definitions
 */
export type { CalendarEvent } from './google-calendar';
export { BookingStatus } from '@prisma/client';
