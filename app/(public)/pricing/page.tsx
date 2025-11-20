'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const pricingOptions = [
  {
    id: 'review-async',
    name: 'Asynchronous VOD Review',
    price: '$25',
    description: 'Send me your replay codes and I\'ll send back structured notes with focused improvements',
    features: [
      'I review your replays on my time',
      'Structured written notes focusing on 1-2 key patterns',
      'Notes delivered via Discord or email',
      'Most accessible option',
      'Review at your own pace',
      'Perfect for players who want focused feedback they can reference anytime',
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
    name: 'Live VOD Review',
    price: '$40',
    description: 'We go through your replay together - I pause at key points and guide your thinking',
    features: [
      'Live session over Discord (typically 60 minutes)',
      'I review the code beforehand and focus on 1-2 key lessons',
      'I pause and ask what you were thinking',
      'I guide your thought process toward the answers',
      'Teaching you how to think, not just what to do',
      'Primary offering - most effective for learning',
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
    description: 'I sit over your shoulder while you play and help break stubborn habits in real-time',
    features: [
      'You stream your live gameplay via Discord',
      'Real-time corrections as you play',
      'Best for breaking stubborn habits you can\'t shake',
      'The game moves faster than you can think - I catch patterns before they happen',
      'Most effective for players who know what to do but struggle with execution',
      'Helps disrupt bad patterns so you can continue improving on your own',
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
    title: 'Choose Package',
    description: 'Select your preferred coaching package and submit your details.',
  },
  {
    step: 2,
    title: 'Schedule & Book',
    description: 'Submit your replay codes or schedule your live session via Google Calendar.',
  },
  {
    step: 3,
    title: 'Complete Payment',
    description: 'After booking your time, complete secure payment via Stripe.',
  },
  {
    step: 4,
    title: 'Get Coached',
    description: 'Receive detailed feedback and coaching, then apply it to improve your gameplay.',
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Coaching Options
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Three formats designed around sustainable improvement - pick what works for your situation
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

                    <Link href={`/booking?type=${option.id}`} className="block">
                      <Button
                        variant={option.highlight ? 'primary' : 'outline'}
                        size="lg"
                        className="w-full"
                      >
                        Select Package
                      </Button>
                    </Link>
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
                      Asynchronous VOD Review
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      The most accessible option. You send replay codes when it works for you, and I review them when I have the chance. You get structured notes with one or two focused things to work on - no information overload.
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
                      Live VOD Review
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      My primary offering. By asking questions about your thinking and guiding you toward the answers, you learn how to analyze your own gameplay. This is about teaching you to think, not just telling you what to do.
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
                      For specific situations where you know what you need to do but have a stubborn habit you can't break. I catch patterns as they're happening and redirect you before you fall into them. Most effective for high-level execution issues.
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
                  What rank do I need to be?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Anyone who wants to be the best they can be while still having fun. I work best with players who want to work with me - if you're engaged and willing to put in the effort, I'll go above and beyond to help you get where you're trying to go.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  Is coaching really worth it for a video game?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  VODs and coaching aren't as boring as they're made out to be. It's absolutely worth investing in - even for a video game. A lot of people are turned away before they even try, but most find it way more valuable and enjoyable than they expected.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  What's your coaching style like?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Playful roasting. There will likely be some "So... what did you think was gonna happen?" moments. It makes sessions feel less like being lectured and more like improving with a friend who keeps it real. It's just more fun this way (for both of us).
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  How long does it take to see improvement?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  There are no quick fixes - you have to commit to showing up and doing the work day after day. But with quality practice focused on what actually matters, you'll see progress faster than grinding aimlessly for hours.
                </p>
              </Card>

              <Card variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  All major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor.
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
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Pick the format that works for you and let's get to work
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
