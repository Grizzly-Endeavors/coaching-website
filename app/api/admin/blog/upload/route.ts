import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import matter from 'gray-matter';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for frontmatter
const frontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens'
  ),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().optional().or(z.string().length(0)),
});

/**
 * POST /api/admin/blog/upload
 *
 * Upload a markdown file and create a blog post
 *
 * Process:
 * 1. Parse frontmatter with gray-matter
 * 2. Validate required fields (title, slug)
 * 3. Check slug uniqueness
 * 4. Create BlogPost in database
 * 5. Return 201 with post ID
 *
 * Request: multipart/form-data with .md file
 *
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { success: false, error: 'Only .md files are allowed' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Parse frontmatter and content
    let parsedFile;
    try {
      parsedFile = matter(fileContent);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse markdown file' },
        { status: 400 }
      );
    }

    // Validate frontmatter
    const frontmatter = frontmatterSchema.parse(parsedFile.data);
    const content = parsedFile.content.trim();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'File content is empty' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: frontmatter.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: `A post with slug "${frontmatter.slug}" already exists`,
        },
        { status: 409 }
      );
    }

    // Prepare post data
    const postData: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      tags: string[];
      published: boolean;
      publishedAt?: Date;
    } = {
      title: frontmatter.title,
      slug: frontmatter.slug,
      content,
      tags: frontmatter.tags,
      published: frontmatter.published,
    };

    // Set excerpt if provided
    if (frontmatter.excerpt) {
      postData.excerpt = frontmatter.excerpt;
    } else {
      // Generate excerpt from first 200 characters of content
      const plainText = content.replace(/[#*`[\]()]/g, '').trim();
      postData.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
    }

    // Set publishedAt if provided and published is true
    if (frontmatter.published && frontmatter.publishedAt) {
      postData.publishedAt = new Date(frontmatter.publishedAt);
    } else if (frontmatter.published) {
      postData.publishedAt = new Date();
    }

    // Create blog post in database
    const newPost = await prisma.blogPost.create({
      data: postData,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        tags: true,
        published: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Blog post created successfully',
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading blog post:', error);

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
          error: 'Invalid frontmatter or file structure',
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
