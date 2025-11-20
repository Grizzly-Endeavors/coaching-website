/**
 * Discord Integration Module
 *
 * This module handles Discord notifications via bot DMs.
 * OAuth is used to get the user's Discord ID, then the bot sends DMs to that ID.
 *
 * Features:
 * - Admin receives bot DM when VOD is requested
 * - Users receive bot DM when review is ready (if they connected Discord via OAuth)
 * - No shared server requirement - bot can DM users directly by ID
 */

import { Client, GatewayIntentBits, Events } from 'discord.js';
import { prisma } from './prisma';
import { logger } from './logger';
import { getCoachingTypeName } from './coaching';

interface SubmissionDetails {
  id: string;
  email: string;
  discordTag: string | null;
  coachingType: string;
  rank: string;
  role: string;
  hero: string | null;
  replays: Array<{
    code: string;
    mapName: string;
    notes: string | null;
  }>;
  submittedAt: Date;
}

interface ReviewReadyDetails {
  id: string;
  email: string;
  discordTag: string | null;
  discordId?: string | null;
  discordUsername?: string | null;
  replayCode: string;
  rank: string;
  role: string;
  hero: string | null;
  reviewNotes: string | null;
  reviewUrl: string | null;
  reviewedAt: Date | null;
}

interface BookingConfirmationDetails {
  id: string;
  email: string;
  discordId?: string | null;
  discordUsername?: string | null;
  coachingType: string;
  rank: string;
  role: string;
  hero: string | null;
  scheduledAt?: Date | null;
  replays: Array<{
    code: string;
    mapName: string;
  }>;
}

interface BookingReminderDetails {
  id: string;
  email: string;
  discordId?: string | null;
  discordUsername?: string | null;
  sessionType: string;
  scheduledAt: Date;
  rank?: string;
  role?: string;
  hero?: string | null;
}

interface DiscordResult {
  success: boolean;
  error?: string;
}

// Singleton client instance
let discordClient: Client | null = null;
let isClientReady = false;
let clientInitPromise: Promise<void> | null = null;

/**
 * Initialize Discord client if not already initialized
 * Uses singleton pattern to ensure only one client exists
 */
async function getDiscordClient(): Promise<Client> {
  // Return existing client if already initialized and ready
  if (discordClient && isClientReady) {
    return discordClient;
  }

  // Wait for ongoing initialization if in progress
  if (clientInitPromise) {
    await clientInitPromise;
    return discordClient!;
  }

  // Initialize new client
  clientInitPromise = (async () => {
    try {
      const token = process.env.DISCORD_BOT_TOKEN;

      if (!token) {
        throw new Error('DISCORD_BOT_TOKEN environment variable is not set');
      }

      discordClient = new Client({
        intents: [
          GatewayIntentBits.DirectMessages,
        ],
      });

      // Wait for client to be ready
      await new Promise<void>((resolve, reject) => {
        discordClient!.once(Events.ClientReady, () => {
          logger.info('Discord bot logged in', {
            botTag: discordClient!.user?.tag,
          });
          isClientReady = true;
          resolve();
        });

        discordClient!.once(Events.Error, (error) => {
          logger.error('Discord client error', error);
          reject(error);
        });

        discordClient!.login(token).catch(reject);
      });
    } catch (error) {
      discordClient = null;
      isClientReady = false;
      clientInitPromise = null;
      throw error;
    }
  })();

  await clientInitPromise;
  return discordClient!;
}

/**
 * Send Discord DM notification to admin when a VOD is requested
 */
