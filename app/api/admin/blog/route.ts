import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Query parameters validation schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  published: z.enum(['true', 'false', 'all']).optional().default('all'),
  sort: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * GET /api/admin/blog
 *
 * Fetch all blog posts (including drafts) with pagination and filters
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Posts per page (default: 20, max: 100)
 * - published: Filter by published status ('true', 'false', 'all') - default: 'all'
 * - sort: Sort field (createdAt, updatedAt, publishedAt, title) - default: createdAt
 * - order: Sort order (asc, desc) - default: desc
 *
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      published: searchParams.get('published') || undefined,
      sort: searchParams.get('sort') || undefined,
      order: searchParams.get('order') || undefined,
    };

    const validatedParams = querySchema.parse(queryParams);

    // Build query filter
    const where: { published?: boolean } = {};
    if (validatedParams.published !== 'all') {
      where.published = validatedParams.published === 'true';
    }

    // Calculate pagination
    const skip = (validatedParams.page - 1) * validatedParams.limit;
    const take = validatedParams.limit;

    // Get total count for pagination
    const totalCount = await prisma.blogPost.count({ where });

    // Fetch posts from database
    const posts = await prisma.blogPost.findMany({
      where,
      skip,
      take,
      orderBy: {
        [validatedParams.sort]: validatedParams.order,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        // Don't include full content in list view for performance
        // content: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    const hasNextPage = validatedParams.page < totalPages;
    const hasPrevPage = validatedParams.page > 1;

    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    logger.error('Error fetching blog posts', error instanceof Error ? error : new Error(String(error)));

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
