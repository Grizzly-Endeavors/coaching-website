// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  // Update payment status
  await prisma.payment.update({
    where: { stripeSessionId: session.id },
    data: {
      status: 'PROCESSING',
      stripePaymentId: session.payment_intent as string,
    },
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  // Update payment status to succeeded and fetch related data
  const payment = await prisma.payment.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { status: 'SUCCEEDED' },
    include: {
      submission: {
        include: {
          booking: true,
        },
      },
    },
  });

  console.log('Payment updated successfully:', payment.id);

  // If payment is linked to a submission, update submission and booking status
  if (payment.submission) {
    await prisma.replaySubmission.update({
      where: { id: payment.submission.id },
      data: { status: 'PAYMENT_RECEIVED' },
    });

    console.log(`Submission ${payment.submission.id} status updated to PAYMENT_RECEIVED`);

    // If submission has a booking, confirm it
    if (payment.submission.booking) {
      await prisma.booking.update({
        where: { id: payment.submission.booking.id },
        data: { status: 'CONFIRMED' },
      });

      console.log(`Booking ${payment.submission.booking.id} status updated to CONFIRMED`);
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  // Update payment status to failed and fetch related data
  const payment = await prisma.payment.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { status: 'FAILED' },
    include: {
      submission: {
        include: {
          booking: true,
        },
      },
    },
  });

  console.log('Payment failed:', payment.id);

  // If payment is linked to a submission, update submission and booking status
  if (payment.submission) {
    await prisma.replaySubmission.update({
      where: { id: payment.submission.id },
      data: { status: 'PAYMENT_FAILED' },
    });

    console.log(`Submission ${payment.submission.id} status updated to PAYMENT_FAILED`);

    // If submission has a booking, cancel it and free up the slot
    if (payment.submission.booking) {
      // Update booking status to cancelled
      await prisma.booking.update({
        where: { id: payment.submission.booking.id },
        data: { status: 'CANCELLED' },
      });

      console.log(`Booking ${payment.submission.booking.id} status updated to CANCELLED`);

      // Delete the availability exception to free up the time slot
      await prisma.availabilityException.deleteMany({
        where: {
          bookingId: payment.submission.booking.id,
          reason: 'booked',
        },
      });

      console.log(`Time slot freed for cancelled booking: ${payment.submission.booking.id}`);
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id);

  // Find payment by payment intent ID
  if (charge.payment_intent) {
    await prisma.payment.update({
      where: { stripePaymentId: charge.payment_intent as string },
      data: { status: 'REFUNDED' },
    });
  }
}
