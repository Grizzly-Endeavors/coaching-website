'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { useFormState } from '@/hooks';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  content: string;
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleFieldChange,
  } = useFormState<BlogFormData>({
    initialData: {
      title: '',
      slug: '',
      excerpt: '',
      tags: '',
      content: '',
    },
  });

  // Auto-generate slug from title
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleTitleChange(value: string) {
    handleFieldChange('title', value);
    if (!formData.slug) {
      handleFieldChange('slug', generateSlug(value));
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
      setFormData({
        title: data.title || '',
        slug: data.slug || generateSlug(data.title || ''),
        excerpt: data.excerpt || '',
        tags: data.tags?.join(', ') || '',
        content: data.content || '',
      });

      alert('Markdown file loaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(publish: boolean) {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.slug.trim()) {
      alert('Please enter a slug');
      return;
    }
    if (!formData.content.trim()) {
      alert('Please enter content');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim() || null,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          content: formData.content.trim(),
          published: publish,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      const data = await response.json();
      alert(`Post ${publish ? 'published' : 'saved as draft'} successfully!`);
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(error.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blog" className="text-[#8b5cf6] hover:text-[#a78bfa] text-sm mb-2 inline-block">
          ← Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-bold text-[#e5e7eb] mb-2">Create New Blog Post</h1>
        <p className="text-[#9ca3af]">Upload a markdown file or write your content below</p>
      </div>

      {/* File Upload */}
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
              value={formData.title}
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
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Excerpt</label>
            <textarea
              placeholder="Brief description of the post (optional)"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical min-h-[100px]"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#e5e7eb] mb-2">Tags</label>
            <input
              type="text"
              placeholder="support, guides, tips (comma-separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
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
                    __html: formData.content
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
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="# Your post title&#10;&#10;Your content goes here in markdown format..."
                rows={20}
                className="w-full px-4 py-3 bg-[#0f0f23] border border-[#2a2a40] rounded-lg text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent transition-all resize-vertical font-mono text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        <Link href="/admin/blog">
          <Button variant="secondary" disabled={isSubmitting} className="bg-transparent hover:bg-[#2a2a40]">
            Cancel
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </div>
    </div>
  );
}
