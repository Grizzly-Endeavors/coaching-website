'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminButton, AdminInput, AdminTextarea } from '@/components/admin';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  // Auto-generate slug from title
  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug) {
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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: formData,
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

  async function handleSave(publish: boolean) {
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
      const response = await fetch('/api/admin/blog/posts', {
        method: 'POST',
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
      setSaving(false);
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
          <AdminInput
            label="Title"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          <AdminInput
            label="Slug"
            placeholder="post-url-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <AdminTextarea
            label="Excerpt"
            placeholder="Brief description of the post (optional)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />

          <AdminInput
            label="Tags"
            placeholder="support, guides, tips (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

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
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-[#1a1a2e] border border-[#2a2a40] rounded-lg p-6">
        <Link href="/admin/blog">
          <AdminButton variant="ghost" disabled={saving}>
            Cancel
          </AdminButton>
        </Link>
        <div className="flex items-center space-x-3">
          <AdminButton
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish Post'}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
