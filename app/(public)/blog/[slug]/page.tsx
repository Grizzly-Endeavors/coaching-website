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
import { logger } from '@/lib/logger';
import type { BlogPostSummary } from '@/lib/types/blog.types';
import { loadLocale, interpolate } from '@/lib/locales';

const blogLocale = loadLocale('blog');
const metadataLocale = loadLocale('metadata');

// Force dynamic rendering since this page needs database access
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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
    logger.error('Error fetching blog post:', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: metadataLocale.blog.not_found.title as string,
    };
  }

  return {
    title: interpolate(metadataLocale.blog.post.title as string, { title: post.title }),
    description: post.excerpt || interpolate(metadataLocale.blog.post.default_description as string, { title: post.title }),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: metadataLocale.blog.post.og_type as 'article',
      publishedTime: post.publishedAt,
      authors: [metadataLocale.blog.post.og_authors as string],
      tags: post.tags,
    },
    twitter: {
      card: metadataLocale.blog.post.twitter_card as 'summary_large_image',
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
    return data.posts.map((post: BlogPostSummary) => ({
      slug: post.slug,
    }));
  } catch (error) {
    logger.error('Error generating static params:', error instanceof Error ? error : new Error(String(error)));
    return [];
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
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
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{blogLocale.post.back_to_blog as string}</span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e7eb] mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#9ca3af]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blogLocale.post.author as string}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>{publishedDate}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{interpolate(blogLocale.post.reading_time as string, { minutes: readingTime })}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-[#2a2a40] text-brand-hover border border-brand-primary/30 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
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
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2a2a40] rounded-lg p-8 border border-brand-primary/30 text-center">
          <h2 className="text-2xl font-bold text-[#e5e7eb] mb-3">
            {blogLocale.post.cta.title as string}
          </h2>
          <p className="text-[#9ca3af] mb-6 max-w-2xl mx-auto">
            {blogLocale.post.cta.description as string}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-primary text-white font-medium hover:bg-brand-hover transition-all shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50"
            >
              {blogLocale.post.cta.buttons.book_session as string}
            </Link>
            <Link
              href="/booking#replay-submission"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a1a2e] text-[#e5e7eb] font-medium border border-[#2a2a40] hover:border-brand-primary transition-all"
            >
              {blogLocale.post.cta.buttons.submit_replay as string}
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
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-hover transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{blogLocale.post.back_to_all_posts as string}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
