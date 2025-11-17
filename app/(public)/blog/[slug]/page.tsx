/**
 * Individual Blog Post Page
 * Displays a single blog post with markdown content rendering
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BlogContent, BlogContentSkeleton } from '@/components/blog/BlogContent';
import { estimateReadingTime } from '@/lib/markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

/**
 * Fetches a single blog post by slug
 */
async function getBlogPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found - Overwatch Coaching',
    };
  }

  return {
    title: `${post.title} - Overwatch Coaching Blog`,
    description: post.excerpt || `Read ${post.title} on our Overwatch coaching blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Overwatch Coach'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
    },
  };
}

/**
 * Generate static paths for all blog posts (optional, for static generation)
 */
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/posts?limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug);

  // Show 404 if post not found
  if (!post) {
    notFound();
  }

  // Calculate reading time
  const readingTime = estimateReadingTime(post.content);

  // Format the published date
  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] border-b border-[#2a2a40]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#8b5cf6] hover:text-[#a78bfa] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e7eb] mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#9ca3af]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Overwatch Coach</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>{publishedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#2a2a40] text-[#a78bfa] border border-[#8b5cf6]/30 hover:border-[#8b5cf6] hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-8 md:p-12">
          <BlogContent content={post.content} />
        </div>
      </article>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2a2a40] rounded-lg p-8 border border-[#8b5cf6]/30 text-center">
          <h2 className="text-2xl font-bold text-[#e5e7eb] mb-3">
            Want to Level Up Your Game?
          </h2>
          <p className="text-[#9ca3af] mb-6 max-w-2xl mx-auto">
            Get personalized Overwatch coaching tailored to your rank and role.
            Book a session or submit a replay code for detailed feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#8b5cf6] text-white font-medium hover:bg-[#a78bfa] transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Book a Coaching Session
            </Link>
            <Link
              href="/booking#replay-submission"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a1a2e] text-[#e5e7eb] font-medium border border-[#2a2a40] hover:border-[#8b5cf6] transition-all"
            >
              Submit Replay Code
            </Link>
          </div>
        </div>

        {/* Related Posts Section - Optional */}
        {/*
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#e5e7eb] mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            // Related posts would go here
          </div>
        </div>
        */}

        {/* Back to Blog (bottom) */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#8b5cf6] hover:text-[#a78bfa] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
