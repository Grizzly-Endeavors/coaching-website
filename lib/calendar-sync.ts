/**
 * Calendar Sync Module
 *
 * This module handles synchronization between Google Calendar events and the
 * local database Booking model. It ensures that bookings in the database
 * stay in sync with calendar events.
 *
 * Functions:
 * - syncEventToDatabase: Sync a single calendar event to database
 * - syncAllUpcomingEvents: Sync all upcoming events from calendar to database
 * - handleEventCreated: Handle calendar event creation webhook
 * - handleEventUpdated: Handle calendar event update webhook
 * - handleEventDeleted: Handle calendar event deletion webhook
 */

import { prisma } from './prisma';
import { BookingStatus } from '@prisma/client';
import { CalendarEvent, fetchUpcomingBookings, getEventById } from './google-calendar';
import { sendBookingConfirmation } from './email';

/**
 * Extract client email from calendar event attendees
 *
 * Filters out the coach's email to find the client/customer email
 *
 * @param event Calendar event with attendees
 * @returns Client email or null if not found
 */
function extractClientEmail(event: CalendarEvent): string | null {
  const coachEmail = process.env.ADMIN_EMAIL;

  if (!event.attendees || event.attendees.length === 0) {
    return null;
  }

  // Find the first attendee that's not the coach
  const clientAttendee = event.attendees.find(
    (attendee) => attendee.email !== coachEmail
  );

  return clientAttendee?.email || null;
}

/**
 * Convert Google Calendar event status to BookingStatus
 *
 * Maps calendar event status to our database enum
 *
 * @param calendarStatus Google Calendar event status
 * @returns BookingStatus enum value
 */
function mapEventStatusToBookingStatus(calendarStatus?: string): BookingStatus {
  switch (calendarStatus) {
    case 'cancelled':
      return BookingStatus.CANCELLED;
    case 'confirmed':
      return BookingStatus.SCHEDULED;
    case 'tentative':
      return BookingStatus.SCHEDULED;
    default:
      return BookingStatus.SCHEDULED;
  }
}

/**
 * Sync a single calendar event to the database
 *
 * Creates or updates a booking record based on the calendar event.
 * Returns the booking record.
 *
 * @param event Calendar event to sync
 * @param sendEmail Whether to send confirmation email for new bookings
 * @returns Created or updated booking record
 * @throws Error if required data is missing or database operation fails
 */
