/**
 * Loading state for the blog post page
 */
import { BlogContentSkeleton } from '@/components/blog/BlogContent';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23] border-b border-[#2a2a40]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          <div className="h-6 w-32 bg-[#1a1a2e] rounded mb-8" />
          <div className="h-12 bg-[#1a1a2e] rounded mb-4" />
          <div className="h-12 w-3/4 bg-[#1a1a2e] rounded mb-6" />
          <div className="flex gap-6 mb-6">
            <div className="h-5 w-32 bg-[#1a1a2e] rounded" />
            <div className="h-5 w-32 bg-[#1a1a2e] rounded" />
            <div className="h-5 w-24 bg-[#1a1a2e] rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-[#1a1a2e] rounded" />
            <div className="h-7 w-24 bg-[#1a1a2e] rounded" />
            <div className="h-7 w-16 bg-[#1a1a2e] rounded" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-8 md:p-12">
          <BlogContentSkeleton />
        </div>
      </article>
    </div>
  );
}