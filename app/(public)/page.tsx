import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import type { Metadata } from 'next';
import { loadLocale } from '@/lib/locales';

const homeLocale = loadLocale('home');
const metadataLocale = loadLocale('metadata');

export const metadata: Metadata = {
  title: metadataLocale.home.title as string,
  description: metadataLocale.home.description as string,
};

const iconComponents = {
  star: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  lightbulb: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

const achievements = (homeLocale.background.achievements as Array<{ title: string; value: string; description: string }>).map((achievement, index) => ({
  ...achievement,
  icon: Object.values(iconComponents)[index],
}));

const testimonials = homeLocale.testimonials.items as Array<{
  name: string;
  role: string;
  rank: string;
  quote: string;
}>;

const philosophyPoints = homeLocale.philosophy.points as Array<{ title: string; description: string }>;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background-primary via-background-surface to-background-primary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              {homeLocale.hero.title as string}
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              {homeLocale.hero.subtitle as string}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  {homeLocale.hero.buttons.view_pricing as string}
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {homeLocale.hero.buttons.get_coaching as string}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Background & Credentials */}
      <section className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Profile Image Placeholder */}
              <div className="order-2 lg:order-1">
                <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-brand-800/20 rounded-2xl border border-brand-primary/30 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-32 h-32 text-brand-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-text-muted text-lg">{homeLocale.background.image_placeholder.line1 as string}<br />{homeLocale.background.image_placeholder.line2 as string}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-text-primary mb-6">{homeLocale.background.section_title as string}</h2>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    {homeLocale.background.bio.paragraph_1 as string}
                  </p>
                  <p>
                    {homeLocale.background.bio.paragraph_2 as string}
                  </p>
                  <p>
                    {homeLocale.background.bio.paragraph_3 as string}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.title} variant="surface" hover className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-brand-primary/20 rounded-lg mx-auto mb-4">
                      <div className="text-brand-primary">{achievement.icon}</div>
                    </div>
                    <h3 className="text-sm font-semibold text-text-muted mb-2">{achievement.title}</h3>
                    <p className="text-3xl font-bold text-text-primary mb-1">{achievement.value}</p>
                    <p className="text-sm text-text-muted">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Philosophy */}
      <section className="py-20 bg-background-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {homeLocale.philosophy.section_title as string}
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                {homeLocale.philosophy.section_subtitle as string}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {philosophyPoints.map((point, index) => (
                <Card key={index} variant="surface" padding="lg">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 bg-brand-primary text-white rounded-full text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">{point.title}</h3>
                      <p className="text-text-muted leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {homeLocale.testimonials.section_title as string}
              </h2>
              <p className="text-lg text-text-muted max-w-2xl mx-auto">
                {homeLocale.testimonials.section_subtitle as string}
              </p>
            </div>

            <TestimonialsCarousel items={testimonials} />
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-20 bg-background-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {homeLocale.differentiators.section_title as string}
              </h2>
            </div>

            <Card variant="surface" padding="lg">
              <div className="space-y-6">
                {(homeLocale.differentiators.points as Array<{ title: string; description: string }>).map((point, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-brand-primary mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-text-primary text-lg mb-2">{point.title}</h3>
                      <p className="text-text-muted">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background-primary to-background-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {homeLocale.cta.title as string}
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              {homeLocale.cta.description as string}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  {homeLocale.cta.buttons.get_coaching as string}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  {homeLocale.cta.buttons.contact_me as string}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
