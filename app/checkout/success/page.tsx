'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch payment details to get coaching type
      fetch(`/api/payment/details?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setPaymentDetails(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const getNextSteps = () => {
    if (!paymentDetails?.coachingType) {
      return [
        'You\'ll receive a confirmation email shortly',
        'Your booking has been confirmed',
        'Check your email for next steps'
      ];
    }

    switch (paymentDetails.coachingType) {
      case 'review-async':
        return [
          'You\'ll receive a confirmation email shortly',
          'Your replay submission has been confirmed',
          'I\'ll review your replays and send detailed feedback within 2-3 business days',
          'Check your email or Discord for the review'
        ];
      case 'vod-review':
        return [
          'You\'ll receive a confirmation email shortly',
          'Your VOD review session has been booked',
          'A Discord notification has been sent - I\'ll reach out closer to your session time',
          'I\'ll see you at the scheduled time on Discord!'
        ];
      case 'live-coaching':
        return [
          'You\'ll receive a confirmation email shortly',
          'Your live coaching session has been booked',
          'A Discord notification has been sent - I\'ll reach out closer to your session time',
          'Make sure you\'re ready to stream your gameplay on Discord!'
        ];
      default:
        return [
          'You\'ll receive a confirmation email shortly',
          'Your booking has been confirmed',
          'Check your email for next steps'
        ];
    }
  };

  const getTitle = () => {
    if (!paymentDetails?.coachingType) {
      return 'Booking Confirmed!';
    }

    switch (paymentDetails.coachingType) {
      case 'review-async':
        return 'Replay Review Confirmed!';
      case 'vod-review':
        return 'VOD Session Booked!';
      case 'live-coaching':
        return 'Coaching Session Booked!';
      default:
        return 'Booking Confirmed!';
    }
  };

  const formatAppointmentTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: 'America/New_York',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card variant="surface" padding="lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full">
                  <svg
                    className="w-12 h-12 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl mb-4 text-green-400">
                {loading ? 'Payment Successful!' : getTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6 text-lg">
                Thank you for your purchase! Your payment has been processed successfully.
              </p>

              {/* Show scheduled time for VOD/Live coaching */}
              {paymentDetails?.submission?.booking?.scheduledAt && (
                <div className="bg-purple-600/10 border border-purple-600/30 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    Your Session is Scheduled
                  </h3>
                  <p className="text-2xl font-semibold text-purple-400">
                    {formatAppointmentTime(paymentDetails.submission.booking.scheduledAt)}
                  </p>
                  <p className="text-gray-400 mt-2 text-sm">
                    Make sure to be available on Discord at this time!
                  </p>
                </div>
              )}

              <div className="bg-[#1a1a2e] rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  What's Next?
                </h3>
                <ul className="text-left space-y-3 text-gray-300">
                  {getNextSteps().map((step, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {sessionId && (
                <p className="text-sm text-gray-400 mb-6">
                  Session ID: {sessionId}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="primary" size="lg">
                    Back to Home
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}