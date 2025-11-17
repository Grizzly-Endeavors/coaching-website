# Blog System Documentation

## Overview

The blog system is a fully-featured content management solution for the Overwatch Coaching website. It includes a responsive blog listing page, individual post pages with markdown rendering, tag filtering, and pagination.

## Features

### Blog Listing Page (`/blog`)
- Responsive grid layout (1-3 columns based on screen size)
- Displays 12 posts per page
- Tag filtering with visual feedback
- Pagination with page numbers and prev/next controls
- Empty state for no posts or no results
- Loading skeletons for smooth UX
- Call-to-action section

### Individual Blog Post Page (`/blog/[slug]`)
- Full markdown rendering with syntax highlighting
- Displays title, author, publish date, and reading time
- Tag links that filter the blog listing
- "Back to Blog" navigation (top and bottom)
- Call-to-action section
- SEO metadata generation
- Custom 404 not-found page
- Loading state

### Markdown Features
- GitHub Flavored Markdown (GFM) support
- Syntax highlighting for code blocks (highlight.js with GitHub Dark theme)
- Responsive images
- Tables with dark theme styling
- Blockquotes
- Lists (ordered and unordered)
- Inline code
- Headings (H1-H6)
- Links (external links open in new tab)
- Horizontal rules

## Architecture

### Directory Structure

```
/home/user/coaching-website/
├── app/(public)/blog/
│   ├── page.tsx                    # Blog listing page
│   └── [slug]/
│       ├── page.tsx                # Individual blog post
│       └── not-found.tsx           # 404 page for posts
├── components/blog/
│   ├── BlogCard.tsx                # Blog post card component
│   ├── BlogContent.tsx             # Markdown renderer
│   ├── TagFilter.tsx               # Tag filtering UI
│   ├── Pagination.tsx              # Pagination controls
│   └── index.ts                    # Component exports
└── lib/
    └── markdown.ts                 # Markdown utilities
```

### Components

#### BlogCard
Displays a blog post preview in the grid layout.

**Props:**
- `post`: Blog post data including id, title, slug, excerpt, tags, publishedAt, readingTime

**Features:**
- Hover effects with purple glow
- Tag display (max 3 visible)
- Reading time badge
- Published date
- Truncated excerpt
- Loading skeleton variant

#### BlogContent
Renders markdown content with custom styling and syntax highlighting.

**Props:**
- `content`: Raw markdown string

**Features:**
- Custom styled components for all markdown elements
- Syntax highlighting for code blocks
- Responsive images with lazy loading
- Tables with hover effects
- Links with external target handling
- Loading skeleton variant

#### TagFilter
Displays tag filter buttons with active state.

**Props:**
- `tags`: Array of available tags
- `currentTag`: Currently selected tag (optional)

**Features:**
- Client-side navigation with URL updates
- Active state styling
- Clear filter option
- Resets to page 1 when filtering
- Loading skeleton variant

#### Pagination
Displays pagination controls with page numbers.

**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `baseUrl`: Base URL for navigation (default: '/blog')

**Features:**
- Smart page number display with ellipsis
- Prev/Next buttons
- Current page indicator
- Disabled state for boundary pages
- Page info text
- Loading skeleton variant

### Utility Functions

#### lib/markdown.ts

**renderMarkdown(markdown: string): Promise&lt;string&gt;**
- Converts markdown to sanitized HTML
- Applies syntax highlighting
- Prevents XSS attacks
- Supports code blocks, images, tables, etc.

**sanitizeMarkdown(markdown: string): string**
- Removes dangerous HTML from markdown
- Strips script tags, event handlers, and javascript: protocols
- Safe for user-generated content

**extractExcerpt(markdown: string, maxLength?: number): string**
- Extracts plain text from markdown
- Removes formatting and code blocks
- Truncates to specified length (default: 160 characters)
- Smart word breaking

**estimateReadingTime(markdown: string): number**
- Calculates reading time based on word count
- Assumes 200 words per minute
- Returns minutes (minimum 1)

## API Integration

The blog system expects these API endpoints:

### GET /api/blog/posts
Fetches paginated blog posts.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 12)
- `tag` (string, optional): Filter by tag

**Response:**
```json
{
  "posts": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "tags": ["string"],
      "publishedAt": "ISO 8601 date",
      "readingTime": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

### GET /api/blog/[slug]
Fetches a single blog post by slug.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "content": "markdown string",
  "excerpt": "string",
  "tags": ["string"],
  "publishedAt": "ISO 8601 date"
}
```

**Error Response:**
- 404 if post not found

### GET /api/blog/tags
Fetches all unique tags from published posts.

**Response:**
```json
{
  "tags": ["support", "tank", "dps", "positioning", "guides"]
}
```

## Design System

### Colors
The blog system uses the project's dark purple design system:

- **Backgrounds:**
  - Primary: `#0f0f23`
  - Surface: `#1a1a2e`
  - Elevated: `#2a2a40`

- **Purple Accents:**
  - Primary: `#8b5cf6`
  - Hover: `#a78bfa`
  - Glow: `rgba(139, 92, 246, 0.3)`

- **Text:**
  - Primary: `#e5e7eb`
  - Secondary: `#9ca3af`
  - Muted: `#6b7280`

- **Borders:**
  - Default: `#2a2a40`

### Typography
- Font Family: Inter (fallback to system fonts)
- Headings: Bold (700), tight tracking
- Body: Regular (400), relaxed line height
- Code: Monospace

### Spacing
- Cards: 8px border radius, 6px gap in grid
- Padding: Consistent 1.5rem (24px) for cards
- Margins: 1rem (16px) between sections

### Animations
- Transitions: 200-300ms duration
- Hover effects: Scale, shadow, and border color changes
- Purple glow on interactive elements
- Smooth loading skeletons

