# Google Calendar Integration Setup Guide

This guide will walk you through setting up Google Calendar integration for your Overwatch coaching website. The integration enables automatic synchronization of coaching session bookings between Google Calendar and your application's database.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Part 1: Create Google Cloud Project](#part-1-create-google-cloud-project)
4. [Part 2: Enable Google Calendar API](#part-2-enable-google-calendar-api)
5. [Part 3: Choose Authentication Method](#part-3-choose-authentication-method)
   - [Option A: Service Account (Recommended)](#option-a-service-account-recommended)
   - [Option B: OAuth 2.0](#option-b-oauth-20)
6. [Part 4: Configure Google Calendar](#part-4-configure-google-calendar)
7. [Part 5: Configure Environment Variables](#part-5-configure-environment-variables)
8. [Part 6: Set Up Webhook](#part-6-set-up-webhook)
9. [Part 7: Testing](#part-7-testing)
10. [Webhook Renewal](#webhook-renewal)
11. [Troubleshooting](#troubleshooting)
12. [Advanced Configuration](#advanced-configuration)

---

## Overview

The Google Calendar integration provides:

- **Automatic Booking Sync**: When clients book appointments through Google Calendar, they're automatically added to your database
- **Real-time Updates**: Webhook notifications ensure your database stays in sync with calendar changes
- **Email Notifications**: Automatic confirmation emails sent to clients when bookings are created
- **Two-way Integration**: Bookings created in your app can be added to Google Calendar (optional)

### How It Works

1. Client books a session using Google Calendar appointment schedules
2. Google sends a webhook notification to your application
3. Application processes the event and creates/updates booking in database
4. Confirmation email is sent to the client
5. Admin can manage bookings from both Google Calendar and the admin panel

---

## Prerequisites

Before starting, ensure you have:

- A Google account with access to Google Cloud Console
- Admin access to this application
- Your application deployed and accessible via HTTPS (for webhooks)
  - For local testing, you can use [ngrok](https://ngrok.com/) to create a public URL
- Basic understanding of environment variables and terminal commands

---

## Part 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project**
   - Click the project dropdown at the top of the page
   - Click "NEW PROJECT"
   - Enter a project name (e.g., "Overwatch Coaching")
   - Leave the organization field as default (No organization)
   - Click "CREATE"

3. **Select Your Project**
   - Once created, make sure your new project is selected in the project dropdown

---

## Part 2: Enable Google Calendar API

1. **Navigate to APIs & Services**
   - In the Google Cloud Console sidebar, click "APIs & Services" > "Library"
   - Or visit: [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)

2. **Search for Calendar API**
   - In the search bar, type "Google Calendar API"
   - Click on "Google Calendar API" from the results

3. **Enable the API**
   - Click the "ENABLE" button
   - Wait for the API to be enabled (takes a few seconds)

---

## Part 3: Choose Authentication Method

You need to choose between **Service Account** (recommended) or **OAuth 2.0** authentication.

### Option A: Service Account (Recommended)

Service accounts are ideal for server-to-server communication and don't require user interaction.

#### Step 1: Create Service Account

1. **Navigate to Service Accounts**
   - Go to "APIs & Services" > "Credentials"
   - Or visit: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

2. **Create Service Account**
   - Click "CREATE CREDENTIALS" > "Service account"
   - Enter a service account name (e.g., "calendar-sync")
   - Add a description (e.g., "Service account for calendar synchronization")
   - Click "CREATE AND CONTINUE"

3. **Grant Permissions** (Optional)
   - You can skip this step for calendar access
   - Click "CONTINUE"

4. **Create Key**
   - Click "DONE" to create the service account
   - In the service accounts list, click on your newly created service account
   - Go to the "KEYS" tab
   - Click "ADD KEY" > "Create new key"
   - Select "JSON" format
   - Click "CREATE"
   - **IMPORTANT**: Save this JSON file securely - you'll need it for environment variables

#### Step 2: Share Calendar with Service Account

1. **Get Service Account Email**
   - From the downloaded JSON file, find the `client_email` field
   - It looks like: `calendar-sync@your-project.iam.gserviceaccount.com`

2. **Share Your Calendar**
   - Open [Google Calendar](https://calendar.google.com/)
   - Find the calendar you want to use (or create a new one)
   - Click the three dots next to the calendar name
   - Select "Settings and sharing"
   - Scroll to "Share with specific people"
   - Click "Add people"
   - Paste the service account email
   - Set permission to "Make changes to events"
   - Click "Send"

3. **Get Calendar ID**
   - While in calendar settings, scroll to "Integrate calendar"
   - Copy the "Calendar ID" (looks like an email address)
   - Save this for environment variables

#### Step 3: Configure Environment Variables

From your downloaded JSON file, extract:

```bash
# Service Account Email
GOOGLE_SERVICE_ACCOUNT_EMAIL="calendar-sync@your-project.iam.gserviceaccount.com"

# Service Account Private Key (from JSON file)
# IMPORTANT: Keep the quotes and newlines exactly as shown
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w...\n-----END PRIVATE KEY-----\n"

# Calendar ID from calendar settings
GOOGLE_CALENDAR_CALENDAR_ID="your-email@gmail.com"

# Generate a random secret for webhook verification
GOOGLE_CALENDAR_WEBHOOK_SECRET="your_random_secret_here"
```

**To generate a webhook secret:**
```bash
openssl rand -hex 32
```

### Option B: OAuth 2.0

OAuth 2.0 requires initial user authentication but provides more granular access control.

#### Step 1: Create OAuth 2.0 Credentials

1. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (or "Internal" if using Google Workspace)
   - Click "CREATE"
   - Fill in required fields:
     - App name: "Overwatch Coaching"
     - User support email: Your email
     - Developer contact information: Your email
   - Click "SAVE AND CONTINUE"
   - Add scopes: Click "ADD OR REMOVE SCOPES"
     - Search for and add: `https://www.googleapis.com/auth/calendar`
   - Click "SAVE AND CONTINUE"
   - Click "BACK TO DASHBOARD"

2. **Create OAuth Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Click "CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Calendar Integration"
   - Authorized redirect URIs:
     - For production: `https://your-domain.com/api/auth/callback/google`
     - For development: `http://localhost:3000/api/auth/callback/google`
   - Click "CREATE"
   - **Save your Client ID and Client Secret**

#### Step 2: Get Refresh Token

You need to complete the OAuth flow once to get a refresh token.

1. **Install Google's OAuth Playground** (Easy method)
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
   - Click the gear icon (⚙️) in the top right
   - Check "Use your own OAuth credentials"
   - Enter your Client ID and Client Secret
   - Close the settings

2. **Authorize Calendar Access**
   - In the left sidebar under "Step 1", find "Calendar API v3"
   - Check the box for `https://www.googleapis.com/auth/calendar`
   - Click "Authorize APIs"
   - Sign in with your Google account
   - Click "Allow" to grant permissions

3. **Get Refresh Token**
   - Click "Exchange authorization code for tokens"
   - Copy the "Refresh token" value
   - Save this for environment variables

#### Step 3: Configure Environment Variables

```bash
# OAuth Client ID and Secret
GOOGLE_CALENDAR_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CALENDAR_CLIENT_SECRET="your-client-secret"

# Refresh Token from OAuth flow
GOOGLE_CALENDAR_REFRESH_TOKEN="your-refresh-token"

# Calendar ID (usually your email)
GOOGLE_CALENDAR_CALENDAR_ID="your-email@gmail.com"

# Generate a random secret for webhook verification
GOOGLE_CALENDAR_WEBHOOK_SECRET="your_random_secret_here"
```

---

## Part 4: Configure Google Calendar

### Set Up Appointment Schedules

Google Calendar appointment schedules make it easy for clients to book time slots.

1. **Open Google Calendar**
   - Go to [https://calendar.google.com/](https://calendar.google.com/)

2. **Create Appointment Schedule**
   - Click the "+" button next to "Other calendars"
   - Select "Create new calendar" if you want a separate coaching calendar
   - Or use your main calendar

3. **Enable Appointment Slots**
   - Click on a time slot in your calendar
   - Select "Appointment schedule"
   - Configure your availability:
     - **Title**: "Overwatch Coaching Session"
     - **Duration**: 60 minutes (or your preferred session length)
     - **Availability**: Set your coaching hours
     - **Booking window**: How far in advance clients can book
     - **Minimum time before booking**: Prevent last-minute bookings

4. **Get Booking Page Link**
   - After creating the appointment schedule, Google provides a booking page URL
   - Share this link with clients (add it to your website's booking page)

5. **Customize Booking Form**
   - You can customize questions to ask clients during booking
   - Add fields for:
     - Email (required - used for database sync)
     - Discord username
     - Rank
     - Preferred hero/role
     - Specific questions or concerns

---

## Part 5: Configure Environment Variables

Add these variables to your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# Choose ONE authentication method:

# Option 1: Service Account (Recommended)
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Option 2: OAuth 2.0
# GOOGLE_CALENDAR_CLIENT_ID="your-client-id.apps.googleusercontent.com"
# GOOGLE_CALENDAR_CLIENT_SECRET="your-client-secret"
# GOOGLE_CALENDAR_REFRESH_TOKEN="your-refresh-token"

# Required for both methods
GOOGLE_CALENDAR_CALENDAR_ID="your-calendar-id@gmail.com"
GOOGLE_CALENDAR_WEBHOOK_SECRET="generated-random-secret"

# These will be set by the webhook setup script
GOOGLE_CALENDAR_CHANNEL_ID=""
GOOGLE_CALENDAR_RESOURCE_ID=""
```

**Important Notes:**

- For `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, keep all the `\n` characters - they represent newlines
- The webhook secret should be a long random string (use `openssl rand -hex 32`)
- Never commit your `.env` file to version control

---

## Part 6: Set Up Webhook

Webhooks allow Google Calendar to send real-time notifications when events change.

### Prerequisites for Webhooks

- Your application must be accessible via HTTPS
- For local testing, use [ngrok](https://ngrok.com/):
  ```bash
  ngrok http 3000
  ```
  This gives you a public HTTPS URL like `https://abc123.ngrok.io`

### Run the Setup Script

1. **Make sure your application is running and accessible**

2. **Run the webhook setup script:**
   ```bash
   npm run setup:calendar-webhook https://your-domain.com/api/webhooks/google-calendar
   ```

   Or for local testing with ngrok:
   ```bash
   npm run setup:calendar-webhook https://abc123.ngrok.io/api/webhooks/google-calendar
   ```

3. **Follow the prompts:**
   - The script will create a webhook channel with Google Calendar
   - It will display the Channel ID and Resource ID
   - It will offer to update your `.env` file automatically

4. **Save the credentials:**
   - If you declined auto-update, manually add to `.env`:
     ```bash
     GOOGLE_CALENDAR_CHANNEL_ID="your-channel-id"
     GOOGLE_CALENDAR_RESOURCE_ID="your-resource-id"
     ```

5. **Restart your application:**
   ```bash
   # Development
   npm run dev

   # Production (Docker)
   docker-compose restart app
   ```

### Verify Webhook Setup

Test the webhook endpoint:

```bash
curl https://your-domain.com/api/webhooks/google-calendar
```

Expected response:
```json
{
  "status": "active",
  "message": "Google Calendar webhook endpoint is active",
  "timestamp": "2024-11-17T..."
}
```

---

## Part 7: Testing

### Test Calendar Event Creation

1. **Create a test booking:**
   - Open Google Calendar
   - Use your appointment booking link
   - Book a test session as a client

2. **Check your application logs:**
   ```bash
   # Development
   npm run dev

   # Docker
   docker-compose logs -f app
   ```

   Look for messages like:
   ```
   Received Google Calendar webhook: exists (channel: your-channel-id)
   Created booking in database: clxxx... (Event: abc123)
   Booking confirmation email sent to client@example.com
   ```

3. **Verify in database:**
   - Open Prisma Studio: `npm run prisma:studio`
   - Check the `bookings` table
   - Verify the booking appears with correct details

4. **Check email delivery:**
   - Verify the client received a confirmation email
   - Check your Resend dashboard for sent emails

### Test Event Updates

1. **Update the test event in Google Calendar:**
   - Change the time or description
   - Save changes

2. **Check logs for update notification:**
   ```
   Processing event update: abc123
   Updated booking in database: clxxx...
   ```

3. **Verify database was updated:**
   - Refresh Prisma Studio
   - Check that booking details match the calendar event

### Test Event Cancellation

1. **Delete the test event in Google Calendar**

2. **Check logs:**
   ```
   Processing event deletion: abc123
   Successfully marked booking as cancelled: clxxx...
   ```

3. **Verify booking status changed to CANCELLED**

---

## Webhook Renewal

**Important:** Google Calendar webhooks expire after approximately 7 days.

### Manual Renewal

Run the setup script again before expiration:

```bash
npm run setup:calendar-webhook https://your-domain.com/api/webhooks/google-calendar
```

### Automated Renewal (Recommended)

#### Option 1: Cron Job

Set up a cron job to renew every 6 days:

```bash
# Edit crontab
crontab -e

# Add this line (runs every 6 days at 2 AM)
0 2 */6 * * cd /path/to/coaching-website && npm run setup:calendar-webhook https://your-domain.com/api/webhooks/google-calendar
```

#### Option 2: Renewal API Endpoint

Create an API endpoint that renews the webhook:

```typescript
// app/api/admin/renew-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setupCalendarWebhook, stopCalendarWebhook } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    // ... auth check code ...

    const webhookUrl = process.env.NEXTAUTH_URL + '/api/webhooks/google-calendar';

    // Stop old webhook if exists
    const oldChannelId = process.env.GOOGLE_CALENDAR_CHANNEL_ID;
    const oldResourceId = process.env.GOOGLE_CALENDAR_RESOURCE_ID;

    if (oldChannelId && oldResourceId) {
      await stopCalendarWebhook(oldChannelId, oldResourceId);
    }

    // Create new webhook
    const result = await setupCalendarWebhook(webhookUrl);

    // Update environment variables (you'll need to implement this)
    // For production, consider storing in database instead of .env

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

Then call this endpoint from a scheduled task or cron job.

#### Option 3: Scheduled Task Service

Use a service like:
- **Vercel Cron Jobs** (if deployed on Vercel)
- **GitHub Actions** with scheduled workflows
- **AWS EventBridge** (if using AWS)
- **Cloud Scheduler** (Google Cloud)

---

## Troubleshooting

### Issue: Webhook notifications not received

**Possible causes:**

1. **Webhook URL not accessible**
   - Test your webhook endpoint: `curl https://your-domain.com/api/webhooks/google-calendar`
   - For local testing, ensure ngrok is running
   - Verify your domain has a valid SSL certificate

2. **Webhook expired**
   - Check the expiration date (stored when you set up the webhook)
   - Renew the webhook if expired

3. **Incorrect webhook secret**
   - Verify `GOOGLE_CALENDAR_WEBHOOK_SECRET` matches in both:
     - Your `.env` file
     - The secret used when creating the webhook

4. **Firewall or proxy blocking requests**
   - Check server firewall settings
   - Verify Google's IP ranges are allowed

**Solutions:**
```bash
# Check webhook endpoint
curl -v https://your-domain.com/api/webhooks/google-calendar

# Renew webhook
npm run setup:calendar-webhook https://your-domain.com/api/webhooks/google-calendar

# Check application logs
docker-compose logs -f app
```

### Issue: Authentication errors

**Error:** "Missing Google Calendar credentials"

**Solution:**
- Verify environment variables are set correctly in `.env`
- For service accounts, ensure the private key includes `\n` characters
- For OAuth, verify the refresh token is valid

**Test authentication:**
```bash
# Add this to a test script
import { initializeCalendarClient } from './lib/google-calendar';

try {
  const calendar = initializeCalendarClient();
  console.log('Authentication successful!');
} catch (error) {
  console.error('Authentication failed:', error);
}
```

### Issue: Events not syncing to database

**Possible causes:**

1. **Client email not found in attendees**
   - Ensure bookings include the client's email address
   - Check that `ADMIN_EMAIL` is set (used to filter out coach from attendees)

2. **Database connection issues**
   - Verify `DATABASE_URL` is correct
   - Check database is running: `docker-compose ps`

3. **Prisma schema mismatch**
   - Run migrations: `npm run prisma:migrate`
   - Regenerate Prisma client: `npm run prisma:generate`

**Debug steps:**
```bash
# Check database connection
npm run prisma:studio

# View application logs
docker-compose logs -f app

# Test sync manually
# Create a test script that calls syncCalendarToDatabase()
```

### Issue: Confirmation emails not sending

**Possible causes:**

1. **Resend API key not configured**
   - Verify `RESEND_API_KEY` is set in `.env`
   - Test with Resend dashboard

2. **Email template errors**
   - Check application logs for React Email errors

**Test email sending:**
```typescript
import { sendBookingConfirmation } from './lib/email';

await sendBookingConfirmation('test@example.com', {
  id: 'test-id',
  email: 'test@example.com',
  sessionType: 'Test Session',
  scheduledAt: new Date(),
  notes: 'Test booking',
});
```

### Issue: Rate limiting errors

Google Calendar API has rate limits:
- 1,000 requests per 100 seconds per user
- 500,000 requests per day per project

**Solutions:**
- Implement exponential backoff for retries
- Cache calendar data where possible
- Avoid polling - use webhooks instead

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid credentials" | Wrong API credentials | Verify `.env` file has correct credentials |
| "Calendar not found" | Wrong calendar ID | Check `GOOGLE_CALENDAR_CALENDAR_ID` |
| "Insufficient permissions" | Service account not shared | Share calendar with service account email |
| "Invalid token" | Expired refresh token | Generate new refresh token via OAuth flow |
| "Webhook channel not found" | Webhook expired | Run `setup:calendar-webhook` script again |

---

## Advanced Configuration

### Custom Calendar Event Types

You can distinguish different types of coaching sessions:

```typescript
// When creating events programmatically
const event = await createEvent({
  email: 'client@example.com',
  sessionType: '1-on-1 Coaching - Tank Main',
  startTime: new Date('2024-11-20T14:00:00Z'),
  endTime: new Date('2024-11-20T15:00:00Z'),
  notes: 'Focus on positioning and ultimate usage',
  timeZone: 'America/New_York',
});
```

### Multiple Calendars

To use multiple calendars (e.g., one for each service type):

1. Create separate environment variable sets
2. Initialize multiple calendar clients
3. Route bookings based on session type

### Appointment Schedule Templates

Create different appointment schedules for:
- **Quick VOD Reviews** (30 minutes)
- **Full Coaching Sessions** (60 minutes)
- **Package Deals** (multiple sessions)

Each can have different:
- Duration
- Availability windows
- Pricing information
- Custom questions

### Integration with Payment Systems

To require payment before booking:

1. Use Google Calendar's payment integration, OR
2. Create your own booking flow:
   - Client pays via Stripe
   - On successful payment, create calendar event via API
   - Send calendar invite to client

Example:
```typescript
// After successful Stripe payment
const event = await createEvent({
  email: paymentIntent.receipt_email,
  sessionType: 'Paid Coaching Session',
  startTime: selectedTimeSlot,
  endTime: new Date(selectedTimeSlot.getTime() + 60 * 60 * 1000),
});
```

### Automated Reminders

Set up reminder emails 24 hours before sessions:

```typescript
// Create a cron job or scheduled task
import { prisma } from './lib/prisma';
import { sendReminderEmail } from './lib/email';

// Find bookings happening in 24 hours
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
const bookings = await prisma.booking.findMany({
  where: {
    scheduledAt: {
      gte: new Date(tomorrow.getTime() - 60 * 60 * 1000),
      lte: new Date(tomorrow.getTime() + 60 * 60 * 1000),
    },
    status: 'SCHEDULED',
  },
});

for (const booking of bookings) {
  await sendReminderEmail(booking.email, booking);
}
```

---

## Security Best Practices

1. **Keep credentials secret:**
   - Never commit `.env` to git
   - Use environment variables in production
   - Rotate secrets periodically

2. **Validate webhook requests:**
   - Always verify the webhook token
   - Check the `x-goog-channel-token` header
   - Consider additional security measures for production

3. **Limit API access:**
   - Use service accounts with minimal required permissions
   - Implement rate limiting on webhook endpoints
   - Monitor for suspicious activity

4. **Secure calendar sharing:**
   - Only share calendars with necessary service accounts
   - Use "Make changes to events" permission (not "Make changes and manage sharing")
   - Regularly audit calendar sharing settings

---

## Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/guides/overview)
- [Service Account Authentication](https://cloud.google.com/docs/authentication)
- [Webhook Push Notifications](https://developers.google.com/calendar/api/guides/push)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Appointment Schedules Guide](https://support.google.com/calendar/answer/10729749)

---

## Support

If you encounter issues not covered in this guide:

1. Check application logs for detailed error messages
2. Review the [Troubleshooting](#troubleshooting) section
3. Verify all environment variables are correctly set
4. Test each component individually (auth, calendar API, webhooks)

For development assistance:
- Review the code in `lib/google-calendar.ts` and `lib/google-calendar-sync.ts`
- Check the webhook handler in `app/api/webhooks/google-calendar/route.ts`
- Examine database schema in `prisma/schema.prisma`

---

**Last Updated:** November 17, 2024
**Version:** 1.0
