import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { loadLocale, interpolate } from '@/lib/locales';
import type { Metadata } from 'next';

const privacyLocale = loadLocale('privacy');
const metadataLocale = loadLocale('metadata');

export const metadata: Metadata = {
  title: metadataLocale.privacy.title as string,
  description: metadataLocale.privacy.description as string,
};

/**
 * Privacy Policy page
 *
 * IMPORTANT: This is a placeholder page. The site owner must customize this
 * with proper legal content that complies with applicable privacy laws and
 * regulations (GDPR, CCPA, etc.).
 */
export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              {privacyLocale.hero.title as string}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {interpolate(privacyLocale.hero.last_updated as string, { date: currentDate })}
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
                    {privacyLocale.notice.title as string}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.notice.message as string}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-8">
              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.information_collected.number}. {privacyLocale.sections.information_collected.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {privacyLocale.sections.information_collected.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(privacyLocale.sections.information_collected.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.how_we_use.number}. {privacyLocale.sections.how_we_use.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {privacyLocale.sections.how_we_use.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(privacyLocale.sections.how_we_use.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.information_sharing.number}. {privacyLocale.sections.information_sharing.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.information_sharing.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.data_security.number}. {privacyLocale.sections.data_security.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.data_security.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.user_rights.number}. {privacyLocale.sections.user_rights.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {privacyLocale.sections.user_rights.intro as string}
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                    {(privacyLocale.sections.user_rights.items as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.cookies.number}. {privacyLocale.sections.cookies.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.cookies.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.contact.number}. {privacyLocale.sections.contact.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.contact.content as string}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card variant="surface" padding="lg" className="mt-8 bg-purple-600/10 border-purple-600/30">
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-purple-400">{privacyLocale.legal_notice.title as string}</strong> {privacyLocale.legal_notice.message as string}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
