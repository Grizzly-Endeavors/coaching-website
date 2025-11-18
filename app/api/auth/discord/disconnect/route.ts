import { NextRequest, NextResponse } from 'next/server';

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

    console.log('Discord account disconnected');
    return response;
  } catch (error) {
    console.error('Error disconnecting Discord:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to disconnect Discord account',
      },
      { status: 500 }
    );
  }
}
