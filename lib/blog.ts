/**
 * Blog-related database operations
 *
 * This module contains functions for fetching blog data directly from the database
 * for use in server components during static generation.
 */

import { Prisma } from '@prisma/client';
import { prisma } from './prisma';
import type { BlogPostSummary } from './types/blog.types';

export interface BlogPostsResponse {
  posts: BlogPostSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get published blog posts with pagination and filtering
 */
export async function getBlogPosts(
  page: number = 1,
  limit: number = 12,
  tag?: string
): Promise<BlogPostsResponse> {
  // Build query conditions
  const whereConditions: Prisma.BlogPostWhereInput = {
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

  return {
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
  };
}

/**
 * Get all unique tags from published blog posts
 */
export async function getBlogTags(): Promise<string[]> {
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

  return Array.from(tagsSet).sort();
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  // Sanitize slug to prevent injection attacks
  const sanitizedSlug = slug.trim().toLowerCase();

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

  // Check if post exists and is published
  if (!post || !post.published) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    tags: post.tags,
    publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}