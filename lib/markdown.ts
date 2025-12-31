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
import { logger } from './logger';

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
    logger.error('Error rendering markdown', error instanceof Error ? error : new Error(String(error)));
    throw new Error('Failed to render markdown content');
  }
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
