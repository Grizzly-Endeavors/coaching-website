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
 * NOTE: This privacy policy was generated based on the website's features and integrations.
 * While it provides reasonable coverage, it should be reviewed by a legal professional and
 * customized for your specific jurisdiction before relying on it for legal compliance.
 *
 * TODO: Have a lawyer review this policy
 * TODO: Customize data retention periods if needed
 * TODO: Verify compliance with local privacy laws (GDPR, CCPA, etc.)
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
                  <CardTitle className="text-2xl">{privacyLocale.sections.data_retention.number}. {privacyLocale.sections.data_retention.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.data_retention.content as string}
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
                  <CardTitle className="text-2xl">{privacyLocale.sections.third_party_services.number}. {privacyLocale.sections.third_party_services.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.third_party_services.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.childrens_privacy.number}. {privacyLocale.sections.childrens_privacy.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.childrens_privacy.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.international_users.number}. {privacyLocale.sections.international_users.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.international_users.content as string}
                  </p>
                </CardContent>
              </Card>

              <Card variant="surface" padding="lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{privacyLocale.sections.changes_to_policy.number}. {privacyLocale.sections.changes_to_policy.title as string}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {privacyLocale.sections.changes_to_policy.content as string}
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
          </div>
        </div>
      </section>
    </div>
  );
}
