import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { loadLocale, interpolate } from '@/lib/locales';
import type { Metadata } from 'next';

const termsLocale = loadLocale('terms');
const metadataLocale = loadLocale('metadata');

export const metadata: Metadata = {
  title: metadataLocale.terms.title as string,
  description: metadataLocale.terms.description as string,
};

/**
 * Terms of Service page
 *
 * NOTE: These terms were generated based on the website's features and business model.
 * While they provide reasonable coverage, they should be reviewed by a legal professional
 * and customized for your specific situation before relying on them for legal protection.
 *
 * TODO: Have a lawyer review these terms
 * TODO: Customize Section 15 (Governing Law) with your actual jurisdiction
 * TODO: Verify refund policy matches your business preferences
 * TODO: Adjust cancellation/no-show policies if needed
 */
export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              {termsLocale.hero.title as string}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {interpolate(termsLocale.hero.last_updated as string, { date: currentDate })}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-[#0f0f23] flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.acceptance.number}. {termsLocale.sections.acceptance.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.acceptance.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.service_description.number}. {termsLocale.sections.service_description.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {termsLocale.sections.service_description.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(termsLocale.sections.service_description.services as string[]).map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                  <p className="text-gray-300 leading-relaxed mt-4">
                    {termsLocale.sections.service_description.outro as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.booking.number}. {termsLocale.sections.booking.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {termsLocale.sections.booking.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(termsLocale.sections.booking.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.payment.number}. {termsLocale.sections.payment.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {termsLocale.sections.payment.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(termsLocale.sections.payment.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.user_responsibilities.number}. {termsLocale.sections.user_responsibilities.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {termsLocale.sections.user_responsibilities.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(termsLocale.sections.user_responsibilities.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.intellectual_property.number}. {termsLocale.sections.intellectual_property.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.intellectual_property.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.limitations.number}. {termsLocale.sections.limitations.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {termsLocale.sections.limitations.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(termsLocale.sections.limitations.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.privacy.number}. {termsLocale.sections.privacy.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.privacy.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.termination.number}. {termsLocale.sections.termination.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.termination.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.changes.number}. {termsLocale.sections.changes.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.changes.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.contact.number}. {termsLocale.sections.contact.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.contact.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.code_of_conduct.number}. {termsLocale.sections.code_of_conduct.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.code_of_conduct.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.dispute_resolution.number}. {termsLocale.sections.dispute_resolution.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.dispute_resolution.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.general.number}. {termsLocale.sections.general.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.general.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{termsLocale.sections.governing_law.number}. {termsLocale.sections.governing_law.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.governing_law.content as string}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
