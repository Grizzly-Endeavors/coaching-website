# Locale System

A comprehensive, type-safe locale loading system for YAML translation files in Next.js 16.

## Features

- **Server Component Support**: Direct YAML loading with Node.js fs module
- **Client Component Support**: React Context and hooks for dynamic access
- **Type-Safe**: Full TypeScript support with autocomplete
- **Performance**: Automatic caching for server-side loads
- **String Interpolation**: Replace `{placeholders}` with dynamic values
- **Pluralization**: Handle singular/plural forms based on count
- **Date Formatting**: Consistent date/time formatting using date-fns
- **Error Handling**: Graceful fallbacks for missing keys
- **Developer Experience**: Clear warnings in development mode

## Quick Start

### 1. Server Components (Recommended)

```typescript
import { loadLocale } from '@/lib/locales';

export default function Page() {
  const home = loadLocale('home');
  return <h1>{home.hero.title}</h1>;
}
```

### 2. Client Components

```typescript
// In layout (Server Component)
import { loadAllLocales, LocaleProvider } from '@/lib/locales';

export default function Layout({ children }) {
  const locales = loadAllLocales();
  return <LocaleProvider locales={locales}>{children}</LocaleProvider>;
}

// In client component
'use client';
import { useLocale } from '@/lib/locales';

export default function Button() {
  const text = useLocale('common', 'buttons.primary.submit');
  return <button>{text}</button>;
}
```

## File Structure

```
lib/locales/
├── index.ts              # Main entry point (exports everything)
├── loader.ts             # Server-side YAML loader
├── client.tsx            # Client-side React hooks & context
├── utils.ts              # Helper utilities
├── types.ts              # TypeScript type definitions
├── example-usage.md      # Comprehensive usage guide
└── README.md             # This file
```

## Available Locale Files

Located in `/locales/english/`:

- `common.yaml` - Navigation, buttons, footer, status labels
- `home.yaml` - Home page content
- `pricing.yaml` - Pricing page content
- `booking.yaml` - Booking flow content
- `blog.yaml` - Blog listing and posts
- `checkout.yaml` - Checkout process
- `contact.yaml` - Contact page
- `terms.yaml` - Terms of service
- `privacy.yaml` - Privacy policy
- `metadata.yaml` - SEO metadata
- `validation.yaml` - Form validation messages
- `admin-*.yaml` - Admin panel content

## Core API

### Server Components

```typescript
import {
  loadLocale,           // Load single file
  loadAllLocales,       // Load all files
  getLocaleString,      // Get nested value with fallback
} from '@/lib/locales';
```

### Client Components

```typescript
import {
  useLocale,            // Get specific string
  useLocaleFile,        // Get entire file
  useCommonLocale,      // Get common locale
  usePlural,            // Pluralization
  useFormatDate,        // Date formatting
  useInterpolate,       // String interpolation
} from '@/lib/locales';
```

### Utilities

```typescript
import {
  interpolate,          // Replace {placeholders}
  pluralize,            // Handle plural forms
  formatDate,           // Format dates
  simplePlural,         // Simple English pluralization
} from '@/lib/locales';
```

## Common Patterns

### String Interpolation

```typescript
import { interpolate } from '@/lib/locales';

// common.footer.bottom.copyright = "© {year} Company. All rights reserved."
const text = interpolate(locale.footer.bottom.copyright, {
  year: new Date().getFullYear()
});
```

### Pluralization

```typescript
import { pluralize } from '@/lib/locales';

const text = pluralize(count, {
  zero: 'No items',
  one: '1 item',
  other: '{count} items'
});
```

### Type-Safe Hooks

```typescript
import { createTypedLocaleHook } from '@/lib/locales';
import type { HomeLocale } from '@/lib/locales/types';

export const useHomeLocale = createTypedLocaleHook<HomeLocale>('home');

// Use in component with full autocomplete
const home = useHomeLocale();
console.log(home.hero.title); // TypeScript autocomplete works!
```

## Documentation

For detailed usage examples, see:
- **[example-usage.md](./example-usage.md)** - Comprehensive guide with examples

## Best Practices

1. **Prefer Server Components**: Faster and don't increase bundle size
2. **Load at Layout Level**: Load once, use everywhere
3. **Use Type-Safe Hooks**: Better developer experience
4. **Provide Fallbacks**: Handle missing keys gracefully
5. **Keep Logic in Utils**: Don't repeat interpolation/pluralization logic

## Performance

- **Caching**: Server-side loads are automatically cached
- **Lazy Loading**: Only loads files you request
- **Optimized**: Uses native Node.js fs module for speed

## Dependencies

- `js-yaml` - YAML parsing
- `@types/js-yaml` - TypeScript types
- `date-fns` - Date formatting (already in project)

## TypeScript Support

Full TypeScript support with:
- Exported interfaces for each locale file
- Generic types for custom locales
- Type-safe hooks with autocomplete
- Strict type checking for all operations

## Error Handling

- **Development Mode**: Console warnings for missing keys
- **Production Mode**: Silent fallbacks
- **Graceful Degradation**: Shows `[key.path]` if key is missing
- **Custom Fallbacks**: Specify your own fallback values

## Extending

### Adding New Locale Files

1. Create YAML file in `/locales/english/filename.yaml`
2. Add to `LocaleKey` type in `types.ts`
3. Optionally create interface in `types.ts`
4. Use immediately: `loadLocale('filename')`

### Adding New Utilities

Add to `utils.ts` and export from `index.ts`

## Migration

Migrating from hardcoded strings or JSON files? See the Migration Guide in `example-usage.md`.

## Questions?

Check `example-usage.md` for detailed examples covering all use cases.
