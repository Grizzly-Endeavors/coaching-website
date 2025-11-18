/**
 * Discord Integration Module
 *
 * This module handles Discord notifications via two methods:
 * 1. Bot DMs - For admin notifications and fallback
 * 2. OAuth DMs - For user notifications (preferred method, no server requirement)
 *
 * Features:
 * - Admin receives bot DM when VOD is requested
 * - Users receive OAuth DM when review is ready (if connected via OAuth)
 * - Automatic token refresh for expired OAuth tokens
 */

import { Client, GatewayIntentBits, Events } from 'discord.js';
import { prisma } from './prisma';
import { logger } from './logger';

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
  discordAccessToken?: string | null;
  discordRefreshToken?: string | null;
  discordTokenExpiry?: Date | null;
  replayCode: string;
  rank: string;
  role: string;
  hero: string | null;
  reviewNotes: string | null;
  reviewUrl: string | null;
  reviewedAt: Date | null;
}

interface DiscordOAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
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
 * Refresh Discord OAuth access token using refresh token
 */
async function refreshDiscordToken(refreshToken: string): Promise<DiscordOAuthTokens> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Discord OAuth not configured');
  }

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
  }

  return await response.json();
}

/**
 * Send Discord DM using OAuth access token (REST API)
 * This method doesn't require the bot or a shared server
 */
async function sendDMViaOAuth(
  userId: string,
  message: string,
  accessToken: string
): Promise<DiscordResult> {
  try {
    // Create DM channel with user
    const dmChannelResponse = await fetch('https://discord.com/api/users/@me/channels', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient_id: userId,
      }),
    });

    if (!dmChannelResponse.ok) {
      const error = await dmChannelResponse.json();
      throw new Error(`Failed to create DM channel: ${error.message || error.error}`);
    }

    const dmChannel = await dmChannelResponse.json();

    // Send message to the DM channel
    const messageResponse = await fetch(
      `https://discord.com/api/channels/${dmChannel.id}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      }
    );

    if (!messageResponse.ok) {
      const error = await messageResponse.json();
      throw new Error(`Failed to send message: ${error.message || error.error}`);
    }

    return { success: true };
  } catch (error) {
    logger.error('Error sending OAuth DM', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send Discord DM to user when their review is ready
 * Uses OAuth if available (no server requirement), falls back to bot method
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

    // PRIORITY 1: Try OAuth method if user has connected Discord via OAuth
    if (details.discordId && details.discordAccessToken && details.discordRefreshToken) {
      logger.debug('Attempting OAuth DM', {
        discordUsername: details.discordUsername || details.discordId,
      });

      let accessToken = details.discordAccessToken;

      // Check if token is expired and refresh if needed
      if (details.discordTokenExpiry && new Date() > details.discordTokenExpiry) {
        logger.debug('Access token expired, refreshing...');
        try {
          const newTokens = await refreshDiscordToken(details.discordRefreshToken);
          accessToken = newTokens.access_token;

          // Update tokens in database
          await prisma.replaySubmission.update({
            where: { id: details.id },
            data: {
              discordAccessToken: newTokens.access_token,
              discordRefreshToken: newTokens.refresh_token,
              discordTokenExpiry: new Date(Date.now() + newTokens.expires_in * 1000),
            },
          });

          logger.debug('Token refreshed successfully');
        } catch (refreshError) {
          logger.error('Failed to refresh token', refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
          // Token refresh failed, fall through to bot method
        }
      }

      // Try sending via OAuth
      const oauthResult = await sendDMViaOAuth(details.discordId, message, accessToken);

      if (oauthResult.success) {
        logger.info('OAuth DM sent successfully', {
          discordUsername: details.discordUsername || details.discordId,
        });
        return { success: true };
      } else {
        logger.warn('OAuth DM failed, falling back to bot method', {
          error: oauthResult.error,
        });
      }
    }

    // PRIORITY 2: Fall back to bot method if OAuth not available or failed
    if (details.discordTag) {
      logger.debug('Attempting bot DM (fallback method)');

      // Parse Discord tag to get user ID
      const discordUserId = details.discordTag.replace(/[<@!>]/g, ''); // Remove mention markers if present

      const client = await getDiscordClient();

      let user;
      try {
        user = await client.users.fetch(discordUserId);
      } catch (error) {
        logger.error('Failed to fetch Discord user', {
          discordUserId,
          error: error instanceof Error ? error.message : String(error),
        });
        return {
          success: false,
          error: `Could not find Discord user. Please ensure the user has connected their Discord account or is in a server with the bot.`,
        };
      }

      await user.send(message);

      logger.info('Bot DM sent', {
        discordTag: details.discordTag,
        submissionId: details.id,
      });
      return { success: true };
    }

    // No Discord connection method available
    logger.debug('No Discord connection available for user');
    return {
      success: false,
      error: 'User has not connected Discord account',
    };
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
