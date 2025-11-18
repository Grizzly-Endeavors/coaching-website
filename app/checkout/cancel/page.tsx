import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Cancelled | Overwatch Coaching',
  description: 'Your payment was cancelled.',
};

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card variant="surface" padding="lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 bg-yellow-600/20 rounded-full">
                  <svg
                    className="w-12 h-12 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl mb-4 text-yellow-400">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6 text-lg">
                Your payment was cancelled and no charges were made.
              </p>

              <div className="bg-[#1a1a2e] rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  What would you like to do?
                </h3>
                <ul className="text-left space-y-3 text-gray-300">
                  <li className="flex items-start">
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
                    <span>Return to pricing to choose a different package</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Contact us if you have questions or need assistance</span>
                  </li>
                  <li className="flex items-start">
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
                    <span>Try again when you're ready - your cart is saved</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button variant="primary" size="lg">
                    View Pricing
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="secondary" size="lg">
                    Contact Us
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
