/**
 * Not Found Page for Blog Posts
 * Displayed when a blog post slug doesn't exist
 */

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { loadLocale } from '@/lib/locales';

const blogLocale = loadLocale('blog');

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a1a2e] border border-[#2a2a40] mb-6">
          <Search className="w-10 h-10 text-[#6b7280]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#e5e7eb] mb-4">
          {blogLocale.not_found.title as string}
        </h1>

        {/* Description */}
        <p className="text-[#9ca3af] mb-8 leading-relaxed">
          {blogLocale.not_found.description as string}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#8b5cf6] text-white font-medium hover:bg-[#a78bfa] transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{blogLocale.not_found.button as string}</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1a1a2e] text-[#e5e7eb] font-medium border border-[#2a2a40] hover:border-[#8b5cf6] transition-all"
          >
            Go Home
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-[#2a2a40]">
          <p className="text-sm text-[#6b7280] mb-4">
            Here's what you can do:
          </p>
          <ul className="text-sm text-[#9ca3af] space-y-2">
            <li>Check the URL for typos</li>
            <li>Browse our latest blog posts</li>
            <li>Search for related content</li>
            <li>Visit our homepage</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
