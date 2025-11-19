'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AdminTable,
  AdminTableRow,
  AdminTableCell,
} from '@/components/admin';
import { Button, Badge, Loading } from '@/components/ui';
import type { BlogPost } from '@/lib/types';
import { logger } from '@/lib/logger';

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      logger.error('Error fetching posts:', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      alert('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      logger.error('Error deleting post:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to delete post');
    }
  }

  async function togglePublished(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      alert(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchPosts();
    } catch (error) {
      logger.error('Error updating post:', error instanceof Error ? error : new Error(String(error)));
      alert('Failed to update post');
    }
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === 'published') return post.published;
    if (filter === 'draft') return !post.published;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-[#e5e7eb]">Blog Posts</h1>
          <Link href="/admin/blog/new">
            <Button variant="primary">
              <span className="flex items-center space-x-2">
                <span>+</span>
                <span>Create New Post</span>
              </span>
            </Button>
          </Link>
        </div>
        <p className="text-[#9ca3af]">Manage your blog posts and content</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#8b5cf6] text-white'
              : 'bg-[#2a2a40] text-[#9ca3af] hover:text-[#e5e7eb]'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'published'
              ? 'bg-[#8b5cf6] text-white'
              : 'bg-[#2a2a40] text-[#9ca3af] hover:text-[#e5e7eb]'
          }`}
        >
          Published ({posts.filter((p) => p.published).length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'draft'
              ? 'bg-[#8b5cf6] text-white'
              : 'bg-[#2a2a40] text-[#9ca3af] hover:text-[#e5e7eb]'
          }`}
        >
          Drafts ({posts.filter((p) => !p.published).length})
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        {loading ? (
          <Loading size="lg" message="Loading blog posts..." />
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9ca3af] text-lg mb-2">No posts found</p>
            <p className="text-[#6b7280] text-sm mb-4">
              {filter === 'all'
                ? 'Create your first blog post to get started'
                : `No ${filter} posts yet`}
            </p>
            {filter === 'all' && (
              <Link href="/admin/blog/new">
                <Button variant="primary">Create Your First Post</Button>
              </Link>
            )}
          </div>
        ) : (
          <AdminTable headers={['Title', 'Status', 'Tags', 'Published Date', 'Last Updated', 'Actions']}>
            {filteredPosts.map((post) => (
              <AdminTableRow key={post.id}>
                <AdminTableCell>
                  <div className="max-w-[300px]">
                    <div className="font-medium text-[#e5e7eb] truncate">{post.title}</div>
                    <div className="text-xs text-[#6b7280] truncate">/{post.slug}</div>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={post.published ? 'completed' : 'pending'}>
                    {post.published ? 'Published' : 'Draft'}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-[#2a2a40] text-[#9ca3af] rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-[#6b7280]">+{post.tags.length - 3}</span>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-'}
                </AdminTableCell>
                <AdminTableCell>
                  {new Date(post.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/admin/blog/edit/${post.id}`}
                      className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => togglePublished(post.id, post.published)}
                      className="text-[#10b981] hover:text-[#34d399] font-medium text-sm transition-colors"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-[#ef4444] hover:text-[#f87171] font-medium text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </div>
    </div>
  );
}
