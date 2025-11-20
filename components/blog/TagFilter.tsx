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
        <span className="text-sm font-semibold text-text-primary">Filter by tag:</span>
        {currentTag && (
          <button
            onClick={handleClearFilter}
            className="text-xs text-purple-primary hover:text-purple-hover transition-colors"
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
                    ? 'bg-purple-primary text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-background-surface text-text-secondary border border-border hover:border-purple-primary hover:text-purple-hover'
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
      <div className="h-5 w-32 bg-background-surface rounded mb-3" />
      <div className="flex flex-wrap gap-2">
        <div className="h-9 w-20 bg-background-surface rounded-lg" />
        <div className="h-9 w-24 bg-background-surface rounded-lg" />
        <div className="h-9 w-28 bg-background-surface rounded-lg" />
        <div className="h-9 w-16 bg-background-surface rounded-lg" />
        <div className="h-9 w-32 bg-background-surface rounded-lg" />
      </div>
    </div>
  );
}
