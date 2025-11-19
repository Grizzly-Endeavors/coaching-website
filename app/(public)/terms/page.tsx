import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * Terms of Service page
 *
 * IMPORTANT: This is a placeholder page. The site owner must customize this
 * with proper legal content that accurately reflects the terms and conditions
 * of using their coaching services.
 */
export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#0f0f23] flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card variant="surface" padding="lg" className="mb-8 bg-yellow-500/10 border-yellow-500/30">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">
                    Placeholder Notice
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    This is a placeholder Terms of Service page. The site owner must replace this
                    content with proper terms and conditions that accurately reflect their business
                    practices, service offerings, and legal requirements.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] By accessing and using this coaching service, you accept and agree
                    to be bound by the terms and provisions of this agreement. If you do not agree
                    to these terms, please do not use this service.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">2. Service Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Describe the coaching services provided:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Review on My Time (asynchronous replay review)</li>
                    <li>VOD Review (live replay review sessions)</li>
                    <li>Live Coaching (real-time gameplay coaching)</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    All services are provided for Overwatch gameplay improvement and are subject
                    to availability and scheduling.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">3. Booking and Scheduling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Define the booking process and policies:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>How to book sessions and submit replay codes</li>
                    <li>Session duration and scheduling procedures</li>
                    <li>Cancellation and rescheduling policies</li>
                    <li>No-show policy and refund conditions</li>
                    <li>Required notice periods for changes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">4. Payment Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Detail payment terms and conditions:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Payment is processed through Stripe</li>
                    <li>Pricing structure for different coaching packages</li>
                    <li>Payment must be completed before service delivery</li>
                    <li>Refund policy and conditions</li>
                    <li>Dispute resolution procedures</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">5. User Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Specify user obligations and expected behavior:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Provide accurate information when booking</li>
                    <li>Be available for scheduled sessions</li>
                    <li>Maintain respectful communication</li>
                    <li>Provide valid replay codes or gameplay access</li>
                    <li>Follow coaching instructions and guidelines</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">6. Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Address ownership of coaching materials, session recordings,
                    written analyses, and any other intellectual property created during or
                    for the coaching sessions.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">7. Service Limitations and Disclaimers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Include important disclaimers:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>No guarantee of specific rank improvements</li>
                    <li>Results depend on individual effort and practice</li>
                    <li>Service availability and technical requirements</li>
                    <li>Limitation of liability for service interruptions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">8. Privacy and Data Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Reference your Privacy Policy and explain how user data,
                    session recordings, and gameplay information will be used, stored, and protected.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">9. Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Describe conditions under which services may be terminated,
                    including violation of terms, inappropriate behavior, or other valid reasons.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">10. Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Reserve the right to modify these terms and explain how users
                    will be notified of changes.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">11. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Provide contact information for questions about these terms
                    and conditions.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">12. Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Specify the jurisdiction and governing law for these terms
                    and any disputes that may arise.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card variant="surface" padding="lg" className="mt-8 bg-purple-600/10 border-purple-600/30">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-purple-400">Note to Site Owner:</strong> You should consult
                with a legal professional to ensure your terms of service properly protect your
                business and comply with all applicable laws. Consider including specific details
                about your refund policy, liability limitations, dispute resolution procedures,
                and any other terms relevant to your coaching services.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
