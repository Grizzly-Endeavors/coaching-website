/**
 * BlogContent Component
 * Renders markdown blog post content with syntax highlighting and custom styling
 * Uses react-markdown with rehype-highlight for code blocks
 */

'use client';

import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-invert prose-cyan max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold text-text-primary mb-6 mt-8 tracking-tight"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold text-text-primary mb-4 mt-8 tracking-tight border-b border-border pb-2"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold text-text-primary mb-3 mt-6"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-xl font-semibold text-text-primary mb-2 mt-4"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-lg font-semibold text-text-primary mb-2 mt-4"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-base font-semibold text-text-primary mb-2 mt-4"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p
              className="text-text-secondary leading-relaxed mb-4"
              {...props}
            />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-brand-primary hover:text-brand-hover underline decoration-brand-primary/50 hover:decoration-brand-hover transition-colors"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside text-text-secondary mb-4 space-y-2 ml-4"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside text-text-secondary mb-4 space-y-2 ml-4"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-text-secondary leading-relaxed" {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-brand-primary pl-4 py-2 my-4 bg-background-surface italic text-text-secondary"
              {...props}
            />
          ),

          // Code blocks
          pre: ({ node, ...props }) => (
            <pre
              className="bg-background-primary border border-border rounded-lg p-4 overflow-x-auto mb-4 text-sm"
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;

            if (isInline) {
              return (
                <code
                  className="bg-background-surface text-brand-hover px-1.5 py-0.5 rounded text-sm font-mono border border-border"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`${className || ''} text-text-primary font-mono`}
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full divide-y divide-border border border-border"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-background-surface" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-background-primary divide-y divide-border" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-background-surface transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 text-sm text-text-secondary"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-t border-border"
              {...props}
            />
          ),

          // Images
          img: ({ node, ...props }) => (
            <img
              className="rounded-lg my-6 max-w-full h-auto border border-border"
              loading="lazy"
              {...props}
            />
          ),

          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-text-primary" {...props} />
          ),

          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic text-text-secondary" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * BlogContentSkeleton Component
 * Loading state for blog content
 */
export function BlogContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-10 bg-background-surface rounded w-3/4" />

      {/* Paragraph skeletons */}
      <div className="space-y-3">
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded w-5/6" />
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded w-4/5" />
      </div>

      {/* Code block skeleton */}
      <div className="h-32 bg-background-primary border border-border rounded-lg" />

      {/* More paragraph skeletons */}
      <div className="space-y-3">
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded" />
        <div className="h-4 bg-background-surface rounded w-3/4" />
      </div>
    </div>
  );
}
