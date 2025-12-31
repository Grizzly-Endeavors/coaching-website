/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js when the server starts.
 * We use it to start background services like the reminder cron job.
 *
 * Note: This only runs on the server, not on the client.
 */

export async function register() {
  // Only run on the server (not during build or in Edge runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startReminderService } = await import('./lib/reminder-service');
    const { logger } = await import('./lib/logger');

    try {
      // Start the reminder service
      startReminderService();
      logger.info('Instrumentation: Reminder service initialized');
    } catch (error) {
      logger.error('Instrumentation: Failed to start reminder service', error instanceof Error ? error : new Error(String(error)));
    }
  }
}
