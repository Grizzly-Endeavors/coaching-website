import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

/**
 * GET /api/auth/discord/authorize
 *
 * Initiates Discord OAuth flow by redirecting user to Discord authorization page
 *
 * Query parameters:
 * - returnTo: Optional URL to redirect to after OAuth completes (default: /submit-replay)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get('returnTo') || '/submit-replay';

    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      logger.error('Discord OAuth not configured: Missing DISCORD_CLIENT_ID or DISCORD_REDIRECT_URI');
      return NextResponse.json(
        {
          success: false,
          error: 'Discord OAuth not configured',
          message: 'Discord integration is not properly set up. Please contact support.'
        },
        { status: 500 }
      );
    }

    // Generate secure random state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Build Discord authorization URL
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', clientId);
    discordAuthUrl.searchParams.set('redirect_uri', redirectUri);
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify'); // Only need to identify the user
    discordAuthUrl.searchParams.set('state', state);

    // Store state and returnTo in secure HTTP-only cookie for verification in callback
    const response = NextResponse.redirect(discordAuthUrl.toString());

    response.cookies.set('discord_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    response.cookies.set('discord_oauth_return', returnTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    logger.info('Initiating Discord OAuth flow');
    return response;
  } catch (error) {
    logger.error('Error initiating Discord OAuth:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initiate Discord authorization',
        message: 'An error occurred while connecting to Discord. Please try again.',
      },
      { status: 500 }
    );
  }
}
