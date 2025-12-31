'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui';
import { useParams } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { logger } from '@/lib/logger';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/blog/${id}`);
      if (!response.ok) throw new Error('Failed to fetch post');

      const fetchedPost: BlogPost = await response.json();
      setPost(fetchedPost);
    } catch (error) {
      logger.error('Error fetching post:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(
    formData: {
      title: string;
      slug: string;
      excerpt: string;
      tags: string;
      content: string;
      published?: boolean;
    },
    publish: boolean
  ) {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
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
        throw new Error(error.error || 'Failed to update post');
      }

      alert('Post updated successfully!');
      router.push('/admin/blog');
    } catch (error) {
      logger.error('Error saving post:', error instanceof Error ? error : new Error(String(error)));
      const message = error instanceof Error ? error.message : 'Failed to save post';
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      alert('Post deleted successfully');
      router.push('/admin/blog');
    } catch (error) {
      logger.error('Error deleting post:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to delete post');
    }
  }

  function handleCancel() {
    router.push('/admin/blog');
  }

  if (loading) {
    return <Loading size="lg" message="Loading post..." />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <BlogPostForm
      mode="edit"
      initialData={post}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
      isSubmitting={saving}
    />
  );
}
