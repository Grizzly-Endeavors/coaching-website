import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Find payment by session ID
    const payment = await prisma.payment.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        coachingType: true,
        customerEmail: true,
        status: true,
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
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
}
