'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissionId = searchParams.get('submissionId');
  const coachingType = searchParams.get('type');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate required parameters - either submissionId OR (coachingType AND email)
    if (!submissionId && (!coachingType || !email)) {
      setError('Missing required parameters. Please start from the booking page.');
      return;
    }

    // Auto-redirect to Stripe Checkout
    handleCheckout();
  }, [submissionId, coachingType, email]);

  const handleCheckout = async () => {
    if (!submissionId && (!coachingType || !email)) {
      setError('Missing required information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = submissionId
        ? { submissionId }
        : { coachingType, email };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card variant="surface" padding="lg">
              <CardHeader>
                <CardTitle className="text-red-400">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">{error}</p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/pricing')}
                >
                  Back to Pricing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card variant="surface" padding="lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Processing Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
              </div>
              <p className="text-gray-300 mb-4">
                Redirecting you to secure checkout...
              </p>
              <p className="text-sm text-gray-400">
                Please do not close this window
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}