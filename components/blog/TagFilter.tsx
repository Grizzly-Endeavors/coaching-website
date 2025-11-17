/**
 * TagFilter Component
 * Displays tags for filtering blog posts
 * Shows all available tags with active state
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface TagFilterProps {
  tags: string[];
  currentTag?: string;
}

export function TagFilter({ tags, currentTag }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentTag === tag) {
      // If clicking the active tag, remove the filter
      params.delete('tag');
    } else {
      // Set the new tag filter
      params.set('tag', tag);
      // Reset to page 1 when filtering
      params.delete('page');
    }

    // Update the URL
    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : '/blog');
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    params.delete('page');

    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : '/blog');
  };

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-[#e5e7eb]">Filter by tag:</span>
        {currentTag && (
          <button
            onClick={handleClearFilter}
            className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = currentTag === tag;

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`
                inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-[#1a1a2e] text-[#9ca3af] border border-[#2a2a40] hover:border-[#8b5cf6] hover:text-[#a78bfa]'
                }
              `}
              aria-pressed={isActive}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TagFilterSkeleton Component
 * Loading state for tag filter
 */
export function TagFilterSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-5 w-32 bg-[#1a1a2e] rounded mb-3" />
      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-20 bg-[#1a1a2e] rounded-lg" />
        <div className="h-9 w-24 bg-[#1a1a2e] rounded-lg" />
        <div className="h-9 w-28 bg-[#1a1a2e] rounded-lg" />
        <div className="h-9 w-16 bg-[#1a1a2e] rounded-lg" />
        <div className="h-9 w-32 bg-[#1a1a2e] rounded-lg" />
      </div>
    </div>
  );
}
