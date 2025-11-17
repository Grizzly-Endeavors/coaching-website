import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Overwatch Coaching',
  description: 'Professional Overwatch coaching services. Learn about your coach - experience, achievements, and coaching philosophy. Helping players improve since 2016.',
};

const achievements = [
  {
    title: 'Peak Rank',
    value: 'Grandmaster',
    description: 'Multiple seasons in top 500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'Students Coached',
    value: '500+',
    description: 'Across all ranks and roles',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Experience',
    value: '8+ Years',
    description: 'Competitive Overwatch',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Success Rate',
    value: '95%',
    description: 'Students see rank improvement',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const expertise = [
  {
    category: 'Tank',
    heroes: ['Reinhardt', 'Winston', 'Zarya', 'D.Va', 'Sigma', 'Orisa', 'Roadhog', 'Wrecking Ball'],
  },
  {
    category: 'DPS',
    heroes: ['Tracer', 'Genji', 'Soldier: 76', 'Widowmaker', 'Cassidy', 'Ashe', 'Echo', 'Sojourn'],
  },
  {
    category: 'Support',
    heroes: ['Ana', 'Mercy', 'Lucio', 'Zenyatta', 'Moira', 'Baptiste', 'Brigitte', 'Kiriko'],
  },
];

const philosophyPoints = [
  {
    title: 'Personalized Approach',
    description: 'Every player is different. I tailor my coaching to your specific playstyle, strengths, and areas for improvement.',
  },
  {
    title: 'Fundamental Focus',
    description: 'While mechanics matter, I emphasize game sense, positioning, and decision-making - skills that transfer across all heroes.',
  },
  {
    title: 'Actionable Feedback',
    description: 'You won\'t just hear what you did wrong - you\'ll get specific, actionable steps to improve that you can apply immediately.',
  },
  {
    title: 'Positive Growth Mindset',
    description: 'Improvement takes time and practice. I create a supportive environment that encourages learning from mistakes.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
              About Your Coach
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Helping players reach their competitive potential through expert guidance and personalized coaching
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Get Coaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Background & Credentials */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Profile Image Placeholder */}
              <div className="order-2 lg:order-1">
                <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-600/30 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg className="w-32 h-32 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-gray-400 text-lg">Coach Photo or<br />Overwatch Profile Screenshot</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-gray-100 mb-6">My Background</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    I've been playing Overwatch competitively since the game's launch in 2016, reaching Grandmaster and top 500 across multiple seasons. What started as a passion for the game evolved into a commitment to help others improve.
                  </p>
                  <p>
                    Over the past several years, I've coached hundreds of players from Bronze to Master, helping them understand the fundamentals that separate good players from great ones. My approach focuses on sustainable improvement rather than quick fixes.
                  </p>
                  <p>
                    I specialize in all three roles (Tank, DPS, Support) and have in-depth knowledge of hero matchups, team compositions, and the ever-evolving meta. Whether you're stuck in a rank or looking to push into the next tier, I can help you get there.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.title} variant="surface" hover className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-lg mx-auto mb-4">
                      <div className="text-purple-400">{achievement.icon}</div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">{achievement.title}</h3>
                    <p className="text-3xl font-bold text-gray-100 mb-1">{achievement.value}</p>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Philosophy */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Coaching Philosophy
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                My approach to helping you improve
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {philosophyPoints.map((point, index) => (
                <Card key={index} variant="surface" padding="lg">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">{point.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Expertise */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Hero Expertise
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Heroes I can coach at a high level
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {expertise.map((role) => (
                <Card key={role.category} variant="surface">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center mb-4">{role.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {role.heroes.map((hero) => (
                        <span
                          key={hero}
                          className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium border border-purple-600/30"
                        >
                          {hero}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Why Choose My Coaching?
              </h2>
            </div>

            <Card variant="surface" padding="lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Proven Track Record</h3>
                    <p className="text-gray-400">
                      Over 500 students coached with a 95% satisfaction rate. My students consistently climb ranks and achieve their competitive goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">High-Level Experience</h3>
                    <p className="text-gray-400">
                      Multiple seasons in Grandmaster and top 500 means I understand what it takes to compete at the highest levels and can break it down for any rank.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Personalized Attention</h3>
                    <p className="text-gray-400">
                      No cookie-cutter advice. Every coaching session is tailored to your unique playstyle, goals, and current skill level.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Fast Turnaround</h3>
                    <p className="text-gray-400">
                      VOD reviews typically delivered within 2-3 days, and live coaching sessions available with flexible scheduling.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Ready to Start Improving?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Let's work together to take your Overwatch skills to the next level. Check out pricing options or get started with coaching today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Coaching
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
