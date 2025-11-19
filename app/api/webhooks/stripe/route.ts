// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { sendBookingConfirmationNotification } from '@/lib/discord';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed', err instanceof Error ? err : new Error(String(err)));
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
        logger.debug('Unhandled Stripe webhook event type', {
          eventType: event.type,
        });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  logger.info('Checkout session completed', {
    sessionId: session.id,
    paymentStatus: session.payment_status,
  });

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
  logger.info('Payment intent succeeded', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });

  // Update payment status to succeeded and fetch related data
  const payment = await prisma.payment.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { status: 'SUCCEEDED' },
    include: {
      submission: {
        include: {
          booking: true,
          replays: {
            select: {
              code: true,
              mapName: true,
            },
          },
        },
      },
    },
  });

  logger.info('Payment updated successfully', {
    paymentId: payment.id,
    hasSubmission: !!payment.submission,
  });

  // If payment is linked to a submission, update submission and booking status
  if (payment.submission) {
    await prisma.replaySubmission.update({
      where: { id: payment.submission.id },
      data: { status: 'PAYMENT_RECEIVED' },
    });

    logger.info('Submission status updated to PAYMENT_RECEIVED', {
      submissionId: payment.submission.id,
    });

    // If submission has a booking, confirm it
    if (payment.submission.booking) {
      await prisma.booking.update({
        where: { id: payment.submission.booking.id },
        data: { status: 'CONFIRMED' },
      });

      logger.info('Booking status updated to CONFIRMED', {
        bookingId: payment.submission.booking.id,
      });
    }

    // Send Discord confirmation notification to user
    if (payment.submission.discordId) {
      const notificationResult = await sendBookingConfirmationNotification({
        id: payment.submission.id,
        email: payment.submission.email,
        discordId: payment.submission.discordId,
        discordUsername: payment.submission.discordUsername,
        coachingType: payment.submission.coachingType,
        rank: payment.submission.rank,
        role: payment.submission.role,
        hero: payment.submission.hero,
        scheduledAt: payment.submission.booking?.scheduledAt || null,
        replays: payment.submission.replays.map(r => ({
          code: r.code,
          mapName: r.mapName,
        })),
      });

      if (notificationResult.success) {
        logger.info('Booking confirmation sent to user via Discord', {
          submissionId: payment.submission.id,
          discordUsername: payment.submission.discordUsername,
        });
      } else {
        logger.error('Failed to send booking confirmation via Discord', {
          submissionId: payment.submission.id,
          error: notificationResult.error,
        });
      }
    } else {
      logger.warn('User has no Discord ID, skipping booking confirmation notification', {
        submissionId: payment.submission.id,
      });
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  logger.warn('Payment intent failed', {
    paymentIntentId: paymentIntent.id,
    failureReason: paymentIntent.last_payment_error?.message,
  });

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

  logger.info('Payment marked as failed', {
    paymentId: payment.id,
    hasSubmission: !!payment.submission,
  });

  // If payment is linked to a submission, update submission and booking status
  if (payment.submission) {
    await prisma.replaySubmission.update({
      where: { id: payment.submission.id },
      data: { status: 'PAYMENT_FAILED' },
    });

    logger.info('Submission status updated to PAYMENT_FAILED', {
      submissionId: payment.submission.id,
    });

    // If submission has a booking, cancel it and free up the slot
    if (payment.submission.booking) {
      // Update booking status to cancelled
      await prisma.booking.update({
        where: { id: payment.submission.booking.id },
        data: { status: 'CANCELLED' },
      });

      logger.info('Booking status updated to CANCELLED', {
        bookingId: payment.submission.booking.id,
      });

      // Delete the availability exception to free up the time slot
      await prisma.availabilityException.deleteMany({
        where: {
          bookingId: payment.submission.booking.id,
          reason: 'booked',
        },
      });

      logger.info('Time slot freed for cancelled booking', {
        bookingId: payment.submission.booking.id,
      });
    }
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  logger.info('Charge refunded', {
    chargeId: charge.id,
    amount: charge.amount_refunded,
    currency: charge.currency,
  });

  // Find payment by payment intent ID
  if (charge.payment_intent) {
    await prisma.payment.update({
      where: { stripePaymentId: charge.payment_intent as string },
      data: { status: 'REFUNDED' },
    });
  }
}
