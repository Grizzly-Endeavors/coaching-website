import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

function SuccessContent() {
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
                Booking confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-8 text-lg flex items-center justify-center gap-2">
                <span className="text-2xl">👀</span> Sloan will message you shortly
              </p>

              <div className="flex justify-center mb-8">
                <Image
                  src="https://media1.tenor.com/m/9o57HqlEMb4AAAAd/venture-overwatch.gif"
                  alt="Venture Overwatch GIF"
                  width={400}
                  height={300}
                  className="rounded-lg max-w-full h-auto"
                  unoptimized
                />
              </div>

              <div className="flex justify-center">
                <Link href="/">
                  <Button variant="primary" size="lg">
                    Back to Home
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
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
