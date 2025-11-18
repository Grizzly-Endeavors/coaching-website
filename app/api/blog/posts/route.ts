import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogPostQuerySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/api-error-handler';
import { rateLimit, getRateLimitHeaders } from '@/lib/rate-limiter';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/posts
 * Get published blog posts with pagination and filtering
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 12, max: 100)
 * - tag: string (optional filter by tag)
 *
 * Response: 200 OK
 * {
 *   posts: [
 *     {
 *       id: string,
 *       title: string,
 *       slug: string,
 *       excerpt: string | null,
 *       tags: string[],
 *       publishedAt: string
 *     }
 *   ],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     total: number,
 *     totalPages: number
 *   }
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
      tag: searchParams.get('tag') || undefined,
    };

    // Validate query parameters with Zod
    const { page, limit, tag } = blogPostQuerySchema.parse(queryParams);

    // Build query conditions
    const whereConditions: any = {
      published: true,
    };

    // Filter by tag if provided
    if (tag) {
      whereConditions.tags = {
        has: tag,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute database queries in parallel for better performance
    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: whereConditions,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          tags: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({
        where: whereConditions,
      }),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Get rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, rateLimitOptions);

    // Return response
    return NextResponse.json(
      {
        posts: posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          tags: post.tags,
          publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        })),
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          ...rateLimitHeaders,
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
