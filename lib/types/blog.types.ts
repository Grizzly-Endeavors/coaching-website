/**
 * Type definitions for blog posts
 * Based on Prisma model: BlogPost
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/**
 * Blog post summary for listing pages
 * Subset of BlogPost without full content
 */
export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  publishedAt: string;
  readingTime?: number;
}
