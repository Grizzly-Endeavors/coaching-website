import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { loadLocale } from '@/lib/locales';
import type { Metadata } from 'next';

const pricingLocale = loadLocale('pricing');
const metadataLocale = loadLocale('metadata');

export const metadata: Metadata = {
  title: metadataLocale.pricing.title as string,
  description: metadataLocale.pricing.description as string,
};

const iconComponents = {
  document: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

type PricingOption = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight: boolean;
};

const pricingOptions: Array<PricingOption & { icon: React.ReactElement }> = (pricingLocale.options as PricingOption[]).map((option, index) => ({
  ...option,
  icon: Object.values(iconComponents)[index],
}));

const coachingProcess = pricingLocale.how_it_works.steps as Array<{
  step: number;
  title: string;
  description: string;
}>;

const comparisonOptions = pricingLocale.comparison.options as Array<{
  number: number;
  title: string;
  description: string;
}>;

const faqItems = pricingLocale.faq.items as Array<{
  question: string;
  answer: string;
}>;


export default function PricingPage() {
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              {pricingLocale.hero.title as string}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {pricingLocale.hero.subtitle as string}
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
                        {pricingLocale.options_section.badge as string}
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
                        {pricingLocale.options_section.button as string}
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
              {pricingLocale.how_it_works.title as string}
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {pricingLocale.how_it_works.subtitle as string}
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
                {pricingLocale.comparison.title as string}
              </h2>
            </div>

            <div className="space-y-6">
              {comparisonOptions.map((item) => (
                <Card key={item.number} variant="surface" padding="lg">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-lg mr-4 flex-shrink-0">
                      <span className="text-purple-400 font-bold">{item.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
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
                {pricingLocale.faq.title as string}
              </h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index} variant="surface" padding="lg">
                  <h3 className="text-xl font-bold text-gray-100 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              {pricingLocale.cta.title as string}
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {pricingLocale.cta.subtitle as string}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {pricingLocale.cta.button as string}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
