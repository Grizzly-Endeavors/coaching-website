/**
 * BlogCard Component
 * Displays a blog post preview card in the blog listing grid
 */

import Link from 'next/link';
import { BlogPostMetadata } from '@/lib/markdown';

interface BlogCardProps {
  post: BlogPostMetadata & {
    id: string;
  };
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
      <article className="h-full flex flex-col bg-[#1a1a2e] border border-[#2a2a40] rounded-lg overflow-hidden transition-all duration-300 hover:border-[#8b5cf6] hover:shadow-lg hover:shadow-purple-500/20">
        {/* Card Content */}
        <div className="flex-1 p-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-[#e5e7eb] mb-3 line-clamp-2 group-hover:text-[#a78bfa] transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[#9ca3af] text-sm leading-relaxed line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#2a2a40] text-[#a78bfa] border border-[#8b5cf6]/30"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium text-[#6b7280]">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-[#0f0f23] border-t border-[#2a2a40] flex items-center justify-between">
          <time
            dateTime={post.publishedAt}
            className="text-xs text-[#6b7280]"
          >
            {formattedDate}
          </time>

          {post.readingTime && (
            <span className="text-xs text-[#6b7280]">
              {post.readingTime} min read
            </span>
          )}
        </div>

        {/* Hover Effect Border Glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#8b5cf6]/0 via-[#8b5cf6]/10 to-[#8b5cf6]/0" />
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
    <div className="h-full flex flex-col bg-[#1a1a2e] border border-[#2a2a40] rounded-lg overflow-hidden">
      <div className="flex-1 p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-[#2a2a40] rounded animate-pulse" />
        <div className="h-6 bg-[#2a2a40] rounded w-3/4 animate-pulse" />

        {/* Excerpt skeleton */}
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-[#2a2a40] rounded animate-pulse" />
          <div className="h-4 bg-[#2a2a40] rounded animate-pulse" />
          <div className="h-4 bg-[#2a2a40] rounded w-5/6 animate-pulse" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 bg-[#2a2a40] rounded animate-pulse" />
          <div className="h-6 w-20 bg-[#2a2a40] rounded animate-pulse" />
          <div className="h-6 w-14 bg-[#2a2a40] rounded animate-pulse" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="px-6 py-4 bg-[#0f0f23] border-t border-[#2a2a40] flex items-center justify-between">
        <div className="h-4 w-24 bg-[#2a2a40] rounded animate-pulse" />
        <div className="h-4 w-16 bg-[#2a2a40] rounded animate-pulse" />
      </div>
    </div>
  );
}
