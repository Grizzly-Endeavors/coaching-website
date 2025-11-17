/**
 * Google Calendar API Integration
 *
 * This module provides functions to interact with Google Calendar API for managing
 * coaching session bookings. It handles authentication, event creation, updates,
 * and cancellations.
 *
 * SETUP REQUIREMENTS:
 *
 * 1. Create a Google Cloud Project:
 *    - Go to https://console.cloud.google.com/
 *    - Create a new project or select an existing one
 *    - Enable the Google Calendar API for your project
 *
 * 2. Create OAuth 2.0 Credentials:
 *    - Go to APIs & Services > Credentials
 *    - Click "Create Credentials" > "OAuth client ID"
 *    - Select "Web application" as application type
 *    - Add authorized redirect URIs (for local testing: http://localhost:3000/api/auth/callback/google)
 *    - Download the credentials JSON file
 *
 * 3. Create a Service Account (Alternative to OAuth for server-side):
 *    - Go to APIs & Services > Credentials
 *    - Click "Create Credentials" > "Service Account"
 *    - Grant necessary permissions
 *    - Create and download a JSON key file
 *    - Share your Google Calendar with the service account email
 *
 * 4. Environment Variables Required:
 *    GOOGLE_CALENDAR_CLIENT_ID - OAuth client ID
 *    GOOGLE_CALENDAR_CLIENT_SECRET - OAuth client secret
 *    GOOGLE_CALENDAR_REFRESH_TOKEN - OAuth refresh token (obtain via OAuth flow)
 *    GOOGLE_CALENDAR_CALENDAR_ID - The calendar ID (usually your email or custom calendar ID)
 *    GOOGLE_CALENDAR_WEBHOOK_SECRET - Secret token for webhook verification
 *
 * 5. Alternative: Service Account (recommended for server-side):
 *    GOOGLE_SERVICE_ACCOUNT_EMAIL - Service account email
 *    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY - Service account private key (from JSON file)
 *    GOOGLE_CALENDAR_CALENDAR_ID - The calendar ID
 *
 * For webhook setup, run: npm run setup-google-calendar
 */

import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Types for calendar events
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string | null;
  start: {
    dateTime: string;
    timeZone?: string | null;
  };
  end: {
    dateTime: string;
    timeZone?: string | null;
  };
  attendees?: Array<{
    email: string;
    displayName?: string | null;
    responseStatus?: string | null;
  }>;
  status?: string | null;
}

export interface CreateBookingParams {
  email: string;
  sessionType: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  timeZone?: string;
}

export interface UpdateBookingParams {
  eventId: string;
  email?: string;
  sessionType?: string;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  timeZone?: string;
}

/**
 * Initialize Google Calendar client with OAuth2 credentials
 *
 * This function creates and authenticates an OAuth2 client for accessing
 * the Google Calendar API. It uses environment variables for credentials.
 *
 * @returns Authenticated calendar API client
 * @throws Error if required environment variables are missing
 */
export function initializeCalendarClient(): calendar_v3.Calendar {
  // Check for service account credentials first (recommended for server-side)
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (serviceAccountEmail && serviceAccountKey) {
    // Use service account authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: serviceAccountKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    return google.calendar({ version: 'v3', auth });
  }

  // Fall back to OAuth2 authentication
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing Google Calendar credentials. Please set GOOGLE_CALENDAR_CLIENT_ID, ' +
      'GOOGLE_CALENDAR_CLIENT_SECRET, and GOOGLE_CALENDAR_REFRESH_TOKEN environment variables, ' +
      'or use service account credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).'
    );
  }

  // Create OAuth2 client
  const oauth2Client = new OAuth2Client(clientId, clientSecret);

  // Set credentials with refresh token
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  // Create calendar client
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  return calendar;
}

/**
 * Get the configured calendar ID from environment variables
 *
 * @returns Calendar ID
 * @throws Error if GOOGLE_CALENDAR_CALENDAR_ID is not set
 */
function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_CALENDAR_ID;

  if (!calendarId) {
    throw new Error(
      'GOOGLE_CALENDAR_CALENDAR_ID environment variable is not set. ' +
      'This should be set to your calendar email or custom calendar ID.'
    );
  }

  return calendarId;
}

