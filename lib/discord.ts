/**
 * Discord Integration Module
 *
 * This module handles Discord bot integration for sending notifications:
 * 1. DMs to admin when VOD is requested
 * 2. DMs to users about review status
 */

import { Client, GatewayIntentBits, Events } from 'discord.js';

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
          console.log(`Discord bot logged in as ${discordClient!.user?.tag}`);
          isClientReady = true;
          resolve();
        });

        discordClient!.once(Events.Error, (error) => {
          console.error('Discord client error:', error);
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
 * Get coaching type display name
 */
function getCoachingTypeName(type: string): string {
  switch (type) {
    case 'review-async':
      return 'Review on My Time';
    case 'vod-review':
      return 'VOD Review';
    case 'live-coaching':
      return 'Live Coaching';
    default:
      return type;
  }
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
      console.warn('ADMIN_DISCORD_USER_ID not configured, skipping Discord notification');
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

    console.log(`Discord notification sent to admin for submission ${details.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to user when their review is ready
 */
export async function sendReviewReadyNotification(
  details: ReviewReadyDetails
): Promise<DiscordResult> {
  try {
    // User must have provided Discord tag to receive notification
    if (!details.discordTag) {
      console.log('No Discord tag provided, skipping notification');
      return { success: false, error: 'No Discord tag provided' };
    }

    // Parse Discord tag to get user ID
    // Discord tags can be in formats: username, username#discriminator, or user ID
    // For DMs, we need the user ID
    // This is a simplified implementation - you may need to adjust based on your Discord tag format
    const discordUserId = details.discordTag.replace(/[<@!>]/g, ''); // Remove mention markers if present

    const client = await getDiscordClient();

    let user;
    try {
      user = await client.users.fetch(discordUserId);
    } catch (error) {
      console.error(`Failed to fetch Discord user ${discordUserId}:`, error);
      return {
        success: false,
        error: `Could not find Discord user. Please ensure the Discord tag/ID is correct.`,
      };
    }

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

    await user.send(message);

    console.log(`Discord notification sent to ${details.discordTag} for submission ${details.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending Discord notification to user:', error);
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
    console.log('Discord client shut down');
  }
}
