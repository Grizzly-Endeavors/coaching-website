import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { blogPostQuerySchema } from '@/lib/validations';
import { ZodError } from 'zod';

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
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
      tag: searchParams.get('tag') || undefined,
    };

    // Validate query parameters with Zod
    const { page, limit, tag } = blogPostQuerySchema.parse(queryParams);

    // TODO: Add rate limiting
    // Consider caching this endpoint with Redis or Next.js cache
    // as blog posts are relatively static content

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
        },
      }
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      // Check for database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Unable to fetch blog posts. Please try again later.',
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
      },
      { status: 500 }
    );
  }
}