/**
 * Fetch upcoming bookings from Google Calendar
 *
 * Retrieves events from the configured Google Calendar, starting from now
 * and extending into the future. Results are ordered by start time.
 *
 * @param maxResults Maximum number of events to fetch (default: 50)
 * @param timeMin Minimum start time (default: now)
 * @param timeMax Maximum start time (optional)
 * @returns Array of calendar events
 * @throws Error if the API request fails
 */
export async function fetchUpcomingBookings(
  maxResults: number = 50,
  timeMin?: Date,
  timeMax?: Date
): Promise<CalendarEvent[]> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.list({
      calendarId,
      timeMin: (timeMin || new Date()).toISOString(),
      timeMax: timeMax?.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Transform to our CalendarEvent type
    return events
      .filter((event): event is calendar_v3.Schema$Event =>
        !!event.id && !!event.start?.dateTime
      )
      .map((event) => ({
        id: event.id!,
        summary: event.summary || 'Untitled Event',
        description: event.description || undefined,
        start: {
          dateTime: event.start!.dateTime!,
          timeZone: event.start!.timeZone,
        },
        end: {
          dateTime: event.end!.dateTime!,
          timeZone: event.end!.timeZone,
        },
        attendees: event.attendees?.map((attendee) => ({
          email: attendee.email!,
          displayName: attendee.displayName,
          responseStatus: attendee.responseStatus,
        })),
        status: event.status,
      }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error(
      `Failed to fetch calendar events: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Create a new booking in Google Calendar
 *
 * Creates a calendar event for a coaching session with the specified details.
 * Automatically sends email invitations to the attendee.
 *
 * @param params Booking parameters (email, session type, times, etc.)
 * @returns Created calendar event
 * @throws Error if the API request fails
 */
export async function createBooking(
  params: CreateBookingParams
): Promise<CalendarEvent> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();
    const coachEmail = process.env.ADMIN_EMAIL;

    if (!coachEmail) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }

    const event: calendar_v3.Schema$Event = {
      summary: params.sessionType,
      description: params.notes || 'Overwatch coaching session',
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: params.timeZone || 'UTC',
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: params.timeZone || 'UTC',
      },
      attendees: [
        {
          email: params.email,
          displayName: params.email.split('@')[0], // Use email username as display name
        },
        {
          email: coachEmail,
          organizer: true,
        },
      ],
      // Send email notifications to attendees
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      sendUpdates: 'all', // Send email notifications
    });

    const createdEvent = response.data;

    if (!createdEvent.id || !createdEvent.start?.dateTime || !createdEvent.end?.dateTime) {
      throw new Error('Invalid event created - missing required fields');
    }

    return {
      id: createdEvent.id,
      summary: createdEvent.summary || params.sessionType,
      description: createdEvent.description,
      start: {
        dateTime: createdEvent.start.dateTime,
        timeZone: createdEvent.start.timeZone,
      },
      end: {
        dateTime: createdEvent.end.dateTime,
        timeZone: createdEvent.end.timeZone,
      },
      attendees: createdEvent.attendees?.map((attendee) => ({
        email: attendee.email!,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
      status: createdEvent.status,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error(
      `Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Update an existing booking in Google Calendar
 *
 * Updates calendar event details such as time, attendees, or description.
 * Sends email notifications about the changes.
 *
 * @param params Update parameters (must include eventId)
 * @returns Updated calendar event
 * @throws Error if the API request fails or event not found
 */
export async function updateBooking(
  params: UpdateBookingParams
): Promise<CalendarEvent> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();

    // First, fetch the existing event
    const existingEvent = await calendar.events.get({
      calendarId,
      eventId: params.eventId,
    });

    if (!existingEvent.data) {
      throw new Error(`Event not found: ${params.eventId}`);
    }

    // Prepare the update
    const updatedFields: calendar_v3.Schema$Event = {
      ...existingEvent.data,
    };

    // Update fields if provided
    if (params.sessionType) {
      updatedFields.summary = params.sessionType;
    }

    if (params.notes !== undefined) {
      updatedFields.description = params.notes;
    }

    if (params.startTime && params.endTime) {
      updatedFields.start = {
        dateTime: params.startTime.toISOString(),
        timeZone: params.timeZone || updatedFields.start?.timeZone || 'UTC',
      };
      updatedFields.end = {
        dateTime: params.endTime.toISOString(),
        timeZone: params.timeZone || updatedFields.end?.timeZone || 'UTC',
      };
    }

    if (params.email) {
      const coachEmail = process.env.ADMIN_EMAIL;
      updatedFields.attendees = [
        {
          email: params.email,
          displayName: params.email.split('@')[0],
        },
        {
          email: coachEmail!,
          organizer: true,
        },
      ];
    }

    const response = await calendar.events.update({
      calendarId,
      eventId: params.eventId,
      requestBody: updatedFields,
      sendUpdates: 'all', // Send email notifications about changes
    });

    const updated = response.data;

    if (!updated.id || !updated.start?.dateTime || !updated.end?.dateTime) {
      throw new Error('Invalid event updated - missing required fields');
    }

    return {
      id: updated.id,
      summary: updated.summary || 'Untitled Event',
      description: updated.description,
      start: {
        dateTime: updated.start.dateTime,
        timeZone: updated.start.timeZone,
      },
      end: {
        dateTime: updated.end.dateTime,
        timeZone: updated.end.timeZone,
      },
      attendees: updated.attendees?.map((attendee) => ({
        email: attendee.email!,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
      status: updated.status,
    };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw new Error(
      `Failed to update booking: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Cancel a booking in Google Calendar
 *
 * Marks the calendar event as cancelled and sends cancellation notifications
 * to all attendees.
 *
 * @param eventId Google Calendar event ID
 * @returns void
 * @throws Error if the API request fails or event not found
 */
export async function cancelBooking(eventId: string): Promise<void> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();

    // Delete the event (sends cancellation emails)
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: 'all', // Send cancellation notifications
    });

    console.log(`Successfully cancelled booking: ${eventId}`);
  } catch (error) {
    console.error('Error cancelling calendar event:', error);
    throw new Error(
      `Failed to cancel booking: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get a single event by ID from Google Calendar
 *
 * Fetches detailed information about a specific calendar event.
 *
 * @param eventId Google Calendar event ID
 * @returns Calendar event details
 * @throws Error if the API request fails or event not found
 */
export async function getEventById(eventId: string): Promise<CalendarEvent> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();

    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    const event = response.data;

    if (!event.id || !event.start?.dateTime || !event.end?.dateTime) {
      throw new Error('Invalid event data - missing required fields');
    }

    return {
      id: event.id,
      summary: event.summary || 'Untitled Event',
      description: event.description,
      start: {
        dateTime: event.start.dateTime,
        timeZone: event.start.timeZone,
      },
      end: {
        dateTime: event.end.dateTime,
        timeZone: event.end.timeZone,
      },
      attendees: event.attendees?.map((attendee) => ({
        email: attendee.email!,
        displayName: attendee.displayName,
        responseStatus: attendee.responseStatus,
      })),
      status: event.status,
    };
  } catch (error) {
    console.error('Error fetching calendar event:', error);
    throw new Error(
      `Failed to fetch event: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify webhook signature for security
 *
 * Validates that webhook notifications are coming from Google Calendar
 * by checking the channel token against our configured secret.
 *
 * This is a simple token-based verification. For production, consider
 * using the x-goog-resource-state header and other security measures.
 *
 * @param channelToken Token from the webhook request header (x-goog-channel-token)
 * @returns true if valid, false otherwise
 */
export function verifyWebhookSignature(channelToken: string | null): boolean {
  const expectedToken = process.env.GOOGLE_CALENDAR_WEBHOOK_SECRET;

  if (!expectedToken) {
    console.error('GOOGLE_CALENDAR_WEBHOOK_SECRET is not configured');
    return false;
  }

  if (!channelToken) {
    console.error('No channel token provided in webhook request');
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  // In production, consider using crypto.timingSafeEqual
  return channelToken === expectedToken;
}

/**
 * Setup a webhook channel to receive calendar change notifications
 *
 * Creates a watch channel that will send notifications to your webhook endpoint
 * whenever events are created, updated, or deleted in the calendar.
 *
 * Note: Google Calendar watch channels expire after a maximum of 1 week (or less).
 * You'll need to renew them periodically. Consider setting up a cron job.
 *
 * @param webhookUrl Full URL to your webhook endpoint
 * @param channelId Unique identifier for this webhook channel
 * @returns Channel information including expiration time
 * @throws Error if the API request fails
 */
export async function setupWebhook(
  webhookUrl: string,
  channelId: string = `coaching-calendar-${Date.now()}`
): Promise<{
  id: string;
  resourceId: string;
  expiration: string;
}> {
  try {
    const calendar = initializeCalendarClient();
    const calendarId = getCalendarId();
    const webhookSecret = process.env.GOOGLE_CALENDAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('GOOGLE_CALENDAR_WEBHOOK_SECRET is not set');
    }

    const response = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: webhookUrl,
        token: webhookSecret, // This will be sent with each notification for verification
      },
    });

    const channel = response.data;

    if (!channel.id || !channel.resourceId || !channel.expiration) {
      throw new Error('Invalid channel response from Google Calendar');
    }

    console.log('Webhook channel created successfully:');
    console.log(`  Channel ID: ${channel.id}`);
    console.log(`  Resource ID: ${channel.resourceId}`);
    console.log(`  Expires: ${new Date(parseInt(channel.expiration)).toISOString()}`);

    return {
      id: channel.id,
      resourceId: channel.resourceId,
      expiration: channel.expiration,
    };
  } catch (error) {
    console.error('Error setting up webhook:', error);
    throw new Error(
      `Failed to setup webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Stop receiving webhook notifications for a channel
 *
 * Cancels an existing watch channel. Call this when you no longer need
 * notifications or before creating a new channel with the same ID.
 *
 * @param channelId Channel ID to stop
 * @param resourceId Resource ID from the channel creation response
 * @returns void
 * @throws Error if the API request fails
 */
export async function stopWebhook(
  channelId: string,
  resourceId: string
): Promise<void> {
  try {
    const calendar = initializeCalendarClient();

    await calendar.channels.stop({
      requestBody: {
        id: channelId,
        resourceId: resourceId,
      },
    });

    console.log(`Successfully stopped webhook channel: ${channelId}`);
  } catch (error) {
    console.error('Error stopping webhook:', error);
    throw new Error(
      `Failed to stop webhook: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * WRAPPER FUNCTIONS - Alternative function names for compatibility
 */

/**
 * List upcoming events from Google Calendar
 * Alias for fetchUpcomingBookings()
 *
 * @param maxResults Maximum number of events to fetch (default: 50)
 * @returns Array of calendar events
 */
export async function listUpcomingEvents(maxResults: number = 50): Promise<CalendarEvent[]> {
  return fetchUpcomingBookings(maxResults);
}

/**
 * Create a new event in Google Calendar
 * Alias for createBooking()
 *
 * @param eventData Event parameters
 * @returns Created calendar event
 */
export async function createEvent(eventData: CreateBookingParams): Promise<CalendarEvent> {
  return createBooking(eventData);
}

/**
 * Update an existing event in Google Calendar
 * Alias for updateBooking()
 *
 * @param eventId Google Calendar event ID
 * @param eventData Update parameters
 * @returns Updated calendar event
 */
export async function updateEvent(
  eventId: string,
  eventData: Partial<CreateBookingParams>
): Promise<CalendarEvent> {
  return updateBooking({
    eventId,
    ...eventData,
  });
}

/**
 * Delete an event from Google Calendar
 * Alias for cancelBooking()
 *
 * @param eventId Google Calendar event ID
 * @returns void
 */
export async function deleteEvent(eventId: string): Promise<void> {
  return cancelBooking(eventId);
}

/**
 * Setup Google Calendar webhook for push notifications
 * Alias for setupWebhook()
 *
 * @param webhookUrl Full URL to your webhook endpoint
 * @returns Channel information including expiration time
 */
export async function setupCalendarWebhook(
  webhookUrl: string
): Promise<{ id: string; resourceId: string; expiration: string }> {
  return setupWebhook(webhookUrl);
}

/**
 * Stop Google Calendar webhook notifications
 * Alias for stopWebhook()
 *
 * @param channelId Channel ID to stop
 * @param resourceId Resource ID from the channel creation response
 * @returns void
 */
export async function stopCalendarWebhook(
  channelId: string,
  resourceId: string
): Promise<void> {
  return stopWebhook(channelId, resourceId);
}
