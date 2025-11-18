// app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const coachingType = searchParams.get('coachingType');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find a successful payment for this email and coaching type (if specified)
    const payment = await prisma.payment.findFirst({
      where: {
        customerEmail: email,
        status: 'SUCCEEDED',
        ...(coachingType ? { coachingType } : {}),
        submissionId: null, // Payment not yet linked to a submission
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!payment) {
      return NextResponse.json(
        { valid: false, message: 'No valid payment found' },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      payment: {
        id: payment.id,
        coachingType: payment.coachingType,
        amount: payment.amount,
        currency: payment.currency,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
