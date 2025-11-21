/**
 * Reminder Service
 *
 * Scheduled service that checks for upcoming bookings and sends Discord reminders:
 * - 24 hours before the session (to client only)
 * - 30 minutes before the session (to both client and admin)
 */

import { prisma } from './prisma';
import { logger } from './logger';
import {
  send24HourReminder,
  send30MinuteReminder,
  send30MinuteAdminReminder,
} from './discord';

let reminderTimeout: NodeJS.Timeout | null = null;

/**
 * Check for bookings that need reminders and send them
 * This function is called by the cron job
 */
async function checkAndSendReminders(): Promise<void> {
  try {
    logger.info('Running reminder check...');

    const now = new Date();

    // Calculate time windows for reminders
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyFourHoursWindow = {
      start: new Date(twentyFourHoursFromNow.getTime() - 5 * 60 * 1000), // 5 min before
      end: new Date(twentyFourHoursFromNow.getTime() + 5 * 60 * 1000), // 5 min after
    };

    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyMinutesWindow = {
      start: new Date(thirtyMinutesFromNow.getTime() - 5 * 60 * 1000), // 5 min before
      end: new Date(thirtyMinutesFromNow.getTime() + 5 * 60 * 1000), // 5 min after
    };

    // Find confirmed bookings that need 24-hour reminders
    const bookingsFor24HourReminder = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        scheduledAt: {
          gte: twentyFourHoursWindow.start,
          lte: twentyFourHoursWindow.end,
        },
        reminderSent24h: false,
      },
      include: {
        submission: true,
      },
    });

    logger.info(`Found ${bookingsFor24HourReminder.length} bookings for 24-hour reminders`);

    // Send 24-hour reminders
    for (const booking of bookingsFor24HourReminder) {
      try {
        const result = await send24HourReminder({
          id: booking.id,
          email: booking.email,
          discordId: booking.submission?.discordId,
          discordUsername: booking.submission?.discordUsername,
          sessionType: booking.sessionType,
          scheduledAt: booking.scheduledAt,
          rank: booking.submission?.rank,
          role: booking.submission?.role,
          hero: booking.submission?.hero,
        });

        if (result.success) {
          // Mark reminder as sent
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              reminderSent24h: true,
              reminder24hSentAt: new Date(),
            },
          });
          logger.info(`24-hour reminder sent for booking ${booking.id}`);
        } else {
          logger.warn(`Failed to send 24-hour reminder for booking ${booking.id}: ${result.error}`);
        }
      } catch (error) {
        logger.error(`Error sending 24-hour reminder for booking ${booking.id}`, error instanceof Error ? error : new Error(String(error)));
      }
    }

    // Find confirmed bookings that need 30-minute reminders
    const bookingsFor30MinReminder = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        scheduledAt: {
          gte: thirtyMinutesWindow.start,
          lte: thirtyMinutesWindow.end,
        },
        reminderSent30m: false,
      },
      include: {
        submission: true,
      },
    });

    logger.info(`Found ${bookingsFor30MinReminder.length} bookings for 30-minute reminders`);

    // Send 30-minute reminders
    for (const booking of bookingsFor30MinReminder) {
      try {
        const reminderDetails = {
          id: booking.id,
          email: booking.email,
          discordId: booking.submission?.discordId,
          discordUsername: booking.submission?.discordUsername,
          sessionType: booking.sessionType,
          scheduledAt: booking.scheduledAt,
          rank: booking.submission?.rank,
          role: booking.submission?.role,
          hero: booking.submission?.hero,
        };

        // Send reminder to client
        const clientResult = await send30MinuteReminder(reminderDetails);

        // Send reminder to admin
        const adminResult = await send30MinuteAdminReminder(reminderDetails);

        // Mark as sent if at least one succeeded
        if (clientResult.success || adminResult.success) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              reminderSent30m: true,
              reminder30mSentAt: new Date(),
            },
          });
          logger.info(`30-minute reminder sent for booking ${booking.id} (client: ${clientResult.success}, admin: ${adminResult.success})`);
        } else {
          logger.warn(`Failed to send 30-minute reminders for booking ${booking.id}`);
        }
      } catch (error) {
        logger.error(`Error sending 30-minute reminder for booking ${booking.id}`, error instanceof Error ? error : new Error(String(error)));
      }
    }

    logger.info('Reminder check completed');
  } catch (error) {
    logger.error('Error in reminder check', error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Schedule the next execution on the next 5-minute mark
 */
function scheduleNextRun() {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const millis = now.getMilliseconds();

  // Calculate delay to next 5-minute mark
  const minutesToNext = 5 - (minutes % 5);
  const delay = minutesToNext * 60 * 1000 - seconds * 1000 - millis;

  // Ensure strictly positive delay (at least 1 second) to avoid tight loops if calc is close to 0
  const safeDelay = delay <= 0 ? 5 * 60 * 1000 : delay;

  reminderTimeout = setTimeout(() => {
    checkAndSendReminders()
      .catch((error) => {
        logger.error('Error in scheduled reminder check', error instanceof Error ? error : new Error(String(error)));
      })
      .finally(() => {
        // Schedule the next run after this one starts/completes
        scheduleNextRun();
      });
  }, safeDelay);
}

/**
 * Start the reminder service
 * Runs every 5 minutes to check for bookings that need reminders
 */
export function startReminderService(): void {
  if (reminderTimeout) {
    logger.warn('Reminder service is already running');
    return;
  }

  logger.info('Reminder service started (running every 5 minutes)');

  // Run immediately on start to catch any missed reminders
  checkAndSendReminders().catch((error) => {
    logger.error('Error in initial reminder check', error instanceof Error ? error : new Error(String(error)));
  });

  // Schedule the next run
  scheduleNextRun();
}

/**
 * Stop the reminder service
 */
export function stopReminderService(): void {
  if (reminderTimeout) {
    clearTimeout(reminderTimeout);
    reminderTimeout = null;
    logger.info('Reminder service stopped');
  }
}

/**
 * Check if the reminder service is running
 */
export function isReminderServiceRunning(): boolean {
  return reminderTimeout !== null;
}
