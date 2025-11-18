// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCoachingPackage, isValidCoachingType, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, coachingType: directCoachingType, email: directEmail } = body;

    let coachingType: string;
    let email: string;
    let submissionToLink: string | undefined;

    // Handle two cases: with submissionId or with direct coachingType/email
    if (submissionId) {
      // Fetch submission from database
      const submission = await prisma.replaySubmission.findUnique({
        where: { id: submissionId },
        select: {
          id: true,
          coachingType: true,
          email: true,
          payment: {
            select: { id: true }
          }
        }
      });

      if (!submission) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }

      // Check if payment already exists for this submission
      if (submission.payment) {
        return NextResponse.json(
          { error: 'Payment already exists for this submission' },
          { status: 400 }
        );
      }

      coachingType = submission.coachingType;
      email = submission.email;
      submissionToLink = submission.id;
    } else if (directCoachingType && directEmail) {
      // Backward compatibility: direct coaching type and email
      coachingType = directCoachingType;
      email = directEmail;
    } else {
      return NextResponse.json(
        { error: 'Either submissionId or (coachingType and email) is required' },
        { status: 400 }
      );
    }

    // Validate coaching type
    if (!isValidCoachingType(coachingType)) {
      return NextResponse.json(
        { error: 'Invalid coaching type' },
        { status: 400 }
      );
    }

    const packageDetails = getCoachingPackage(coachingType);

    if (!packageDetails.priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this package' },
        { status: 500 }
      );
    }

    // Get the base URL for redirects
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: packageDetails.priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        coachingType,
        email,
        ...(submissionToLink && { submissionId: submissionToLink }),
      },
    });

    // Create a pending payment record
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: session.payment_intent as string,
        stripeSessionId: session.id,
        amount: formatAmountForStripe(packageDetails.price),
        currency: 'usd',
        status: 'PENDING',
        coachingType,
        customerEmail: email,
        ...(submissionToLink && { submissionId: submissionToLink }),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
