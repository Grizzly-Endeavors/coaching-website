import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Revalidate the sitemap every hour to pick up new blog posts
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.DOMAIN_NAME || 'http://localhost:3000';

  // Fetch all published blog posts
  // Handle database connection gracefully during build time
  let blogUrls: MetadataRoute.Sitemap = [];

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    // During build time, database may not be available
    // Log the error but continue with static pages only
    console.warn('Database not available for sitemap generation, skipping blog posts');
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...blogUrls,
  ];
}
