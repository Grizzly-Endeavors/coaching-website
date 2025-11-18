import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/discord/status
 *
 * Returns the current Discord connection status for the user
 */
export async function GET(request: NextRequest) {
  try {
    const discordDataCookie = request.cookies.get('discord_user_data')?.value;

    if (!discordDataCookie) {
      return NextResponse.json({
        connected: false,
      });
    }

    const discordData = JSON.parse(discordDataCookie);

    // Check if token is expired
    const tokenExpiry = new Date(discordData.discordTokenExpiry);
    const isExpired = new Date() > tokenExpiry;

    return NextResponse.json({
      connected: true,
      username: discordData.discordUsername,
      expired: isExpired,
    });
  } catch (error) {
    console.error('Error checking Discord status:', error);
    return NextResponse.json({
      connected: false,
      error: 'Failed to check Discord connection status',
    });
  }
}
