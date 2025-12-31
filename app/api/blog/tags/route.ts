import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

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
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 100 requests per minute per IP
    const rateLimitOptions = {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
      message: 'Too many requests. Please try again later.',
    };

    const rateLimitResult = await rateLimit(request, rateLimitOptions);

    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

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

    // Get rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitOptions);

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
          ...rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    logger.error('Error fetching blog tags:', error instanceof Error ? error : new Error(String(error)));

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
