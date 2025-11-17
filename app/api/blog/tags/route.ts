import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/tags
 * Get all unique tags from published blog posts
 *
 * Response: 200 OK
 * {
 *   tags: string[]
 * }
 */
export async function GET() {
  try {
    // TODO: Add rate limiting
    // TODO: Add caching layer (Redis or Next.js cache)
    // Tags are relatively static and can be cached for improved performance

    // Fetch all published blog posts with their tags
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        tags: true,
      },
    });

    // Extract unique tags from all posts
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagsSet.add(tag);
      });
    });

    // Convert Set to sorted array
    const tags = Array.from(tagsSet).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    // Return response
    return NextResponse.json(
      {
        tags,
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes with stale-while-revalidate
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching blog tags:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      // Check for database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Unable to fetch tags. Please try again later.',
            tags: [],
          },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
        tags: [],
      },
      { status: 500 }
    );
  }
}
