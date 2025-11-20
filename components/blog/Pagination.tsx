/**
 * Pagination Component
 * Displays pagination controls for blog post listing
 * Supports both page numbers and prev/next navigation
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl = '/blog',
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Don't render if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    const queryString = params.toString();
    router.push(queryString ? `${baseUrl}?${queryString}` : baseUrl);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          inline-flex items-center justify-center w-10 h-10 rounded-lg
          transition-all duration-200
          ${
            currentPage === 1
              ? 'bg-background-surface text-text-muted cursor-not-allowed'
              : 'bg-background-surface text-text-secondary border border-border hover:border-purple-primary hover:text-purple-hover hover:shadow-lg hover:shadow-purple-500/20'
          }
        `}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center justify-center w-10 h-10 text-text-muted"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`
                inline-flex items-center justify-center w-10 h-10 rounded-lg
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-purple-primary text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-background-surface text-text-secondary border border-border hover:border-purple-primary hover:text-purple-hover hover:shadow-lg hover:shadow-purple-500/20'
                }
              `}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          inline-flex items-center justify-center w-10 h-10 rounded-lg
          transition-all duration-200
          ${
            currentPage === totalPages
              ? 'bg-background-surface text-text-muted cursor-not-allowed'
              : 'bg-background-surface text-text-secondary border border-border hover:border-purple-primary hover:text-purple-hover hover:shadow-lg hover:shadow-purple-500/20'
          }
        `}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page Info Text */}
      <span className="ml-4 text-sm text-text-muted">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}

/**
 * PaginationSkeleton Component
 * Loading state for pagination
 */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 animate-pulse">
      <div className="w-10 h-10 bg-background-surface rounded-lg" />
      <div className="w-10 h-10 bg-background-surface rounded-lg" />
      <div className="w-10 h-10 bg-background-surface rounded-lg" />
      <div className="w-10 h-10 bg-background-surface rounded-lg" />
      <div className="w-10 h-10 bg-background-surface rounded-lg" />
      <div className="w-20 h-5 bg-background-surface rounded ml-4" />
    </div>
  );
}
