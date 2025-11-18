'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Loading } from '@/components/ui';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  content: string;
  published: boolean;
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  async function fetchPost() {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/blog/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch post');

      const post: BlogPost = await response.json();
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || '');
      setTags(post.tags.join(', '));
      setContent(post.content);
      setPublished(post.published);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(publishStatus?: boolean) {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!slug.trim()) {
      alert('Please enter a slug');
      return;
    }
    if (!content.trim()) {
      alert('Please enter content');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim() || null,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          content: content.trim(),
          published: publishStatus !== undefined ? publishStatus : published,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update post');
      }

      alert('Post updated successfully!');
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(error.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      alert('Post deleted successfully');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }

  if (loading) {
    return <Loading size="lg" message="Loading post..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blog" className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mb-2 inline-block">
          ← Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Edit Blog Post</h1>
        <p className="text-[#9ca3af]">Update your blog post content and settings</p>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 mb-6">
        <div className="space-y-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="post-url-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Excerpt</label>
            <textarea
              placeholder="Brief description of the post (optional)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical min-h-[100px]"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Tags</label>
            <input
              type="text"
              placeholder="support, guides, tips (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[#e5e7eb]">Content (Markdown)</label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm font-medium transition-colors"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {showPreview ? (
              <div className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a40] rounded-lg text-[#e5e7eb] min-h-[400px] prose prose-invert prose-purple max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: content
                      .split('\n')
                      .map((line) => {
                        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
                        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
                        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
                        if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
                        if (line.trim() === '') return '<br/>';
                        return `<p>${line}</p>`;
                      })
                      .join(''),
                  }}
                />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Your post title&#10;&#10;Your content goes here in markdown format..."
                rows={20}
                className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical font-mono text-sm"
              />
            )}
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-[#2a2a40]">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 bg-[#0f0f23] border-[#2a2a40] rounded text-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-0"
            />
            <label htmlFor="published" className="text-sm text-[#e5e7eb] cursor-pointer">
              Published
            </label>
            <span className="text-xs text-[#6b7280]">
              ({published ? 'Visible to public' : 'Hidden from public'})
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        <Button
          variant="secondary"
          onClick={handleDelete}
          disabled={saving}
          className="bg-[#ef4444] text-white hover:bg-[#dc2626] border-0"
        >
          Delete Post
        </Button>
        <div className="flex items-center space-x-3">
          <Link href="/admin/blog">
            <Button variant="secondary" disabled={saving} className="bg-transparent hover:bg-[#2a2a40]">
              Cancel
            </Button>
          </Link>
          {!published && (
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? 'Saving...' : published ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