## Code Syntax Highlighting

The blog uses `highlight.js` with the GitHub Dark theme for code syntax highlighting.

### Supported Languages
- JavaScript
- TypeScript
- Python
- Bash
- JSON
- CSS
- HTML

### Code Block Example
\`\`\`typescript
// This will be syntax highlighted
function greet(name: string): string {
  return `Hello, ${name}!`;
}
\`\`\`

### Inline Code
Use backticks for `inline code` with purple accent styling.

## SEO Features

### Blog Listing Page
- Page title: "Blog - Overwatch Coaching"
- Meta description with keywords
- Open Graph tags for social sharing
- Canonical URL

### Individual Blog Post
- Dynamic title: "[Post Title] - Overwatch Coaching Blog"
- Meta description from post excerpt
- Open Graph tags with article type
- Twitter Card support
- Published date metadata
- Author information
- Tag keywords

## Accessibility

### Semantic HTML
- Proper heading hierarchy (H1 → H2 → H3)
- Article tags for blog posts
- Time tags with datetime attributes
- Nav tags for pagination

### ARIA Labels
- Pagination controls labeled
- Active page indicated with `aria-current="page"`
- Button states with `aria-pressed`
- Loading states announced

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual flow
- Focus states visible

### Screen Readers
- Alt text for images
- Descriptive link text
- Form labels
- Status announcements

## Performance Optimizations

### Server Components
- Blog listing uses React Server Components
- Individual posts use Server Components
- Reduced client-side JavaScript

### Revalidation
- Blog listing: 60 seconds
- Individual posts: 60 seconds
- Tags: 5 minutes (300 seconds)

### Image Optimization
- Lazy loading with `loading="lazy"`
- Responsive images in markdown
- Border and rounded corners for polish

### Code Splitting
- Components loaded on demand
- Syntax highlighting only on blog post pages
- Reduced bundle size

## Usage Examples

### Creating a Blog Post

Blog posts are created through the admin panel (see admin documentation), but here's the data structure:

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt?: string;
  tags: string[];
  published: boolean;
  publishedAt: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}
```

### Markdown Example

```markdown
# Ultimate Ana Guide

Ana is one of the most versatile supports in Overwatch 2. Here's how to master her.

## Positioning

Stay at mid-range to maximize impact while remaining safe.

### Key Positions
- High ground advantage
- Near cover
- Line of sight to team

## Abilities

\`\`\`
Sleep Dart: 12s cooldown
Biotic Grenade: 10s cooldown
Nano Boost: Ultimate
\`\`\`

> Pro tip: Save sleep dart for flankers!

[Learn more about support heroes](/blog?tag=support)
```

### Importing Components

```typescript
// Import all components
import {
  BlogCard,
  BlogCardSkeleton,
  BlogContent,
  BlogContentSkeleton,
  TagFilter,
  TagFilterSkeleton,
  Pagination,
  PaginationSkeleton,
} from '@/components/blog';

// Or import individually
import { BlogCard } from '@/components/blog/BlogCard';
```

### Using Markdown Utilities

```typescript
import {
  renderMarkdown,
  sanitizeMarkdown,
  extractExcerpt,
  estimateReadingTime,
} from '@/lib/markdown';

// Render markdown to HTML
const html = await renderMarkdown(post.content);

// Sanitize user input
const safe = sanitizeMarkdown(userInput);

// Generate excerpt
const excerpt = extractExcerpt(post.content, 160);

// Calculate reading time
const readingTime = estimateReadingTime(post.content);
```

## Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "rehype-highlight": "^7.0.0",
    "rehype-raw": "^7.0.0",
    "rehype-sanitize": "^6.0.0",
    "rehype-stringify": "^10.0.0",
    "remark-gfm": "^4.0.0",
    "remark-parse": "^11.0.0",
    "remark-rehype": "^11.0.0",
    "unified": "^11.0.0",
    "deepmerge-ts": "^5.1.0",
    "highlight.js": "^11.9.0",
    "lucide-react": "^0.294.0"
  }
}
```

## Future Enhancements

### Planned Features
- [ ] Related posts section
- [ ] Blog post search functionality
- [ ] Social share buttons
- [ ] Comment system integration
- [ ] RSS feed generation
- [ ] Blog post categories (in addition to tags)
- [ ] Featured posts
- [ ] Table of contents for long posts
- [ ] Estimated read progress bar
- [ ] Newsletter signup CTA

### Technical Improvements
- [ ] Static site generation for all posts
- [ ] Image CDN integration
- [ ] Advanced caching strategy
- [ ] Analytics integration
- [ ] A/B testing for CTAs
- [ ] Performance monitoring

## Troubleshooting

### Posts Not Displaying
1. Check API endpoint is running and accessible
2. Verify DATABASE_URL environment variable
3. Check that posts have `published: true`
4. Verify posts have valid publishedAt dates

### Markdown Not Rendering
1. Ensure `react-markdown` and related packages are installed
2. Check browser console for errors
3. Verify markdown content is valid
4. Check that rehype plugins are properly configured

### Styling Issues
1. Verify Tailwind CSS is configured
2. Check that global CSS imports highlight.js styles
3. Ensure color variables match design system
4. Clear Next.js cache: `rm -rf .next`

### Performance Issues
1. Enable revalidation for server components
2. Use loading skeletons to improve perceived performance
3. Check bundle size with `next build`
4. Consider implementing virtual scrolling for large lists

## Support

For questions or issues with the blog system:
1. Check this documentation
2. Review the PROJECT_SPEC.md file
3. Check component source code comments
4. Review Next.js App Router documentation

---

**Version:** 1.0.0
**Last Updated:** 2025-11-17
**Maintainer:** Overwatch Coaching Development Team
