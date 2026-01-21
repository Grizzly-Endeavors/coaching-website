import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { replaySubmissionSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error-handler';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

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
    // Rate limiting: 20 requests per 15 minutes per IP
    const rateLimitOptions = {
      maxRequests: 20,
      windowMs: 15 * 60 * 1000, // 15 minutes
      message: 'Too many replay submissions.',
    };

    const rateLimitResult = await rateLimit(request, rateLimitOptions);

    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Parse request body
    const body = await request.json();

    // Normalize replay codes to uppercase BEFORE validation
    if (body.replays && Array.isArray(body.replays)) {
      body.replays = body.replays.map((replay: any) => ({
        ...replay,
        code: replay.code ? replay.code.toUpperCase() : replay.code,
      }));
    }

    // Validate request body with Zod
    const validatedData = replaySubmissionSchema.parse(body);

    // Extract optional scheduledAt for VOD/Live coaching
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

    // Check for Discord OAuth data in cookies
    let discordData = null;
    const discordCookie = request.cookies.get('discord_user_data')?.value;
    if (discordCookie) {
      try {
        discordData = JSON.parse(discordCookie);
        logger.debug('Discord OAuth data found', {
          discordUsername: discordData.discordUsername,
          hasAccessToken: !!discordData.discordAccessToken,
        });
      } catch (error) {
        logger.error('Failed to parse Discord cookie data', error instanceof Error ? error : new Error(String(error)));
      }
    }

    // Validate that VOD Review and Live Coaching have scheduledAt
    if ((validatedData.coachingType === 'vod-review' || validatedData.coachingType === 'live-coaching') && !scheduledAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Scheduled time is required for VOD Review and Live Coaching',
        },
        { status: 400 }
      );
    }

    // Create replay submission in database with nested replay codes and optional booking
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
        inGameName: validatedData.inGameName || null,
        status: 'AWAITING_PAYMENT', // Changed from PENDING to AWAITING_PAYMENT
        replays: {
          create: validatedData.replays.map((replay) => ({
            code: replay.code, // Already normalized to uppercase before validation
            mapName: replay.mapName,
            notes: replay.notes || null,
          })),
        },
        // If scheduledAt is provided, create linked booking
        ...(scheduledAt && {
          booking: {
            create: {
              email: validatedData.email,
              sessionType: validatedData.coachingType,
              scheduledAt: scheduledAt,
              status: 'PENDING',
            },
          },
        }),
      },
      include: {
        replays: true,
        booking: true,
      },
    });

    // If a booking was created, block the time slot
    if (submission.booking && scheduledAt) {
      const slotEndTime = new Date(scheduledAt.getTime() + 60 * 60 * 1000); // 60 minutes later

      await prisma.availabilityException.create({
        data: {
          date: scheduledAt,
          endDate: slotEndTime,
          reason: 'booked',
          notes: `Booking ID: ${submission.booking.id}`,
          bookingId: submission.booking.id,
        },
      });

      logger.info('Time slot blocked for booking', {
        bookingId: submission.booking.id,
        scheduledAt: scheduledAt.toISOString(),
      });
    }

    logger.info('New replay submission created', {
      submissionId: submission.id,
      replayCount: submission.replays.length,
      coachingType: submission.coachingType,
      hasBooking: !!submission.booking,
    });

    // Note: Admin notification is sent after payment confirmation (see webhooks/stripe)

    // Get rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitOptions);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
      },
      {
        status: 201,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
