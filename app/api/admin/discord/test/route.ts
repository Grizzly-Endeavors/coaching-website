import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { sendVodRequestNotification } from '@/lib/discord';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/discord/test
 *
 * Test the Discord bot connection by sending a test notification
 * Requires authentication
 *
 * This endpoint helps diagnose Discord integration issues
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    logger.info('Testing Discord bot notification');

    // Check environment variables
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    const adminDiscordUserId = process.env.ADMIN_DISCORD_USER_ID;

    if (!discordBotToken) {
      return NextResponse.json({
        success: false,
        error: 'DISCORD_BOT_TOKEN not configured',
        message: 'Please set DISCORD_BOT_TOKEN in your environment variables',
      }, { status: 500 });
    }

    if (!adminDiscordUserId) {
      return NextResponse.json({
        success: false,
        error: 'ADMIN_DISCORD_USER_ID not configured',
        message: 'Please set ADMIN_DISCORD_USER_ID in your environment variables',
      }, { status: 500 });
    }

    // Send test notification
    const testSubmission = {
      id: 'test-' + Date.now(),
      email: 'test@example.com',
      discordTag: null,
      coachingType: 'review-async',
      rank: 'Diamond',
      role: 'Support',
      hero: 'Ana',
      replays: [
        {
          code: 'TEST123',
          mapName: 'King\'s Row',
          notes: 'This is a test submission to verify Discord bot functionality',
        },
      ],
      submittedAt: new Date(),
    };

    const result = await sendVodRequestNotification(testSubmission);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully! Check your Discord DMs.',
        details: {
          botTokenConfigured: true,
          adminUserIdConfigured: true,
          adminUserId: adminDiscordUserId,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to send test notification',
        message: result.error || 'Unknown error occurred',
        details: {
          botTokenConfigured: true,
          adminUserIdConfigured: true,
          adminUserId: adminDiscordUserId,
        },
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Error testing Discord notification', error instanceof Error ? error : new Error(String(error)));

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
