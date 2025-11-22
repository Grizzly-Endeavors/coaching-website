/**
 * BlogCard Component
 * Displays a blog post preview card in the blog listing grid
 */

import Link from 'next/link';
import type { BlogPostSummary } from '@/lib/types';

interface BlogCardProps {
  post: BlogPostSummary;
}

export function BlogCard({ post }: BlogCardProps) {
  // Format the date for display
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full"
    >
      <article className="h-full flex flex-col bg-background-surface border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-500/20">
        {/* Card Content */}
        <div className="flex-1 p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-brand-hover transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-background-elevated text-brand-hover border border-brand-primary/30"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-text-muted">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-background-primary border-t border-border flex items-center justify-between">
          <time
            dateTime={post.publishedAt}
            className="text-xs text-text-muted"
          >
            {formattedDate}
          </time>

          {post.readingTime && (
            <span className="text-xs text-text-muted">
              {post.readingTime} min read
            </span>
          )}
        </div>

        {/* Hover Effect Border Glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand-primary/0 via-brand-primary/10 to-brand-primary/0" />
        </div>
      </article>
    </Link>
  );
}

/**
 * BlogCardSkeleton Component
 * Loading state placeholder for blog cards
 */
export function BlogCardSkeleton() {
  return (
    <div className="h-full flex flex-col bg-background-surface border border-border rounded-lg overflow-hidden">
      <div className="flex-1 p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-background-elevated rounded animate-pulse" />
        <div className="h-6 bg-background-elevated rounded w-3/4 animate-pulse" />

        {/* Excerpt skeleton */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-background-elevated rounded animate-pulse" />
          <div className="h-4 bg-background-elevated rounded animate-pulse" />
          <div className="h-4 bg-background-elevated rounded w-5/6 animate-pulse" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-background-elevated rounded animate-pulse" />
          <div className="h-6 w-20 bg-background-elevated rounded animate-pulse" />
          <div className="h-6 w-14 bg-background-elevated rounded animate-pulse" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="px-6 py-4 bg-background-primary border-t border-border flex items-center justify-between">
        <div className="h-4 w-24 bg-background-elevated rounded animate-pulse" />
        <div className="h-4 w-16 bg-background-elevated rounded animate-pulse" />
      </div>
    </div>
  );
}
