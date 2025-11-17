import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/email';
import { BookingStatus } from '@prisma/client';

/**
 * POST /api/webhooks/google-calendar
 * Handle Google Calendar webhook notifications
 *
 * This endpoint receives notifications from Google Calendar when events are created,
 * updated, or deleted. It syncs the calendar events with the local database and
 * sends confirmation emails to clients.
 *
 * Authentication: Webhook secret token verification
 *
 * Headers:
 * - x-goog-channel-id: Channel ID for the webhook
 * - x-goog-channel-token: Secret token for verification
 * - x-goog-resource-id: Resource ID
 * - x-goog-resource-state: sync, exists, not_exists
 * - x-goog-message-number: Message sequence number
 *
 * Response: 200 OK (always return 200 to prevent webhook retry storms)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature/token for security
    const channelToken = request.headers.get('x-goog-channel-token');
    const expectedToken = process.env.GOOGLE_CALENDAR_WEBHOOK_SECRET;

    if (!expectedToken) {
      console.error('GOOGLE_CALENDAR_WEBHOOK_SECRET is not configured');
      // Still return 200 to prevent retry storms
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (channelToken !== expectedToken) {
      console.error('Invalid webhook token received');
      // Return 401 for invalid authentication
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid webhook token',
        },
        { status: 401 }
      );
    }

    // Get webhook metadata from headers
    const resourceState = request.headers.get('x-goog-resource-state');
    const channelId = request.headers.get('x-goog-channel-id');

    console.log(`Received Google Calendar webhook: ${resourceState} (channel: ${channelId})`);

    // Handle sync notifications (initial webhook setup)
    if (resourceState === 'sync') {
      console.log('Webhook sync notification received');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Parse request body (Google Calendar event data)
    let eventData;
    try {
      const body = await request.json();
      eventData = body;
    } catch (error) {
      console.error('Failed to parse webhook body:', error);
      // Return 200 anyway to acknowledge receipt
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // TODO: Add rate limiting per channel ID to prevent abuse

    // Extract event information from Google Calendar event
    // Note: The actual structure may vary. This is a simplified version.
    // You may need to adjust based on the actual webhook payload structure.
    const {
      id: googleEventId,
      summary,
      description,
      start,
      end,
      attendees,
      status: eventStatus,
    } = eventData;

    if (!googleEventId) {
      console.error('No event ID in webhook payload');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Extract client email from attendees
    // Assuming the coach's email is in process.env and client is the other attendee
    const coachEmail = process.env.ADMIN_EMAIL;
    const clientEmail = attendees?.find(
      (attendee: any) => attendee.email !== coachEmail
    )?.email;

    if (!clientEmail) {
      console.error('No client email found in event attendees');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Parse scheduled time
    const scheduledAt = start?.dateTime || start?.date;
    if (!scheduledAt) {
      console.error('No start time in event');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const scheduledDate = new Date(scheduledAt);

    // Determine booking status based on event status
    let bookingStatus: BookingStatus = BookingStatus.SCHEDULED;
    if (eventStatus === 'cancelled') {
      bookingStatus = BookingStatus.CANCELLED;
    }

    // Determine session type from summary or description
    const sessionType = summary || 'Coaching Session';

    // Check if booking already exists (update) or needs to be created
    const existingBooking = await prisma.booking.findUnique({
      where: {
        googleEventId,
      },
    });

    if (existingBooking) {
      // Update existing booking
      const updatedBooking = await prisma.booking.update({
        where: {
          googleEventId,
        },
        data: {
          email: clientEmail,
          sessionType,
          scheduledAt: scheduledDate,
          status: bookingStatus,
          notes: description || null,
          updatedAt: new Date(),
        },
      });

      console.log(`Updated booking: ${updatedBooking.id} (Google Event: ${googleEventId})`);

      // If event was cancelled, don't send confirmation email
      if (bookingStatus === BookingStatus.CANCELLED) {
        console.log('Event cancelled, skipping confirmation email');
        return NextResponse.json({ received: true, updated: true }, { status: 200 });
      }
    } else {
      // Create new booking
      const newBooking = await prisma.booking.create({
        data: {
          email: clientEmail,
          googleEventId,
          sessionType,
          scheduledAt: scheduledDate,
          status: bookingStatus,
          notes: description || null,
        },
      });

      console.log(`Created booking: ${newBooking.id} (Google Event: ${googleEventId})`);

      // Send confirmation email to client (non-blocking)
      if (bookingStatus === BookingStatus.SCHEDULED) {
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
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json(
      {
        received: true,
        processed: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Google Calendar webhook:', error);

    // Log error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Always return 200 to prevent webhook retry storms
    // Even on error, we acknowledge receipt
    return NextResponse.json(
      {
        received: true,
        error: 'Processing error',
      },
      { status: 200 }
    );
  }
}

/**
 * GET /api/webhooks/google-calendar
 * Health check endpoint for webhook configuration
 *
 * This can be used to verify the webhook endpoint is accessible
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'active',
      message: 'Google Calendar webhook endpoint is active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
