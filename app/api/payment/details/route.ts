import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-error-handler';

/**
 * GET /api/payment/details
 * Fetch payment details by session_id
 *
 * Query params:
 * - session_id: Stripe session ID
 *
 * Response: 200 OK
 * {
 *   coachingType: string,
 *   email: string,
 *   status: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Find payment by session ID with submission and booking details
    const payment = await prisma.payment.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        coachingType: true,
        customerEmail: true,
        status: true,
        submission: {
          select: {
            id: true,
            booking: {
              select: {
                id: true,
                scheduledAt: true,
                sessionType: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      coachingType: payment.coachingType,
      email: payment.customerEmail,
      status: payment.status,
      submission: payment.submission,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
