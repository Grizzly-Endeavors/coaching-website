'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { logger } from '@/lib/logger';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave(
    formData: {
      title: string;
      slug: string;
      excerpt: string;
      tags: string;
      content: string;
    },
    publish: boolean
  ) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          content: formData.content,
          published: publish,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      alert(`Post ${publish ? 'published' : 'saved as draft'} successfully!`);
      router.push('/admin/blog');
    } catch (error) {
      logger.error('Error saving post:', error instanceof Error ? error : new Error(String(error)));
      const message = error instanceof Error ? error.message : 'Failed to save post';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    router.push('/admin/blog');
  }

  return (
    <BlogPostForm
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}
