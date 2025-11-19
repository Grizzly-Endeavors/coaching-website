'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import type { BlogPost } from '@/lib/types';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  content: string;
  published?: boolean;
}

interface BlogPostFormProps {
  mode: 'create' | 'edit';
  initialData?: BlogPost;
  onSave: (data: BlogFormData, publish: boolean) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
}

export default function BlogPostForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onDelete,
  isSubmitting,
}: BlogPostFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published || false);

  // Auto-generate slug from title (only for create mode)
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    // Only auto-generate slug in create mode when slug is empty
    if (mode === 'create' && !slug) {
      setSlug(generateSlug(value));
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('Please upload a markdown (.md) file');
      return;
    }

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Failed to upload file');

      const data = await response.json();

      // Pre-fill form with parsed data
      setTitle(data.title || '');
      setSlug(data.slug || generateSlug(data.title || ''));
      setExcerpt(data.excerpt || '');
      setTags(data.tags?.join(', ') || '');
      setContent(data.content || '');

      alert('Markdown file loaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(publish: boolean) {
    // Validation
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

    // Prepare data
    const formData: BlogFormData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || '',
      tags: tags.trim(),
      content: content.trim(),
    };

    if (mode === 'edit') {
      formData.published = publish;
    }

    await onSave(formData, publish);
  }

  function renderMarkdownPreview(text: string) {
    return text
      .split('\n')
      .map((line) => {
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
        if (line.trim() === '') return '<br/>';
        return `<p>${line}</p>`;
      })
      .join('');
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blog" className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mb-2 inline-block">
          ← Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h1>
        <p className="text-[#9ca3af]">
          {mode === 'create'
            ? 'Upload a markdown file or write your content below'
            : 'Update your blog post content and settings'}
        </p>
      </div>

      {/* File Upload (only for create mode) */}
      {mode === 'create' && (
        <div className="bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-[#e5e7eb] mb-4">Upload Markdown File</h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".md"
              onChange={handleFileUpload}
              disabled={uploading}
              className="block w-full text-sm text-[#9ca3af]
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-[#8b5cf6] file:text-white
                file:cursor-pointer file:transition-all
                hover:file:bg-[#a78bfa]
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && <span className="text-[#9ca3af] text-sm">Uploading...</span>}
          </div>
          <p className="text-[#6b7280] text-xs mt-2">
            Upload a .md file with frontmatter (title, excerpt, tags) to auto-populate the form
          </p>
        </div>
      )}

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
              onChange={(e) => handleTitleChange(e.target.value)}
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
                    __html: renderMarkdownPreview(content),
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

          {/* Published checkbox (only for edit mode) */}
          {mode === 'edit' && (
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
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        {mode === 'edit' && onDelete ? (
          <Button
            variant="secondary"
            onClick={onDelete}
            disabled={isSubmitting}
            className="bg-[#ef4444] text-white hover:bg-[#dc2626] border-0"
          >
            Delete Post
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-transparent hover:bg-[#2a2a40]"
          >
            Cancel
          </Button>
        )}
        <div className="flex items-center space-x-3">
          {mode === 'edit' && (
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-transparent hover:bg-[#2a2a40]"
            >
              Cancel
            </Button>
          )}
          {(mode === 'create' || !published) && (
            <Button
              variant="secondary"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === 'create'
                ? 'Publishing...'
                : 'Saving...'
              : mode === 'edit' && published
              ? 'Update Post'
              : 'Publish Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