export async function sendVodRequestNotification(
  details: SubmissionDetails
): Promise<DiscordResult> {
  try {
    const adminDiscordId = process.env.ADMIN_DISCORD_USER_ID;

    if (!adminDiscordId) {
      logger.warn('ADMIN_DISCORD_USER_ID not configured, skipping Discord notification');
      return { success: false, error: 'ADMIN_DISCORD_USER_ID not configured' };
    }

    const client = await getDiscordClient();
    const user = await client.users.fetch(adminDiscordId);

    // Build replay list
    const replayList = details.replays
      .map((replay, index) =>
        `**Replay ${index + 1}:**\n` +
        `Code: \`${replay.code}\`\n` +
        `Map: ${replay.mapName}` +
        (replay.notes ? `\nNotes: ${replay.notes}` : '')
      )
      .join('\n\n');

    const message = `🎮 **New VOD Review Request**

**Submission ID:** ${details.id}
**Coaching Type:** ${getCoachingTypeName(details.coachingType)}
**Email:** ${details.email}
${details.discordTag ? `**Discord:** ${details.discordTag}` : ''}
**Rank:** ${details.rank}
**Role:** ${details.role}
${details.hero ? `**Hero:** ${details.hero}` : ''}

**Replays (${details.replays.length}):**
${replayList}

**Submitted:** ${details.submittedAt.toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
})}`;

    await user.send(message);

    logger.info('Discord notification sent to admin', {
      submissionId: details.id,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending Discord notification', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


/**
 * Send Discord DM to user when their review is ready
 * Uses bot to send DM to user by their Discord ID (obtained from OAuth)
 * User must be in the Discord server for this to work (automatically added during OAuth)
 */
export async function sendReviewReadyNotification(
  details: ReviewReadyDetails
): Promise<DiscordResult> {
  try {
    // Build message content
    const message = `🎉 **Your Review is Ready!**

Your ${details.rank} ${details.role}${details.hero ? ` ${details.hero}` : ''} replay review is now complete!

${details.reviewUrl ? `**📹 Watch Your Review:** ${details.reviewUrl}\n` : ''}
${details.reviewNotes ? `**📝 Coach's Notes:**\n${details.reviewNotes}\n` : ''}
**Reviewed:** ${details.reviewedAt?.toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
}) || 'Just now'}

Thank you for submitting your replay! If you have any questions, feel free to reach out.`;

    // Check if user has connected Discord via OAuth
    if (!details.discordId) {
      logger.debug('No Discord connection available for user');
      return {
        success: false,
        error: 'User has not connected Discord account',
      };
    }

    logger.debug('Sending bot DM to user', {
      discordUsername: details.discordUsername || details.discordId,
    });

    const client = await getDiscordClient();

    let user;
    try {
      user = await client.users.fetch(details.discordId);
    } catch (error) {
      logger.error('Failed to fetch Discord user', {
        discordId: details.discordId,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: `Could not find Discord user. User may have left the Discord server.`,
      };
    }

    await user.send(message);

    logger.info('Bot DM sent successfully', {
      discordUsername: details.discordUsername || details.discordId,
      submissionId: details.id,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending Discord notification to user', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to user when their booking is confirmed (after payment)
 * Uses bot to send DM to user by their Discord ID (obtained from OAuth)
 */
export async function sendBookingConfirmationNotification(
  details: BookingConfirmationDetails
): Promise<DiscordResult> {
  try {
    // Check if user has connected Discord via OAuth
    if (!details.discordId) {
      logger.debug('No Discord connection available for user');
      return {
        success: false,
        error: 'User has not connected Discord account',
      };
    }

    // Build message content based on coaching type
    let message: string;

    if (details.scheduledAt) {
      // For scheduled sessions (VOD review / Live coaching)
      const formattedDate = details.scheduledAt.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      });

      message = `🎮 **${getCoachingTypeName(details.coachingType)} Confirmed!**

Your coaching session has been booked and confirmed!

**📅 Scheduled Time:** ${formattedDate}
**🎯 Rank:** ${details.rank}
**🛡️ Role:** ${details.role}${details.hero ? `\n**🦸 Hero:** ${details.hero}` : ''}

**Replays Submitted:**
${details.replays.map((r, i) => `${i + 1}. \`${r.code}\` - ${r.mapName}`).join('\n')}

**What's Next:**
${details.coachingType === 'vod-review'
  ? `• I'll review your replays before our session\n• I'll reach out on Discord closer to your session time\n• Make sure you're available on Discord at the scheduled time!`
  : `• I'll review your replays to understand your playstyle\n• I'll reach out on Discord closer to your session time\n• Make sure you're ready to stream your gameplay on Discord!`}

See you soon!`;
    } else {
      // For async reviews
      message = `🎮 **Replay Review Confirmed!**

Your replay submission has been confirmed!

**🎯 Rank:** ${details.rank}
**🛡️ Role:** ${details.role}${details.hero ? `\n**🦸 Hero:** ${details.hero}` : ''}

**Replays Submitted:**
${details.replays.map((r, i) => `${i + 1}. \`${r.code}\` - ${r.mapName}`).join('\n')}

**What's Next:**
• I'll review your replays within 2-3 business days
• You'll receive a Discord DM when your review is ready
• The review will include detailed feedback and analysis

Thank you for your submission!`;
    }

    logger.debug('Sending booking confirmation DM', {
      discordUsername: details.discordUsername || details.discordId,
    });

    const client = await getDiscordClient();

    let user;
    try {
      user = await client.users.fetch(details.discordId);
    } catch (error) {
      logger.error('Failed to fetch Discord user for booking confirmation', {
        discordId: details.discordId,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: `Could not find Discord user. User may have left the Discord server.`,
      };
    }

    await user.send(message);

    logger.info('Booking confirmation DM sent successfully', {
      discordUsername: details.discordUsername || details.discordId,
      bookingId: details.id,
      coachingType: details.coachingType,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending booking confirmation to user', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to user as a 24-hour reminder before their session
 */
export async function send24HourReminder(
  details: BookingReminderDetails
): Promise<DiscordResult> {
  try {
    // Check if user has connected Discord via OAuth
    if (!details.discordId) {
      logger.debug('No Discord connection available for user');
      return {
        success: false,
        error: 'User has not connected Discord account',
      };
    }

    const formattedDate = details.scheduledAt.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const message = `⏰ **Session Reminder - 24 Hours**

Your ${getCoachingTypeName(details.sessionType)} session is coming up tomorrow!

**📅 Scheduled Time:** ${formattedDate}
${details.rank && details.role ? `**🎯 Details:** ${details.rank} ${details.role}${details.hero ? ` ${details.hero}` : ''}` : ''}

**Reminders:**
${details.sessionType === 'live-coaching'
  ? '• Make sure you can stream your gameplay on Discord\n• Test your mic and streaming setup ahead of time\n• Be ready to join voice chat 5 minutes early'
  : '• I\'ll have reviewed your replays by then\n• Make sure you\'re available on Discord\n• Be ready to join voice chat 5 minutes early'}

See you tomorrow!`;

    logger.debug('Sending 24-hour reminder DM', {
      discordUsername: details.discordUsername || details.discordId,
      bookingId: details.id,
    });

    const client = await getDiscordClient();

    let user;
    try {
      user = await client.users.fetch(details.discordId);
    } catch (error) {
      logger.error('Failed to fetch Discord user for 24h reminder', {
        discordId: details.discordId,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: `Could not find Discord user. User may have left the Discord server.`,
      };
    }

    await user.send(message);

    logger.info('24-hour reminder DM sent successfully', {
      discordUsername: details.discordUsername || details.discordId,
      bookingId: details.id,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending 24-hour reminder to user', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to user as a 30-minute reminder before their session
 */
export async function send30MinuteReminder(
  details: BookingReminderDetails
): Promise<DiscordResult> {
  try {
    // Check if user has connected Discord via OAuth
    if (!details.discordId) {
      logger.debug('No Discord connection available for user');
      return {
        success: false,
        error: 'User has not connected Discord account',
      };
    }

    const formattedDate = details.scheduledAt.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const message = `🚨 **Session Starting Soon - 30 Minutes**

Your ${getCoachingTypeName(details.sessionType)} session starts in 30 minutes!

**📅 Time:** ${formattedDate}
${details.rank && details.role ? `**🎯 Details:** ${details.rank} ${details.role}${details.hero ? ` ${details.hero}` : ''}` : ''}

**Get Ready:**
${details.sessionType === 'live-coaching'
  ? '• Start your game and get warmed up\n• Make sure you can stream on Discord\n• I\'ll message you here shortly to start!'
  : '• Make sure you\'re available on Discord\n• I\'ll reach out here to start the session\n• Have any questions ready!'}

See you in 30 minutes!`;

    logger.debug('Sending 30-minute reminder DM', {
      discordUsername: details.discordUsername || details.discordId,
      bookingId: details.id,
    });

    const client = await getDiscordClient();

    let user;
    try {
      user = await client.users.fetch(details.discordId);
    } catch (error) {
      logger.error('Failed to fetch Discord user for 30m reminder', {
        discordId: details.discordId,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        success: false,
        error: `Could not find Discord user. User may have left the Discord server.`,
      };
    }

    await user.send(message);

    logger.info('30-minute reminder DM sent successfully', {
      discordUsername: details.discordUsername || details.discordId,
      bookingId: details.id,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending 30-minute reminder to user', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to admin as a 30-minute reminder before a session
 */
export async function send30MinuteAdminReminder(
  details: BookingReminderDetails
): Promise<DiscordResult> {
  try {
    const adminDiscordId = process.env.ADMIN_DISCORD_USER_ID;

    if (!adminDiscordId) {
      logger.warn('ADMIN_DISCORD_USER_ID not configured, skipping admin reminder');
      return { success: false, error: 'ADMIN_DISCORD_USER_ID not configured' };
    }

    const formattedDate = details.scheduledAt.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const message = `⏰ **Coaching Session Starting in 30 Minutes**

**Session Type:** ${getCoachingTypeName(details.sessionType)}
**📅 Time:** ${formattedDate}
**📧 Client Email:** ${details.email}
${details.discordUsername ? `**💬 Discord:** ${details.discordUsername}` : ''}
${details.rank && details.role ? `**🎯 Details:** ${details.rank} ${details.role}${details.hero ? ` ${details.hero}` : ''}` : ''}

**Booking ID:** ${details.id}

Time to get ready!`;

    const client = await getDiscordClient();
    const user = await client.users.fetch(adminDiscordId);

    await user.send(message);

    logger.info('30-minute admin reminder sent', {
      bookingId: details.id,
    });
    return { success: true };
  } catch (error) {
    logger.error('Error sending 30-minute admin reminder', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Gracefully shutdown Discord client
 * Call this when the application is shutting down
 */
export async function shutdownDiscordClient(): Promise<void> {
  if (discordClient) {
    await discordClient.destroy();
    discordClient = null;
    isClientReady = false;
    clientInitPromise = null;
    logger.info('Discord client shut down');
  }
}
