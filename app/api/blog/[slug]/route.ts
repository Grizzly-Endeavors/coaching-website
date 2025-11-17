import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/blog/[slug]
 * Get a single blog post by slug
 *
 * Path params:
 * - slug: string
 *
 * Response: 200 OK
 * {
 *   id: string,
 *   title: string,
 *   slug: string,
 *   content: string,
 *   excerpt: string | null,
 *   tags: string[],
 *   publishedAt: string,
 *   createdAt: string,
 *   updatedAt: string
 * }
 *
 * Response: 404 Not Found
 * {
 *   success: false,
 *   error: "Post not found",
 *   message: "The requested blog post does not exist or is not published."
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid slug',
          message: 'A valid slug parameter is required.',
        },
        { status: 400 }
      );
    }

    // Sanitize slug to prevent injection attacks
    const sanitizedSlug = slug.trim().toLowerCase();

    // TODO: Add rate limiting
    // TODO: Add caching layer (Redis or Next.js cache)
    // Blog posts are mostly static and can be cached for improved performance

    // Fetch blog post from database
    const post = await prisma.blogPost.findUnique({
      where: {
        slug: sanitizedSlug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        tags: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Check if post exists
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          message: 'The requested blog post does not exist.',
        },
        { status: 404 }
      );
    }

    // Check if post is published (only return published posts to public)
    if (!post.published) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
          message: 'The requested blog post is not available.',
        },
        { status: 404 }
      );
    }

    // Return post data
    return NextResponse.json(
      {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        tags: post.tags,
        publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
      {
        status: 200,
        headers: {
          // Cache for 5 minutes with stale-while-revalidate for better performance
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);

    // Handle Prisma errors
    if (error instanceof Error) {
      // Check for database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Database error',
            message: 'Unable to fetch blog post. Please try again later.',
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
