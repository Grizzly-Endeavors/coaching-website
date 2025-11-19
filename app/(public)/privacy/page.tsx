import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

/**
 * Privacy Policy page
 *
 * IMPORTANT: This is a placeholder page. The site owner must customize this
 * with proper legal content that complies with applicable privacy laws and
 * regulations (GDPR, CCPA, etc.).
 */
export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              Privacy Policy
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
                    This is a placeholder Privacy Policy page. The site owner must replace this content
                    with a proper privacy policy that complies with applicable laws and regulations,
                    including GDPR, CCPA, and other relevant privacy legislation.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Describe what personal information you collect from users,
                    including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Contact information (name, email, Discord username)</li>
                    <li>Payment information processed through Stripe</li>
                    <li>Game replay codes and related gameplay data</li>
                    <li>Session recordings and coaching notes</li>
                    <li>Website usage data and analytics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Explain how you use the collected information:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>To provide coaching services and schedule sessions</li>
                    <li>To process payments and maintain transaction records</li>
                    <li>To communicate about bookings, updates, and support</li>
                    <li>To improve our services and user experience</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">3. Information Sharing and Disclosure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Describe when and how you share user information with third
                    parties, including payment processors (Stripe), calendar services (Google Calendar),
                    and any other service providers.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">4. Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Explain the security measures you take to protect user data,
                    including encryption, secure storage, and access controls.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">5. Your Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    [Placeholder] Detail user rights regarding their personal data:
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    <li>Right to access your personal information</li>
                    <li>Right to correct or update your data</li>
                    <li>Right to delete your personal information</li>
                    <li>Right to opt-out of certain data processing</li>
                    <li>Right to data portability</li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">6. Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Explain your use of cookies, analytics tools, and other
                    tracking technologies.
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">7. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    [Placeholder] Provide contact details for privacy-related inquiries and
                    data protection officer information if applicable.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card variant="surface" padding="lg" className="mt-8 bg-purple-600/10 border-purple-600/30">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-purple-400">Note to Site Owner:</strong> You should consult
                with a legal professional to ensure your privacy policy complies with all applicable
                laws and accurately reflects your data practices. Consider including specific details
                about your jurisdiction, retention periods, third-party services, and user rights
                under GDPR, CCPA, and other relevant regulations.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
