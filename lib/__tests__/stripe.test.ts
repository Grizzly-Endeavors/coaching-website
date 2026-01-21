import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock the environment variable before importing the module
beforeAll(() => {
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_mock_key_for_testing');
});

describe('stripe utilities', () => {
  describe('formatAmountForStripe', () => {
    it('converts dollars to cents', async () => {
      const { formatAmountForStripe } = await import('../stripe');
      expect(formatAmountForStripe(25)).toBe(2500);
      expect(formatAmountForStripe(99.99)).toBe(9999);
      expect(formatAmountForStripe(0.01)).toBe(1);
    });

    it('handles zero', async () => {
      const { formatAmountForStripe } = await import('../stripe');
      expect(formatAmountForStripe(0)).toBe(0);
    });
  });

  describe('formatAmountForDisplay', () => {
    it('converts cents to formatted dollars', async () => {
      const { formatAmountForDisplay } = await import('../stripe');
      expect(formatAmountForDisplay(2500)).toBe('25.00');
      expect(formatAmountForDisplay(9999)).toBe('99.99');
    });
  });

  describe('isValidCoachingType', () => {
    it('returns true for valid coaching types', async () => {
      const { isValidCoachingType } = await import('../stripe');
      expect(isValidCoachingType('vod-review')).toBe(true);
      expect(isValidCoachingType('live-coaching')).toBe(true);
      expect(isValidCoachingType('review-async')).toBe(true);
    });

    it('returns false for invalid types', async () => {
      const { isValidCoachingType } = await import('../stripe');
      expect(isValidCoachingType('INVALID')).toBe(false);
      expect(isValidCoachingType('')).toBe(false);
    });
  });
});
