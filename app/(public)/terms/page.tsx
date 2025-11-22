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
 * IMPORTANT: This is a placeholder page. The site owner must customize this
 * with proper legal content that accurately reflects the terms and conditions
 * of using their coaching services.
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
            <Card variant="surface" padding="lg" className="mb-8 bg-yellow-500/10 border-yellow-500/30">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 bg-brand-600/20 rounded-lg mr-4 flex-shrink-0">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-yellow-400 mb-2">
                    {termsLocale.notice.title as string}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.notice.message as string}
                  </p>
                </div>
              </div>
            </Card>

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
                  <CardTitle className="text-2xl">{termsLocale.sections.governing_law.number}. {termsLocale.sections.governing_law.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {termsLocale.sections.governing_law.content as string}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card variant="surface" padding="lg" className="mt-8 bg-brand-600/10 border-brand-600/30">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-brand-400">{termsLocale.legal_notice.title as string}</strong> {termsLocale.legal_notice.message as string}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