export async function syncEventToDatabase(
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
  try {
    const clientEmail = extractClientEmail(event);

    if (!clientEmail) {
      throw new Error(`No client email found in event: ${event.id}`);
    }

    const scheduledAt = new Date(event.start.dateTime);
    const sessionType = event.summary || 'Coaching Session';
    const notes = event.description || null;
    const status = mapEventStatusToBookingStatus(event.status);

    // Check if booking already exists
    const existingBooking = await prisma.booking.findUnique({
      where: {
        googleEventId: event.id,
      },
    });

    if (existingBooking) {
      // Update existing booking
      const updatedBooking = await prisma.booking.update({
        where: {
          googleEventId: event.id,
        },
        data: {
          email: clientEmail,
          sessionType,
          scheduledAt,
          status,
          notes,
          updatedAt: new Date(),
        },
      });

      console.log(`Updated booking in database: ${updatedBooking.id} (Event: ${event.id})`);
      return updatedBooking;
    } else {
      // Create new booking
      const newBooking = await prisma.booking.create({
        data: {
          email: clientEmail,
          googleEventId: event.id,
          sessionType,
          scheduledAt,
          status,
          notes,
        },
      });

      console.log(`Created booking in database: ${newBooking.id} (Event: ${event.id})`);

      // Send confirmation email if requested and booking is scheduled
      if (sendEmail && status === BookingStatus.SCHEDULED) {
        sendBookingConfirmation(clientEmail, {
          id: newBooking.id,
          email: newBooking.email,
          sessionType: newBooking.sessionType,
          scheduledAt: newBooking.scheduledAt,
          notes: newBooking.notes,
        })
          .then((result) => {
            if (result.success) {
              console.log(`Booking confirmation email sent to ${clientEmail}`);
            } else {
              console.error(`Failed to send booking confirmation: ${result.error}`);
            }
          })
          .catch((error) => {
            console.error('Error sending booking confirmation:', error);
          });
      }

      return newBooking;
    }
  } catch (error) {
    console.error('Error syncing event to database:', error);
    throw new Error(
      `Failed to sync event ${event.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Sync all upcoming events from Google Calendar to database
 *
 * Fetches upcoming calendar events and ensures they all exist in the database.
 * This is useful for initial sync or periodic reconciliation.
 *
 * @param maxResults Maximum number of events to sync (default: 100)
 * @param sendEmails Whether to send confirmation emails for new bookings
 * @returns Object with sync statistics
 */
export async function syncAllUpcomingEvents(
  maxResults: number = 100,
  sendEmails: boolean = false
): Promise<{
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorDetails: string[];
}> {
  const stats = {
    success: true,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorDetails: [] as string[],
  };

  try {
    console.log('Starting calendar sync...');

    // Fetch upcoming events from Google Calendar
    const events = await fetchUpcomingBookings(maxResults);

    console.log(`Found ${events.length} upcoming events in calendar`);

    // Sync each event to database
    for (const event of events) {
      try {
        // Check if booking already exists to determine if it's new
        const existingBooking = await prisma.booking.findUnique({
          where: { googleEventId: event.id },
        });

        const isNew = !existingBooking;

        // Sync the event
        await syncEventToDatabase(event, sendEmails && isNew);

        stats.synced++;
        if (isNew) {
          stats.created++;
        } else {
          stats.updated++;
        }
      } catch (error) {
        stats.errors++;
        const errorMessage = `Event ${event.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        stats.errorDetails.push(errorMessage);
        console.error(errorMessage);
      }
    }

    if (stats.errors > 0) {
      stats.success = false;
    }

    console.log('Calendar sync completed:');
    console.log(`  Total synced: ${stats.synced}`);
    console.log(`  Created: ${stats.created}`);
    console.log(`  Updated: ${stats.updated}`);
    console.log(`  Errors: ${stats.errors}`);

    return stats;
  } catch (error) {
    console.error('Failed to sync calendar events:', error);
    return {
      success: false,
      synced: 0,
      created: 0,
      updated: 0,
      errors: 1,
      errorDetails: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Handle calendar event creation from webhook
 *
 * Processes a webhook notification for a newly created calendar event.
 * Creates a corresponding booking in the database and sends confirmation email.
 *
 * @param eventId Google Calendar event ID
 * @returns Created booking or null if failed
 */
export async function handleEventCreated(
  eventId: string
): Promise<{
  id: string;
  email: string;
  googleEventId: string;
  sessionType: string;
  scheduledAt: Date;
  status: BookingStatus;
} | null> {
  try {
    console.log(`Processing event creation: ${eventId}`);

    // Fetch the event details from Google Calendar
    const event = await getEventById(eventId);

    // Sync to database with email notification
    const booking = await syncEventToDatabase(event, true);

    console.log(`Successfully processed event creation: ${eventId}`);
    return booking;
  } catch (error) {
    console.error('Error handling event creation:', error);
    return null;
  }
}

/**
 * Handle calendar event update from webhook
 *
 * Processes a webhook notification for an updated calendar event.
 * Updates the corresponding booking in the database.
 *
 * @param eventId Google Calendar event ID
 * @returns Updated booking or null if failed
 */
export async function handleEventUpdated(
  eventId: string
): Promise<{
  id: string;
  email: string;
  googleEventId: string;
  sessionType: string;
  scheduledAt: Date;
  status: BookingStatus;
} | null> {
  try {
    console.log(`Processing event update: ${eventId}`);

    // Fetch the updated event details from Google Calendar
    const event = await getEventById(eventId);

    // Sync to database (don't send email for updates)
    const booking = await syncEventToDatabase(event, false);

    console.log(`Successfully processed event update: ${eventId}`);
    return booking;
  } catch (error) {
    console.error('Error handling event update:', error);
    return null;
  }
}

/**
 * Handle calendar event deletion from webhook
 *
 * Processes a webhook notification for a deleted/cancelled calendar event.
 * Marks the corresponding booking as cancelled in the database.
 *
 * @param eventId Google Calendar event ID
 * @returns Updated booking or null if failed/not found
 */
export async function handleEventDeleted(
  eventId: string
): Promise<{
  id: string;
  email: string;
  googleEventId: string;
  sessionType: string;
  scheduledAt: Date;
  status: BookingStatus;
} | null> {
  try {
    console.log(`Processing event deletion: ${eventId}`);

    // Find the booking in database
    const booking = await prisma.booking.findUnique({
      where: {
        googleEventId: eventId,
      },
    });

    if (!booking) {
      console.log(`Booking not found for deleted event: ${eventId}`);
      return null;
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: {
        googleEventId: eventId,
      },
      data: {
        status: BookingStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });

    console.log(`Successfully marked booking as cancelled: ${updatedBooking.id}`);
    return updatedBooking;
  } catch (error) {
    console.error('Error handling event deletion:', error);
    return null;
  }
}

/**
 * Clean up cancelled events from database
 *
 * Finds bookings that are marked as cancelled in the database but still exist
 * in Google Calendar as active events, and vice versa. Useful for reconciliation.
 *
 * @returns Cleanup statistics
 */
export async function cleanupCancelledEvents(): Promise<{
  success: boolean;
  checked: number;
  updated: number;
  errors: string[];
}> {
  const stats = {
    success: true,
    checked: 0,
    updated: 0,
    errors: [] as string[],
  };

  try {
    // Get all non-cancelled bookings from database
    const bookings = await prisma.booking.findMany({
      where: {
        status: {
          not: BookingStatus.CANCELLED,
        },
      },
    });

    console.log(`Checking ${bookings.length} bookings for cancellation status...`);

    for (const booking of bookings) {
      stats.checked++;

      try {
        // Try to fetch the event from Google Calendar
        const event = await getEventById(booking.googleEventId);

        // If event is cancelled in calendar but not in database, update it
        if (event.status === 'cancelled' && booking.status !== BookingStatus.CANCELLED) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: BookingStatus.CANCELLED,
              updatedAt: new Date(),
            },
          });
          stats.updated++;
          console.log(`Marked booking ${booking.id} as cancelled`);
        }
      } catch (error) {
        // Event not found in calendar - it might have been deleted
        if (error instanceof Error && error.message.includes('not found')) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              status: BookingStatus.CANCELLED,
              updatedAt: new Date(),
            },
          });
          stats.updated++;
          console.log(`Marked booking ${booking.id} as cancelled (event not found)`);
        } else {
          stats.errors.push(
            `Booking ${booking.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    }

    if (stats.errors.length > 0) {
      stats.success = false;
    }

    console.log('Cleanup completed:');
    console.log(`  Checked: ${stats.checked}`);
    console.log(`  Updated: ${stats.updated}`);
    console.log(`  Errors: ${stats.errors.length}`);

    return stats;
  } catch (error) {
    console.error('Failed to cleanup cancelled events:', error);
    return {
      success: false,
      checked: 0,
      updated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
