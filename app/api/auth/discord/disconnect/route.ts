import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * POST /api/auth/discord/disconnect
 *
 * Disconnects user's Discord account by clearing the Discord data cookie
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Discord account disconnected successfully',
    });

    // Clear Discord data cookie
    response.cookies.delete('discord_user_data');

    logger.info('Discord account disconnected');
    return response;
  } catch (error) {
    logger.error('Error disconnecting Discord:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to disconnect Discord account',
      },
      { status: 500 }
    );
  }
}
