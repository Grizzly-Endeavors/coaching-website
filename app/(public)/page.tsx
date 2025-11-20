import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Overwatch Coaching',
  description: 'Overwatch coaching focused on sustainable improvement. GM1 across all roles, 4.4k High GM on DPS. Teaching you how to think, not just what to do.',
};

const achievements = [
  {
    title: 'DPS Peak',
    value: '4.4k',
    description: 'High Grandmaster',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: 'All Roles',
    value: 'GM1',
    description: 'Tank, DPS, Support',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Coaching Since',
    value: '2016',
    description: 'Since game launch',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Approach',
    value: 'Holistic',
    description: 'Mindset & mechanics',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
    title: 'Mindset Matters Most',
    description: 'Your mental approach to the game is more important than any mechanical skill. We focus on building sustainable habits and a healthy relationship with improvement.',
  },
  {
    title: 'Quality Over Quantity',
    description: 'Consistent short bursts of focused practice are way more effective than endless hours of aimless grinding. Make the most of your time.',
  },
  {
    title: 'Teaching How to Think',
    description: 'Overwatch is too complex for cookie-cutter advice. I teach you the frameworks to figure out what to do on the fly, not memorize specific plays.',
  },
  {
    title: 'No Quick Fixes',
    description: 'Real improvement requires commitment. You have to show up and do the work day after day - but I\'ll make sure that work actually matters.',
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
              Level Up Your Game
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Sustainable improvement through teaching you how to think, not just what to do
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
                <h2 className="text-4xl font-bold text-gray-100 mb-6">How I Got Here</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    My dad bought us both Overwatch when it first launched. Before then, I hadn't played any shooters - hero or otherwise. But Overwatch was different. I was immediately drawn to the characters and the strategy within the game.
                  </p>
                  <p>
                    I've always had a knack for breaking things down and explaining them. As I started connecting with others and making friends in the days after launch, I found myself naturally helping others understand matchups, how team comps work together, and how to get value with their hero's abilities.
                  </p>
                  <p>
                    I've been coaching in parallel with playing organized Overwatch almost the whole time, and I'm only just now stepping away from the player side. Getting to GM on every role shaped my coaching the most - it taught me the steps for identifying issues and addressing them in a sustainable way.
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
                What Sets Me Apart
              </h2>
            </div>

            <Card variant="surface" padding="lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Playful Roasting Style</h3>
                    <p className="text-gray-400">
                      Sessions feel less like being lectured and more like improving with a friend who keeps it real. Expect some "So... what did you think was gonna happen?" moments. It's just more fun this way.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Pattern Recognition Focus</h3>
                    <p className="text-gray-400">
                      I review replays beforehand to filter out one-off mistakes from the ongoing patterns that are really holding you back. This is what separates external coaching from self-review.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">All Roles at GM Level</h3>
                    <p className="text-gray-400">
                      Reaching GM1 on Tank, DPS, and Support means I understand what actually matters at every level. That high-level play is so fast it forces you to focus on what's important.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="w-6 h-6 text-purple-400 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-gray-100 text-lg mb-2">Still Fun While Pushing Hard</h3>
                    <p className="text-gray-400">
                      At the end of the day, it's still a game. Even when you're trying to push yourself as hard as you can, it's not worth suffering for. Sustainable improvement means keeping the fun in it.
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
              Ready to Be the Best You Can Be?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              If you're engaged and willing to put in the work, I'll go above and beyond to help you get where you're trying to go. Let's get started.
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
