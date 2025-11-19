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
