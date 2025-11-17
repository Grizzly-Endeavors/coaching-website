/**
 * Markdown utilities for rendering and sanitizing blog post content
 * Provides secure markdown processing with syntax highlighting support
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { deepmerge } from 'deepmerge-ts';

/**
 * Enhanced sanitization schema that allows code blocks with syntax highlighting
 */
const sanitizeSchema = deepmerge(defaultSchema, {
  attributes: {
    '*': ['className'],
    code: ['className'],
    pre: ['className'],
    span: ['className', 'style'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'code',
    'pre',
    'span',
  ],
});

/**
 * Renders markdown content to HTML with syntax highlighting
 *
 * @param markdown - Raw markdown string
 * @returns Promise<string> - Sanitized HTML string
 *
 * @example
 * const html = await renderMarkdown('# Hello World\n\n```js\nconsole.log("hi");\n```');
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse) // Parse markdown to AST
      .use(remarkRehype) // Convert markdown AST to HTML AST
      .use(rehypeSanitize, sanitizeSchema) // Sanitize HTML to prevent XSS
      .use(rehypeHighlight, {
        // Configure syntax highlighting
        ignoreMissing: true,
        subset: ['javascript', 'typescript', 'python', 'bash', 'json', 'css', 'html']
      })
      .use(rehypeStringify) // Convert HTML AST to string
      .process(markdown);

    return String(result);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    throw new Error('Failed to render markdown content');
  }
}

/**
 * Sanitizes markdown content by stripping potentially dangerous HTML
 * Use this for user-generated content before storing in database
 *
 * @param markdown - Raw markdown string
 * @returns string - Sanitized markdown string
 *
 * @example
 * const safe = sanitizeMarkdown(userInput);
 */
export function sanitizeMarkdown(markdown: string): string {
  // Remove HTML comments
  let sanitized = markdown.replace(/<!--[\s\S]*?-->/g, '');

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove inline event handlers
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocols (except for images)
  sanitized = sanitized.replace(/(?<!img.*?)data:/gi, '');

  return sanitized.trim();
}

/**
 * Extracts plain text from markdown for generating excerpts
 * Removes all markdown formatting and returns clean text
 *
 * @param markdown - Raw markdown string
 * @param maxLength - Maximum length of excerpt (default: 160)
 * @returns string - Plain text excerpt
 *
 * @example
 * const excerpt = extractExcerpt('# Title\n\nThis is content...', 100);
 */
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove frontmatter if present
  let content = markdown.replace(/^---[\s\S]*?---\n/, '');

  // Remove markdown syntax
  content = content
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/__(.+?)__/g, '$1') // Bold (alt)
    .replace(/_(.+?)_/g, '$1') // Italic (alt)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/>\s+/g, '') // Blockquotes
    .replace(/^\s*[-*+]\s+/gm, '') // Lists
    .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
    .replace(/\n{2,}/g, ' ') // Multiple newlines
    .replace(/\n/g, ' ') // Single newlines
    .trim();

  // Truncate to maxLength
  if (content.length > maxLength) {
    content = content.substring(0, maxLength).trim();
    // Try to break at last word
    const lastSpace = content.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      content = content.substring(0, lastSpace);
    }
    content += '...';
  }

  return content;
}

/**
 * Estimates reading time for markdown content
 * Assumes average reading speed of 200 words per minute
 *
 * @param markdown - Raw markdown string
 * @returns number - Estimated reading time in minutes
 *
 * @example
 * const readTime = estimateReadingTime(blogPost.content); // Returns: 5
 */
export function estimateReadingTime(markdown: string): number {
  // Remove code blocks as they're typically scanned, not read
  const contentWithoutCode = markdown.replace(/```[\s\S]*?```/g, '');

  // Count words
  const words = contentWithoutCode
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  // Calculate reading time (200 words per minute)
  const minutes = Math.ceil(words / 200);

  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Type definition for blog post metadata
 */
export interface BlogPostMetadata {
  title: string;
  slug: string;
  excerpt?: string;
  tags: string[];
  publishedAt: string;
  readingTime?: number;
}
