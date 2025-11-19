/**
 * Blog Listing Page
 * Displays a paginated grid of blog posts with tag filtering
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogCard, BlogCardSkeleton } from '@/components/blog/BlogCard';
import { TagFilter, TagFilterSkeleton } from '@/components/blog/TagFilter';
import { Pagination, PaginationSkeleton } from '@/components/blog/Pagination';

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
  }>;
}

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Blog - Overwatch Coaching',
  description: 'Tips, strategies, and guides to improve your Overwatch gameplay. Learn from expert coaching insights on heroes, positioning, and game sense.',
  openGraph: {
    title: 'Blog - Overwatch Coaching',
    description: 'Tips, strategies, and guides to improve your Overwatch gameplay.',
    type: 'website',
  },
};

/**
 * Fetches blog posts from API with pagination and filtering
 */
async function getBlogPosts(page: number = 1, tag?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '12',
      ...(tag && { tag }),
    });

    const response = await fetch(`${baseUrl}/api/blog/posts?${params}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

/**
 * Fetches all unique tags from published blog posts
 */
async function getAllTags() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/blog/tags`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page, tag } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const currentTag = tag;
  // Fetch blog posts and tags in parallel
  const [{ posts, pagination }, allTags] = await Promise.all([
    getBlogPosts(currentPage, currentTag),
    getAllTags(),
  ]);

  return (
    <div className="min-h-screen bg-[#0f0f23] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e7eb] mb-4 tracking-tight">
            Blog
          </h1>
          <p className="text-lg text-[#9ca3af] max-w-3xl">
            Expert Overwatch coaching insights, strategies, and tips to help you climb the ranks.
            Learn from detailed guides on heroes, positioning, game sense, and more.
          </p>
        </div>

        {/* Tag Filter */}
        <Suspense fallback={<TagFilterSkeleton />}>
          {allTags.length > 0 && (
            <TagFilter tags={allTags} currentTag={currentTag} />
          )}
        </Suspense>

        {/* Blog Post Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1a1a2e] mb-4">
              <svg
                className="w-8 h-8 text-[#6b7280]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#e5e7eb] mb-2">
              {currentTag ? 'No posts found with this tag' : 'No blog posts yet'}
            </h2>
            <p className="text-[#9ca3af] mb-6">
              {currentTag
                ? 'Try selecting a different tag or clearing the filter.'
                : 'Check back soon for expert Overwatch coaching content.'}
            </p>
            {currentTag && (
              <a
                href="/blog"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-[#8b5cf6] text-white font-medium hover:bg-[#a78bfa] transition-colors shadow-lg shadow-purple-500/30"
              >
                Clear filter
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <Suspense fallback={<PaginationSkeleton />}>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </Suspense>
          </>
        )}

        {/* Call to Action */}
        {posts.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2a2a40] rounded-lg p-8 border border-[#8b5cf6]/30">
              <h2 className="text-2xl font-bold text-[#e5e7eb] mb-3">
                Ready to Improve Your Game?
              </h2>
              <p className="text-[#9ca3af] mb-6 max-w-2xl mx-auto">
                Get personalized coaching and detailed VOD reviews to take your Overwatch skills to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/booking"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#8b5cf6] text-white font-medium hover:bg-[#a78bfa] transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  Book a Session
                </a>
                <a
                  href="/booking#replay-submission"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a1a2e] text-[#e5e7eb] font-medium border border-[#2a2a40] hover:border-[#8b5cf6] transition-all"
                >
                  Submit Replay Code
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
