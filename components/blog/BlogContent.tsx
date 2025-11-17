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
    <div className="prose prose-invert prose-purple max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold text-[#e5e7eb] mb-6 mt-8 tracking-tight"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold text-[#e5e7eb] mb-4 mt-8 tracking-tight border-b border-[#2a2a40] pb-2"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold text-[#e5e7eb] mb-3 mt-6"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-xl font-semibold text-[#e5e7eb] mb-2 mt-4"
              {...props}
            />
          ),
          h5: ({ node, ...props }) => (
            <h5
              className="text-lg font-semibold text-[#e5e7eb] mb-2 mt-4"
              {...props}
            />
          ),
          h6: ({ node, ...props }) => (
            <h6
              className="text-base font-semibold text-[#e5e7eb] mb-2 mt-4"
              {...props}
            />
          ),

          // Paragraphs
          p: ({ node, ...props }) => (
            <p
              className="text-[#9ca3af] leading-relaxed mb-4"
              {...props}
            />
          ),

          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-[#8b5cf6] hover:text-[#a78bfa] underline decoration-[#8b5cf6]/50 hover:decoration-[#a78bfa] transition-colors"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            />
          ),

          // Lists
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside text-[#9ca3af] mb-4 space-y-2 ml-4"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside text-[#9ca3af] mb-4 space-y-2 ml-4"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-[#9ca3af] leading-relaxed" {...props} />
          ),

          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#8b5cf6] pl-4 py-2 my-4 bg-[#1a1a2e] italic text-[#9ca3af]"
              {...props}
            />
          ),

          // Code blocks
          pre: ({ node, ...props }) => (
            <pre
              className="bg-[#0f0f23] border border-[#2a2a40] rounded-lg p-4 overflow-x-auto mb-4 text-sm"
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }) => {
            const isInline = !className;

            if (isInline) {
              return (
                <code
                  className="bg-[#1a1a2e] text-[#a78bfa] px-1.5 py-0.5 rounded text-sm font-mono border border-[#2a2a40]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`${className || ''} text-[#e5e7eb] font-mono`}
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
                className="min-w-full divide-y divide-[#2a2a40] border border-[#2a2a40]"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#1a1a2e]" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="bg-[#0f0f23] divide-y divide-[#2a2a40]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-[#1a1a2e] transition-colors" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-4 py-3 text-left text-xs font-semibold text-[#e5e7eb] uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="px-4 py-3 text-sm text-[#9ca3af]"
              {...props}
            />
          ),

          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              className="my-8 border-t border-[#2a2a40]"
              {...props}
            />
          ),

          // Images
          img: ({ node, ...props }) => (
            <img
              className="rounded-lg my-6 max-w-full h-auto border border-[#2a2a40]"
              loading="lazy"
              {...props}
            />
          ),

          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-[#e5e7eb]" {...props} />
          ),

          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic text-[#9ca3af]" {...props} />
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
      <div className="h-10 bg-[#1a1a2e] rounded w-3/4" />

      {/* Paragraph skeletons */}
      <div className="space-y-3">
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded w-5/6" />
      </div>

      <div className="space-y-3">
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded w-4/5" />
      </div>

      {/* Code block skeleton */}
      <div className="h-32 bg-[#0f0f23] border border-[#2a2a40] rounded-lg" />

      {/* More paragraph skeletons */}
      <div className="space-y-3">
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded" />
        <div className="h-4 bg-[#1a1a2e] rounded w-3/4" />
      </div>
    </div>
  );
}
