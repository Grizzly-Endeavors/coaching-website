import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Overwatch Coaching',
  description: 'Professional Overwatch coaching services to help you climb the ranks. Get personalized VOD reviews, one-on-one coaching, and expert guidance.',
};

// Fetch recent blog posts (server component)
async function getRecentPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/posts?limit=3`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0f0f23] via-[#1a1a2e] to-[#0f0f23] py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 mb-6 animate-fade-in">
              Level Up Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                Overwatch Skills
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Professional coaching services to help you climb the ranks faster. Get personalized VOD reviews, expert strategies, and proven improvement methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button variant="primary" size="lg" className="w-full sm:w-auto animate-pulse-glow">
                  Book a Session
                </Button>
              </Link>
              <Link href="/booking">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Submit Replay Code
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Coaching Services
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Choose the coaching package that best fits your needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* VOD Review */}
            <Card hover variant="surface">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle>VOD Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Submit your replay code and get a detailed video breakdown of your gameplay with actionable improvement tips.
                </p>
                <ul className="space-y-2 text-sm text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    In-depth analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Timestamped feedback
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    2-3 day turnaround
                  </li>
                </ul>
                <Link href="/services">
                  <Button variant="ghost" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 1-on-1 Coaching */}
            <Card hover variant="surface">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle>1-on-1 Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Live coaching sessions tailored to your playstyle, role, and rank with real-time feedback and guidance.
                </p>
                <ul className="space-y-2 text-sm text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    60-minute sessions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Live gameplay analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Personalized strategies
                  </li>
                </ul>
                <Link href="/services">
                  <Button variant="ghost" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Role-Specific Training */}
            <Card hover variant="surface" className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600/20 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle>Role-Specific Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Specialized coaching for Tank, DPS, or Support with role-specific tips, positioning, and game sense training.
                </p>
                <ul className="space-y-2 text-sm text-gray-400 mb-6">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Tank / DPS / Support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Meta knowledge
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced tactics
                  </li>
                </ul>
                <Link href="/services">
                  <Button variant="ghost" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="secondary" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
              Proven Results
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Join hundreds of players who have improved their rank and gameplay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonial Placeholders */}
            <Card variant="surface" padding="lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  A
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-100">Player Name</p>
                  <p className="text-sm text-gray-400">Diamond → Master</p>
                </div>
              </div>
              <p className="text-gray-400 italic">
                "The VOD reviews helped me identify bad habits I didn't even know I had. Climbed from Diamond to Master in just 2 weeks!"
              </p>
            </Card>

            <Card variant="surface" padding="lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  B
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-100">Player Name</p>
                  <p className="text-sm text-gray-400">Platinum → Diamond</p>
                </div>
              </div>
              <p className="text-gray-400 italic">
                "Excellent coaching! The personalized strategies for my role made a huge difference in my gameplay."
              </p>
            </Card>

            <Card variant="surface" padding="lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                  C
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-100">Player Name</p>
                  <p className="text-sm text-gray-400">Gold → Platinum</p>
                </div>
              </div>
              <p className="text-gray-400 italic">
                "Great turnaround time and detailed feedback. Finally understanding positioning and when to engage!"
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-[#0f0f23]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
                  About Your Coach
                </h2>
                <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                  With years of experience in Overwatch and multiple seasons in high ranks, I've helped hundreds of players reach their competitive goals.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-100">Grandmaster Peak</p>
                      <p className="text-gray-400">Multiple seasons in top 500</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-100">500+ Students Coached</p>
                      <p className="text-gray-400">Proven track record of improvement</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-100">All Roles Experience</p>
                      <p className="text-gray-400">Tank, DPS, and Support expertise</p>
                    </div>
                  </li>
                </ul>
                <Link href="/about">
                  <Button variant="secondary" size="lg">
                    Learn More About Me
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-2xl border border-purple-600/30 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-gray-400">Coach Photo / Profile Screenshot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-[#1a1a2e]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
                Latest Guides & Tips
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Stay updated with the latest strategies, meta analysis, and improvement tips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recentPosts.map((post: any) => (
                <Card key={post.id} hover variant="surface">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <CardTitle>
                      <Link href={`/blog/${post.slug}`} className="hover:text-purple-400 transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="secondary" size="lg">
                  View All Posts
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Ready to Rank Up?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join hundreds of players who have improved their gameplay with professional coaching. Book your session today or submit a replay code for review.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/booking">
                <Button variant="primary" size="lg" className="w-full sm:w-auto animate-pulse-glow">
                  Get Started Now
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
