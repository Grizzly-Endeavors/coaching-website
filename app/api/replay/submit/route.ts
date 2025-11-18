import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { replaySubmissionSchema } from '@/lib/validations';
import { sendVodRequestNotification } from '@/lib/discord';
import { ZodError } from 'zod';

/**
 * POST /api/replay/submit
 * Submit replay codes for review
 *
 * Request body:
 * {
 *   email: string,
 *   discordTag?: string,
 *   coachingType: "review-async" | "vod-review" | "live-coaching",
 *   rank: string,
 *   role: "Tank" | "DPS" | "Support",
 *   hero?: string,
 *   replays: Array<{
 *     code: string,
 *     mapName: string,
 *     notes?: string
 *   }>
 * }
 *
 * Response: 201 Created
 * {
 *   success: true,
 *   submissionId: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body with Zod
    const validatedData = replaySubmissionSchema.parse(body);

    // TODO: Add rate limiting
    // Consider using a rate limiting middleware or service like Upstash Redis
    // to prevent spam submissions from the same IP or email

    // Check for Discord OAuth data in cookies
    let discordData = null;
    const discordCookie = request.cookies.get('discord_user_data')?.value;
    if (discordCookie) {
      try {
        discordData = JSON.parse(discordCookie);
        console.log(`Discord OAuth data found for user: ${discordData.discordUsername}`);
      } catch (error) {
        console.error('Failed to parse Discord cookie data:', error);
      }
    }

    // Create replay submission in database with nested replay codes
    const submission = await prisma.replaySubmission.create({
      data: {
        email: validatedData.email,
        discordTag: validatedData.discordTag || null,
        // Save Discord OAuth data if available
        discordId: discordData?.discordId || null,
        discordUsername: discordData?.discordUsername || null,
        discordAccessToken: discordData?.discordAccessToken || null,
        discordRefreshToken: discordData?.discordRefreshToken || null,
        discordTokenExpiry: discordData?.discordTokenExpiry ? new Date(discordData.discordTokenExpiry) : null,
        coachingType: validatedData.coachingType,
        rank: validatedData.rank,
        role: validatedData.role,
        hero: validatedData.hero || null,
        status: 'PENDING',
        replays: {
          create: validatedData.replays.map((replay) => ({
            code: replay.code.toUpperCase(), // Normalize to uppercase
            mapName: replay.mapName,
            notes: replay.notes || null,
          })),
        },
      },
      include: {
        replays: true,
      },
    });

    console.log(`New replay submission created: ${submission.id} with ${submission.replays.length} replays`);

    // Send Discord notification to admin (non-blocking)
    sendVodRequestNotification({
      id: submission.id,
      email: submission.email,
      discordTag: submission.discordTag,
      coachingType: submission.coachingType,
      rank: submission.rank,
      role: submission.role,
      hero: submission.hero,
      replays: submission.replays,
      submittedAt: submission.submittedAt,
    })
      .then((result) => {
        if (result.success) {
          console.log('Discord notification sent to admin');
        } else {
          console.error(`Failed to send Discord notification: ${result.error}`);
        }
      })
      .catch((error) => {
        console.error('Error sending Discord notification:', error);
      });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in replay submission:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      // Check for database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Unable to process submission. Please try again later.',
          },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
