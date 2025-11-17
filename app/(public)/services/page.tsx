import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Overwatch Coaching',
  description: 'Explore our Overwatch coaching services including VOD reviews, 1-on-1 coaching sessions, and role-specific training. Find the perfect package for your needs.',
};

const pricingTiers = [
  {
    name: 'VOD Review',
    description: 'Detailed replay code analysis with actionable feedback',
    price: 'Contact for pricing',
    features: [
      '15-20 minute video review',
      'Timestamped analysis',
      'Written summary document',
      'Positioning improvements',
      'Cooldown usage tips',
      '2-3 day turnaround',
    ],
    popular: false,
  },
  {
    name: '1-on-1 Coaching',
    description: 'Live coaching session with real-time feedback',
    price: 'Contact for pricing',
    features: [
      '60-minute live session',
      'Screen share analysis',
      'Live gameplay coaching',
      'Personalized strategies',
      'Q&A opportunity',
      'Session recording provided',
    ],
    popular: true,
  },
  {
    name: 'Coaching Package',
    description: 'Multiple sessions for comprehensive improvement',
    price: 'Contact for pricing',
    features: [
      '4 x 60-minute sessions',
      'Ongoing support via Discord',
      'Progress tracking',
      'Custom training plans',
      'Priority scheduling',
      'Best value per session',
    ],
    popular: false,
  },
];

const roleSpecificCoaching = [
  {
    role: 'Tank',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    focus: [
      'Space creation and control',
      'Engagement timing',
      'Cooldown management',
      'Positioning and peeling',
    ],
  },
  {
    role: 'DPS',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    focus: [
      'Target prioritization',
      'Aim improvement techniques',
      'Flanking and positioning',
      'Ultimate usage timing',
    ],
  },
  {
    role: 'Support',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    focus: [
      'Positioning and safety',
      'Resource management',
      'Triage decision making',
      'Ultimate economy',
    ],
  },
];

const coachingProcess = [
  {
    step: 1,
    title: 'Book or Submit',
    description: 'Choose between live coaching or VOD review. Submit your replay code or book a time slot.',
  },
  {
    step: 2,
    title: 'Analysis',
    description: 'I analyze your gameplay, identifying strengths, weaknesses, and improvement opportunities.',
  },
  {
    step: 3,
    title: 'Delivery',
    description: 'Receive detailed feedback via video review or live session with actionable tips.',
  },
  {
    step: 4,
    title: 'Improve',
    description: 'Apply the feedback and strategies to your games and see measurable improvement.',
  },
];

const faqs = [
  {
    question: 'What ranks do you coach?',
    answer: 'I coach all ranks from Bronze to Grandmaster. Each coaching session is tailored to your current skill level and goals.',
  },
  {
    question: 'How long does a VOD review take?',
    answer: 'VOD reviews typically have a 2-3 day turnaround time. You\'ll receive a 15-20 minute video with timestamped analysis and a written summary.',
  },
  {
    question: 'Can I request a specific hero to focus on?',
    answer: 'Absolutely! Whether you want to improve on a specific hero or your overall role performance, I can tailor the coaching to your needs.',
  },
  {
    question: 'What platform do you use for live coaching?',
    answer: 'Live coaching sessions are conducted via Discord with screen sharing. You\'ll receive the session recording afterward for review.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'If you\'re not satisfied with your coaching session, please contact me within 48 hours and we\'ll work something out.',
  },
  {
    question: 'How do I submit a replay code?',
    answer: 'You can submit your replay code through the booking page. Make sure to include relevant information like your rank, role, and what you\'d like to improve.',
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Coaching Services
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Professional Overwatch coaching tailored to your rank, role, and goals. Choose the service that best fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Service Packages
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose the coaching option that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                variant={tier.popular ? 'elevated' : 'surface'}
                className={`flex flex-col ${
                  tier.popular ? 'border-purple-600 shadow-[0_0_30px_rgba(139,92,246,0.2)]' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <p className="text-gray-400 text-sm">{tier.description}</p>
                  <p className="text-3xl font-bold text-purple-400 mt-4">{tier.price}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
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
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/booking" className="w-full">
                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      {tier.popular ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Specific Coaching */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Role-Specific Coaching
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Specialized training for your preferred role
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roleSpecificCoaching.map((role) => (
              <Card key={role.role} hover variant="surface">
                <CardHeader>
                  <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-lg mb-4 mx-auto">
                    <div className="text-purple-400">{role.icon}</div>
                  </div>
                  <CardTitle className="text-center text-2xl">{role.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.focus.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-4 h-4 text-purple-400 mr-2 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coaching Process */}
      <section className="py-20 bg-[#0f0f23]">
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

      {/* FAQ Section */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Got questions? We've got answers
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} variant="surface" padding="lg">
                <h3 className="text-xl font-bold text-gray-100 mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Book a coaching session or submit your replay code today and start your journey to the next rank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Book Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
