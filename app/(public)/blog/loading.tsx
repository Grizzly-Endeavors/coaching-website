/**
 * Loading state for the blog listing page
 */
import { BlogCardSkeleton } from '@/components/blog/BlogCard';
import { TagFilterSkeleton } from '@/components/blog/TagFilter';
import { PaginationSkeleton } from '@/components/blog/Pagination';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f0f23] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-12 w-32 bg-[#1a1a2e] rounded mb-4" />
          <div className="h-6 w-full max-w-3xl bg-[#1a1a2e] rounded" />
        </div>

        {/* Tag filter skeleton */}
        <TagFilterSkeleton />

        {/* Blog grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <PaginationSkeleton />
      </div>
    </div>
  );
}