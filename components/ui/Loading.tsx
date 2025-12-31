import React from 'react';

/**
 * Loading component props interface
 */
export interface LoadingProps {
  /** Loading spinner size */
  size?: 'sm' | 'md' | 'lg';
  /** Full page overlay variant */
  overlay?: boolean;
  /** Loading message */
  message?: string;
}

/**
 * Loading spinner component with optional full-page overlay
 *
 * @example
 * <Loading size="lg" message="Loading data..." />
 * <Loading overlay message="Please wait..." />
 */
export default function Loading({
  size = 'md',
  overlay = false,
  message,
}: LoadingProps) {
  const sizeStyles = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        className={`animate-spin ${sizeStyles[size]} text-brand-primary`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
        role="status"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {message && (
        <p className="text-text-secondary text-sm font-medium">
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Loading..."
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
