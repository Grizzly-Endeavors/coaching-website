// lib/stripe.ts
import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Server-side Stripe instance
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Client-side Stripe promise (singleton pattern)
let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

// Helper to format amount for Stripe (converts dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper to format amount for display (converts cents to dollars)
export const formatAmountForDisplay = (amount: number): string => {
  return (amount / 100).toFixed(2);
};

// Coaching package pricing configuration
export const COACHING_PACKAGES = {
  'review-async': {
    name: 'Review on My Time',
    description: 'Async VOD review - submit your replay codes and get a detailed video review',
    price: 25, // in dollars
    priceId: process.env.STRIPE_PRICE_ID_REVIEW_ASYNC,
    features: [
      'Submit up to 3 replay codes',
      'Detailed video review',
      'Typically reviewed within 48 hours',
      'Perfect for flexible scheduling',
    ],
  },
  'vod-review': {
    name: 'VOD Review',
    description: 'Live VOD review session - watch together as we analyze your gameplay',
    price: 40, // in dollars
    priceId: process.env.STRIPE_PRICE_ID_VOD_REVIEW,
    features: [
      'Live 1-hour session',
      'Real-time feedback and discussion',
      'Submit replay codes beforehand',
      'Schedule via Google Calendar',
    ],
    popular: true,
  },
  'live-coaching': {
    name: 'Live Coaching',
    description: 'Real-time coaching while you play',
    price: 50, // in dollars
    priceId: process.env.STRIPE_PRICE_ID_LIVE_COACHING,
    features: [
      'Live 1-hour coaching session',
      'Real-time guidance during gameplay',
      'Personalized strategies',
      'Schedule via Google Calendar',
    ],
  },
} as const;

export type CoachingType = keyof typeof COACHING_PACKAGES;

// Validate coaching type
export const isValidCoachingType = (type: string): type is CoachingType => {
  return type in COACHING_PACKAGES;
};

// Get package details
export const getCoachingPackage = (type: CoachingType) => {
  return COACHING_PACKAGES[type];
};
