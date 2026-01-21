import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { replaySubmissionSchema } from '@/lib/validations';
import { sendVodRequestNotification, sendBookingConfirmationNotification } from '@/lib/discord';
import { handleApiError } from '@/lib/api-error-handler';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';
import { getCoachingPackage, formatAmountForStripe } from '@/lib/stripe';

/**
 * POST /api/friend-code/validate
 * Validate friend code and create submission without payment
 *
 * Request body:
 * {
 *   friendCode: string,
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
 *   }>,
 *   scheduledAt?: string
 * }
 *
 * Response: 200 OK
 * {
 *   success: true,
 *   submissionId: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per hour per IP for friend codes
    const rateLimitOptions = {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
      message: 'Too many friend code attempts. Please try again later.',
    };

    const rateLimitResult = await rateLimit(request, rateLimitOptions);

    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Parse request body
    const body = await request.json();
    const { friendCode, scheduledAt, ...submissionData } = body;

    if (!friendCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Friend code is required',
        },
        { status: 400 }
      );
    }

    // Normalize replay codes to uppercase BEFORE validation
    if (submissionData.replays && Array.isArray(submissionData.replays)) {
      submissionData.replays = submissionData.replays.map((replay: any) => ({
        ...replay,
        code: replay.code ? replay.code.toUpperCase() : replay.code,
      }));
    }

    // Validate friend code against database (exclude deleted codes)
    const friendCodeRecord = await prisma.friendCode.findFirst({
      where: {
        code: {
          equals: friendCode.trim(),
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });

    if (!friendCodeRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid friend code',
        },
        { status: 401 }
      );
    }

    // Check if code is active
    if (!friendCodeRecord.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'This friend code has been deactivated',
        },
        { status: 401 }
      );
    }

    // Check if code has expired
    if (friendCodeRecord.expiresAt && new Date(friendCodeRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: 'This friend code has expired',
        },
        { status: 401 }
      );
    }

    // Check if max uses has been reached
    if (friendCodeRecord.maxUses && friendCodeRecord.usesCount >= friendCodeRecord.maxUses) {
      return NextResponse.json(
        {
          success: false,
          error: 'This friend code has reached its maximum number of uses',
        },
        { status: 401 }
      );
    }

    // Validate submission data with Zod
    const validatedData = replaySubmissionSchema.parse(submissionData);

    // Parse scheduledAt for VOD/Live coaching
    const scheduledAtDate = scheduledAt ? new Date(scheduledAt) : null;

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
    if ((validatedData.coachingType === 'vod-review' || validatedData.coachingType === 'live-coaching') && !scheduledAtDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Scheduled time is required for VOD Review and Live Coaching',
        },
        { status: 400 }
      );
    }

    // Get package details for payment record
    const packageDetails = getCoachingPackage(validatedData.coachingType);

    // Create replay submission with PAYMENT_RECEIVED status and link to friend code
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
        status: 'PAYMENT_RECEIVED', // Skip payment step
        friendCodeId: friendCodeRecord.id, // Link to friend code
        replays: {
          create: validatedData.replays.map((replay) => ({
            code: replay.code, // Already normalized to uppercase before validation
            mapName: replay.mapName,
            notes: replay.notes || null,
          })),
        },
        // If scheduledAt is provided, create linked booking
        ...(scheduledAtDate && {
          booking: {
            create: {
              email: validatedData.email,
              sessionType: validatedData.coachingType,
              scheduledAt: scheduledAtDate,
              status: 'CONFIRMED', // Already confirmed since no payment needed
            },
          },
        }),
        // Create friend code payment record
        payment: {
          create: {
            amount: formatAmountForStripe(packageDetails.price),
            currency: 'usd',
            status: 'SUCCEEDED',
            coachingType: validatedData.coachingType,
            customerEmail: validatedData.email,
            // No Stripe IDs since this is a friend code
          },
        },
      },
      include: {
        replays: true,
        booking: true,
        payment: true,
      },
    });

    // Increment the friend code usage count
    await prisma.friendCode.update({
      where: { id: friendCodeRecord.id },
      data: {
        usesCount: {
          increment: 1,
        },
      },
    });

    // If a booking was created, block the time slot
    if (submission.booking && scheduledAtDate) {
      const slotEndTime = new Date(scheduledAtDate.getTime() + 60 * 60 * 1000); // 60 minutes later

      await prisma.availabilityException.create({
        data: {
          date: scheduledAtDate,
          endDate: slotEndTime,
          reason: 'booked',
          notes: `Booking ID: ${submission.booking.id} (Friend Code)`,
          bookingId: submission.booking.id,
        },
      });

      logger.info('Time slot blocked for friend code booking', {
        bookingId: submission.booking.id,
        scheduledAt: scheduledAtDate.toISOString(),
      });
    }

    logger.info('New friend code submission created', {
      submissionId: submission.id,
      replayCount: submission.replays.length,
      coachingType: submission.coachingType,
      hasBooking: !!submission.booking,
      friendCode: friendCode.substring(0, 3) + '***', // Log partial code for security
    });

    // Send Discord confirmation notification to user (non-blocking)
    if (submission.discordId) {
      sendBookingConfirmationNotification({
        id: submission.id,
        email: submission.email,
        discordId: submission.discordId,
        discordUsername: submission.discordUsername,
        coachingType: submission.coachingType,
        rank: submission.rank,
        role: submission.role,
        hero: submission.hero,
        scheduledAt: submission.booking?.scheduledAt || null,
        replays: submission.replays.map((r) => ({
          code: r.code,
          mapName: r.mapName,
        })),
      })
        .then((result) => {
          if (result.success) {
            logger.info('Booking confirmation sent to user via Discord (friend code)', {
              submissionId: submission.id,
              discordUsername: submission.discordUsername,
            });
          } else {
            logger.error('Failed to send booking confirmation via Discord', {
              submissionId: submission.id,
              error: result.error,
            });
          }
        })
        .catch((error) => {
          logger.error('Error sending booking confirmation via Discord', error instanceof Error ? error : new Error(String(error)));
        });
    } else {
      logger.warn('User has no Discord ID, skipping booking confirmation notification', {
        submissionId: submission.id,
      });
    }

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
          logger.info('Discord notification sent to admin (friend code)', {
            submissionId: submission.id,
          });
        } else {
          logger.error('Failed to send Discord notification', {
            submissionId: submission.id,
            error: result.error,
          });
        }
      })
      .catch((error) => {
        logger.error('Error sending Discord notification', error instanceof Error ? error : new Error(String(error)));
      });

    // Get rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitOptions);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
      },
      {
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
