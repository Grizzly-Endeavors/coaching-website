import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for PATCH request body
const updateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens'
  ).optional(),
  content: z.string().optional(),
  excerpt: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/blog/[id]
 *
 * Fetch a single blog post by ID for editing
 *
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Fetch blog post from database
    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/blog/[id]
 *
 * Update a blog post
 *
 * Request body:
 * - title: string (optional)
 * - slug: string (optional)
 * - content: string (optional)
 * - excerpt: string (optional)
 * - tags: string[] (optional)
 * - published: boolean (optional)
 *
 * Requires authentication
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check uniqueness
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: `A post with slug "${validatedData.slug}" already exists`,
          },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string | null;
      tags?: string[];
      published?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }

    if (validatedData.slug !== undefined) {
      updateData.slug = validatedData.slug;
    }

    if (validatedData.content !== undefined) {
      updateData.content = validatedData.content;
    }

    if (validatedData.excerpt !== undefined) {
      updateData.excerpt = validatedData.excerpt || null;
    }

    if (validatedData.tags !== undefined) {
      updateData.tags = validatedData.tags;
    }

    if (validatedData.published !== undefined) {
      updateData.published = validatedData.published;

      // Set publishedAt when publishing for the first time
      if (validatedData.published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }

      // Clear publishedAt when unpublishing
      if (!validatedData.published) {
        updateData.publishedAt = null;
      }
    }

    // Update blog post in database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);

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
          error: 'Invalid request data',
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

/**
 * DELETE /api/admin/blog/[id]
 *
 * Delete a blog post
 *
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    await requireAuth();

    const { id } = params;

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);

    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
