'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const pricingOptions = [
  {
    id: 'review-async',
    name: 'Review on My Time',
    price: '$25',
    description: 'I review your replay code and send detailed notes via Discord or email',
    features: [
      'Detailed written analysis of your gameplay',
      'Timestamped feedback on key moments',
      'Notes delivered via Discord or email',
      'Review at your own pace',
      '2-3 day turnaround time',
      'Perfect for players who want detailed feedback they can reference anytime',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    highlight: false,
  },
  {
    id: 'vod-review',
    name: 'VOD Review',
    price: '$40',
    description: 'I stream your replay over Discord and review it with you live',
    features: [
      'Live review session over Discord',
      'Real-time discussion and Q&A',
      'I stream the replay and provide commentary',
      'Collaborative analysis',
      'Session recording provided',
      'Direct interaction and immediate answers',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    highlight: true,
  },
  {
    id: 'live-coaching',
    name: 'Live Coaching',
    price: '$50',
    description: 'You stream your game and I make corrections on the fly while you play',
    features: [
      'Real-time coaching during your gameplay',
      'Instant feedback and corrections',
      'You stream via Discord while playing',
      'Live guidance on positioning and decision-making',
      'Most interactive coaching experience',
      'Immediate application of concepts',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    highlight: false,
  },
];

const coachingProcess = [
  {
    step: 1,
    title: 'Choose & Pay',
    description: 'Select your preferred coaching package and complete secure payment via Stripe.',
  },
  {
    step: 2,
    title: 'Submit Details',
    description: 'Submit your replay codes or schedule your live session via Google Calendar.',
  },
  {
    step: 3,
    title: 'Get Coached',
    description: 'Receive detailed feedback via video review or live session with actionable tips.',
  },
  {
    step: 4,
    title: 'Improve',
    description: 'Apply the feedback and strategies to your games and see measurable improvement.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowEmailModal(true);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !selectedPackage) return;

    // Redirect to checkout with package and email
    router.push(`/checkout?type=${selectedPackage}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex flex-col">
      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card variant="surface" padding="lg" className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-2xl">Enter Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout}>
                <p className="text-gray-300 mb-4">
                  We'll send your receipt and booking details to this email.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a40] rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowEmailModal(false);
                      setEmail('');
                      setSelectedPackage(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Coaching Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Choose the coaching style that fits your learning preferences and schedule
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingOptions.map((option) => (
                <Card
                  key={option.name}
                  variant="surface"
                  padding="lg"
                  hover
                  className={`relative ${
                    option.highlight
                      ? 'border-2 border-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]'
                      : ''
                  }`}
                >
                  {option.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 border-b border-[#2a2a40]">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-lg mx-auto mb-4">
                      <div className="text-purple-400">{option.icon}</div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{option.name}</CardTitle>
                    <p className="text-3xl font-bold text-purple-400 mb-3">
                      {option.price}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-8">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
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
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={option.highlight ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                      onClick={() => handlePurchase(option.id)}
                    >
                      Buy Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Simple process from booking to improvement
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coachingProcess.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-4 mx-auto shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Which Option is Right for You?
              </h2>
            </div>

            <div className="space-y-6">
              <Card variant="surface" padding="lg">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      Review on My Time
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Best for players who prefer detailed written feedback they can review at their own pace. Great if you want to focus on specific moments and have a reference document to come back to.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="surface" padding="lg">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                    <span className="text-purple-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      VOD Review
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Perfect for players who want the benefits of watching their gameplay analyzed live with the coach. You'll get real-time explanations and can ask questions as we go through your replay together.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="surface" padding="lg">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                    <span className="text-purple-400 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      Live Coaching
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Ideal for players who learn best by doing. Get instant feedback while you play, allowing you to correct mistakes in real-time and build better habits immediately.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  How do I get started?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Click the "Buy Now" button on your preferred package, complete the secure payment, and then submit your replay codes or schedule your session.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  What rank do I need to be?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  All ranks are welcome! I've coached players from Bronze to Grandmaster. The coaching is tailored to your current skill level and goals.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  How long are the sessions?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  VOD Review and Live Coaching sessions are typically 60 minutes. Review on My Time depends on the replay length but includes comprehensive written analysis.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  Can I ask questions during the session?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Absolutely! VOD Review and Live Coaching sessions are interactive - feel free to ask questions at any time. For Review on My Time, you can reach out with follow-up questions via Discord or email.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Choose your coaching style and start improving today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
