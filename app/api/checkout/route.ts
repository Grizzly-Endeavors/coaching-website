// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCoachingPackage, isValidCoachingType, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { coachingType, email } = body;

    // Validate coaching type
    if (!coachingType || !isValidCoachingType(coachingType)) {
      return NextResponse.json(
        { error: 'Invalid coaching type' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
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
      },
    });

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        stripeSessionId: session.id,
        amount: formatAmountForStripe(packageDetails.price),
        currency: 'usd',
        status: 'PENDING',
        coachingType,
        customerEmail: email,
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
