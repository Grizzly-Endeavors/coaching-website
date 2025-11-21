import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * GET /api/auth/discord/callback
 *
 * Handles Discord OAuth callback
 * Exchanges authorization code for access token and stores user's Discord info in a secure cookie
 *
 * Query parameters from Discord:
 * - code: Authorization code to exchange for tokens
 * - state: CSRF protection state (must match what we sent)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle user denying authorization
    if (error) {
      logger.info(`Discord OAuth denied: ${error}`);
      const returnTo = request.cookies.get('discord_oauth_return')?.value || '/submit-replay';
      const response = NextResponse.redirect(new URL(`${returnTo}?discord_error=denied`, request.url));

      // Clear OAuth cookies
      response.cookies.delete('discord_oauth_state');
      response.cookies.delete('discord_oauth_return');

      return response;
    }

    // Verify state to prevent CSRF attacks
    const savedState = request.cookies.get('discord_oauth_state')?.value;
    if (!state || !savedState || state !== savedState) {
      logger.error('Discord OAuth state mismatch - possible CSRF attack');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid state',
          message: 'Security validation failed. Please try connecting Discord again.',
        },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'No authorization code',
          message: 'No authorization code received from Discord.',
        },
        { status: 400 }
      );
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      logger.error('Discord OAuth not configured properly');
      return NextResponse.json(
        {
          success: false,
          error: 'Configuration error',
          message: 'Discord integration is not properly configured.',
        },
        { status: 500 }
      );
    }

    // Exchange authorization code for access token
    logger.info('Exchanging Discord authorization code for access token');
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      logger.error('Discord token exchange failed:', { error: errorData });
      return NextResponse.json(
        {
          success: false,
          error: 'Token exchange failed',
          message: 'Failed to connect to Discord. Please try again.',
        },
        { status: 500 }
      );
    }

    const tokens = await tokenResponse.json();
    logger.info('Successfully received Discord OAuth tokens');

    // Fetch user information from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      logger.error('Failed to fetch Discord user info');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch user info',
          message: 'Failed to retrieve your Discord information.',
        },
        { status: 500 }
      );
    }

    const discordUser = await userResponse.json();
    logger.info(`Discord user authenticated: ${discordUser.username} (${discordUser.id})`);

    // Add user to Discord server (guild)
    const guildId = process.env.DISCORD_GUILD_ID;
    if (guildId) {
      try {
        const addMemberResponse = await fetch(
          `https://discord.com/api/guilds/${guildId}/members/${discordUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: tokens.access_token,
            }),
          }
        );

        if (addMemberResponse.ok || addMemberResponse.status === 204) {
          logger.info(`Added user ${discordUser.username} to Discord server`);
        } else if (addMemberResponse.status === 201) {
          logger.info(`User ${discordUser.username} was already in the server`);
        } else {
          const errorData = await addMemberResponse.json().catch(() => null);
          logger.warn(`Failed to add user to Discord server: ${addMemberResponse.status}`, {
            error: errorData,
          });
        }
      } catch (error) {
        logger.error('Error adding user to Discord server:', error instanceof Error ? error : new Error(String(error)));
        // Don't fail the OAuth flow if adding to server fails
      }
    } else {
      logger.warn('DISCORD_GUILD_ID not configured, skipping server join');
    }

    // Calculate token expiry time
    const tokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);

    // Build Discord username (handle both old discriminator format and new username format)
    const discordUsername = discordUser.discriminator && discordUser.discriminator !== '0'
      ? `${discordUser.username}#${discordUser.discriminator}`
      : discordUser.username;

    // Store Discord data in a secure HTTP-only cookie
    // This will be retrieved when user submits a replay
    const discordData = {
      discordId: discordUser.id,
      discordUsername: discordUsername,
      discordAccessToken: tokens.access_token,
      discordRefreshToken: tokens.refresh_token,
      discordTokenExpiry: tokenExpiry.toISOString(),
    };

    const returnTo = request.cookies.get('discord_oauth_return')?.value || '/submit-replay';

    // Use DOMAIN_NAME if available, otherwise fall back to request.url (which might be localhost)
    const baseUrl = process.env.DOMAIN_NAME || request.url;
    const redirectUrl = new URL(`${returnTo}?discord_connected=true`, baseUrl);

    const response = NextResponse.redirect(redirectUrl);

    // Store Discord data in secure cookie (valid for 7 days)
    response.cookies.set('discord_user_data', JSON.stringify(discordData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Clear OAuth state cookies
    response.cookies.delete('discord_oauth_state');
    response.cookies.delete('discord_oauth_return');

    logger.info(`Discord OAuth completed successfully for user ${discordUsername}`);
    return response;
  } catch (error) {
    logger.error('Error in Discord OAuth callback:', error instanceof Error ? error : new Error(String(error)));

    const returnTo = request.cookies.get('discord_oauth_return')?.value || '/submit-replay';
    const baseUrl = process.env.DOMAIN_NAME || request.url;
    const response = NextResponse.redirect(
      new URL(`${returnTo}?discord_error=server_error`, baseUrl)
    );

    // Clear OAuth cookies
    response.cookies.delete('discord_oauth_state');
    response.cookies.delete('discord_oauth_return');

    return response;
  }
}
