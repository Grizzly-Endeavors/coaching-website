# Locale System Usage Guide

This guide shows how to use the comprehensive locale loading system for managing YAML translation files.

## Table of Contents

- [Server Components](#server-components)
- [Client Components](#client-components)
- [String Interpolation](#string-interpolation)
- [Pluralization](#pluralization)
- [Date Formatting](#date-formatting)
- [Type Safety](#type-safety)
- [Best Practices](#best-practices)

---

## Server Components

Server Components can directly load locale files using the loader functions.

### Loading a Single Locale File

```typescript
// app/page.tsx (Server Component)
import { loadLocale } from '@/lib/locales/loader';

export default function HomePage() {
  const home = loadLocale('home');
  const common = loadLocale('common');

  return (
    <div>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.subtitle}</p>
      <button>{common.buttons.primary.get_coaching}</button>
    </div>
  );
}
```

### Loading All Locales

```typescript
// app/layout.tsx (Server Component)
import { loadAllLocales } from '@/lib/locales/loader';

export default function RootLayout({ children }) {
  const locales = loadAllLocales();

  // Use locales throughout your layout
  return (
    <html>
      <body>
        {children}
        <footer>
          <p>{locales.common.footer.brand.tagline}</p>
        </footer>
      </body>
    </html>
  );
}
```

### Type-Safe Loading

```typescript
import { loadTypedLocale } from '@/lib/locales/loader';
import type { HomeLocale } from '@/lib/locales/types';

export default function HomePage() {
  // Full TypeScript autocomplete!
  const home = loadTypedLocale<'home', HomeLocale>('home');

  return <h1>{home.hero.title}</h1>;
}
```

### Getting Nested Values

```typescript
import { loadLocale, getLocaleString } from '@/lib/locales/loader';

export default function Page() {
  const data = loadLocale('home');

  // Direct access
  const title = data.hero.title;

  // Using helper (with error handling)
  const subtitle = getLocaleString(data, 'hero.subtitle');

  // With fallback
  const missing = getLocaleString(data, 'hero.nonexistent', 'Default Value');

  return <div>{title}</div>;
}
```

---

## Client Components

Client Components use React Context and hooks to access locale data.

### Setup: Wrap with Provider

First, wrap your app (or part of it) with the `LocaleProvider`:

```typescript
// app/layout.tsx (Server Component)
import { loadAllLocales } from '@/lib/locales/loader';
import { LocaleProvider } from '@/lib/locales/client';

export default function RootLayout({ children }) {
  const locales = loadAllLocales();

  return (
    <html>
      <body>
        <LocaleProvider locales={locales}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
```

### Using Locales in Client Components

```typescript
'use client';

import { useLocaleFile, useLocale } from '@/lib/locales/client';

export default function MyClientComponent() {
  // Get entire locale file
  const common = useLocaleFile('common');

  // Get specific string with dot notation
  const submitText = useLocale('common', 'buttons.primary.submit');

  // Get specific string from a file
  const heroTitle = useLocale('home', 'hero.title');

  return (
    <div>
      <h1>{heroTitle}</h1>
      <button>{submitText}</button>
      <p>{common.footer.brand.name}</p>
    </div>
  );
}
```

### Using Multiple Strings

```typescript
'use client';

import { useLocales } from '@/lib/locales/client';

export default function ButtonGroup() {
  // Get multiple strings at once
  const { submit, cancel, save } = useLocales('common', [
    'buttons.primary.submit',
    'buttons.primary.cancel',
    'buttons.primary.save',
  ]);

  return (
    <>
      <button>{submit}</button>
      <button>{cancel}</button>
      <button>{save}</button>
    </>
  );
}
```

### Convenience Hooks

```typescript
'use client';

import { useCommonLocale, useValidationLocale } from '@/lib/locales/client';

export default function Form() {
  const common = useCommonLocale();
  const validation = useValidationLocale();

  return (
    <form>
      <button>{common.buttons.primary.submit}</button>
      {/* Show validation error */}
      <span className="error">{validation.email.invalid}</span>
    </form>
  );
}
```

---

## String Interpolation

Replace placeholders in locale strings with dynamic values.

### Server Components

```typescript
import { loadLocale } from '@/lib/locales/loader';
import { interpolate } from '@/lib/locales/utils';

export default function Footer() {
  const common = loadLocale('common');

  // common.footer.bottom.copyright = "© {year} Overwatch Coaching. All rights reserved."
  const copyrightText = interpolate(common.footer.bottom.copyright, {
    year: new Date().getFullYear(),
  });

  return <footer>{copyrightText}</footer>;
}
```

### Client Components

```typescript
'use client';

import { useLocale, useInterpolate } from '@/lib/locales/client';

export default function Welcome({ userName }: { userName: string }) {
  // Using useLocale with vars option
  const greeting = useLocale('common', 'greeting', {
    vars: { name: userName },
  });

  // Or using useInterpolate hook
  const message = useInterpolate('Welcome back, {name}!', { name: userName });

  return <div>{greeting}</div>;
}
```

### Complex Interpolation

```typescript
import { interpolate } from '@/lib/locales/utils';

// validation.generic.too_short = "{field} must be at least {min} characters"
const errorMessage = interpolate(validation.generic.too_short, {
  field: 'Password',
  min: 8,
});
// Result: "Password must be at least 8 characters"
```

---

## Pluralization

Handle singular and plural forms based on count.

### Basic Pluralization

```typescript
'use client';

import { usePlural } from '@/lib/locales/client';

export default function ItemCount({ count }: { count: number }) {
  const text = usePlural(count, {
    zero: 'No items',
    one: '1 item',
    other: '{count} items',
  });

  return <p>{text}</p>;
}
```

### Server-Side Pluralization

```typescript
import { pluralize } from '@/lib/locales/utils';

export default function NotificationBadge({ count }: { count: number }) {
  const text = pluralize(count, {
    zero: 'No notifications',
    one: '1 new notification',
    other: '{count} new notifications',
  });

  return <span>{text}</span>;
}
```

### Simple Plural (English)

```typescript
import { simplePlural } from '@/lib/locales/utils';

const text1 = simplePlural(1, 'item'); // "1 item"
const text2 = simplePlural(5, 'item'); // "5 items"
const text3 = simplePlural(0, 'child', 'children'); // "0 children"
```

---

## Date Formatting

Format dates using predefined formats from locale files.

### Using Predefined Formats

```typescript
'use client';

import { useFormatDate } from '@/lib/locales/client';

export default function DateDisplay({ date }: { date: Date }) {
  // Available formats: 'time_12h', 'time_24h', 'date_short', 'date_long', 'datetime'
  const shortDate = useFormatDate(date, 'date_short'); // "Jan 1, 2024"
  const fullDate = useFormatDate(date, 'date_long'); // "January 1, 2024"
  const time = useFormatDate(date, 'time_12h'); // "9:00 AM"

  return (
    <div>
      <p>{shortDate}</p>
      <p>{time}</p>
    </div>
  );
}
```

### Server-Side Date Formatting

```typescript
import { formatDate, formatDateCustom } from '@/lib/locales/utils';

export default function BlogPost({ publishedAt }: { publishedAt: Date }) {
  const date = formatDate(publishedAt, 'date_long');
  const customFormat = formatDateCustom(publishedAt, 'yyyy-MM-dd');

  return <time dateTime={customFormat}>{date}</time>;
}
```

---

## Type Safety

Create fully type-safe locale hooks for autocomplete and type checking.

### Define Your Types

```typescript
// lib/locales/types.ts (add to existing file)

export interface CustomLocale {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
}
```

### Create Typed Hook

```typescript
// lib/locales/hooks.ts
import { createTypedLocaleHook } from '@/lib/locales/client';
import type { HomeLocale, CommonLocale, ValidationLocale } from './types';

// Create typed hooks for each locale
export const useHomeLocale = createTypedLocaleHook<HomeLocale>('home');
export const useCommonTyped = createTypedLocaleHook<CommonLocale>('common');
export const useValidationTyped = createTypedLocaleHook<ValidationLocale>('validation');
```

### Use Typed Hook

```typescript
'use client';

import { useHomeLocale } from '@/lib/locales/hooks';

export default function Hero() {
  const home = useHomeLocale();

  // Full TypeScript autocomplete!
  return (
    <div>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.subtitle}</p>
      {home.background.achievements.map((achievement) => (
        <div key={achievement.title}>
          <h3>{achievement.title}</h3>
          <p>{achievement.value}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

### 1. Load Once, Use Everywhere

Load locale data at the layout level and pass it down:

```typescript
// app/layout.tsx
import { loadAllLocales } from '@/lib/locales/loader';
import { LocaleProvider } from '@/lib/locales/client';

export default function RootLayout({ children }) {
  const locales = loadAllLocales(); // Load once

  return (
    <LocaleProvider locales={locales}>
      {children} {/* All children can access locales */}
    </LocaleProvider>
  );
}
```

### 2. Use Type-Safe Hooks

Always create typed hooks for better DX:

```typescript
// Good: Type-safe
const home = useHomeLocale();
return <h1>{home.hero.title}</h1>; // Autocomplete works!

// Not as good: Untyped
const home = useLocaleFile('home');
return <h1>{home.hero.title}</h1>; // No autocomplete
```

### 3. Handle Missing Keys Gracefully

Always provide fallbacks for critical UI text:

```typescript
const text = useLocale('common', 'buttons.submit', {
  fallback: 'Submit',
});
```

### 4. Keep Locale Logic in Utils

Don't repeat interpolation logic - use the utilities:

```typescript
// Good
import { interpolate } from '@/lib/locales/utils';
const text = interpolate(template, vars);

// Bad
const text = template.replace(/{name}/g, name).replace(/{count}/g, count);
```

### 5. Cache in Server Components

The loader automatically caches, so don't worry about calling it multiple times:

```typescript
// These will use cached data after first load
const common = loadLocale('common');
const home = loadLocale('home');
const validation = loadLocale('validation');
```

### 6. Organize by Feature

Keep related locale strings in the same file:

- `common.yaml` - Shared UI elements
- `home.yaml` - Home page specific
- `booking.yaml` - Booking flow specific
- `validation.yaml` - All validation messages

### 7. Use Meaningful Keys

Use descriptive, hierarchical keys:

```yaml
# Good
hero:
  title: "Welcome"
  subtitle: "Get started today"

# Not as good
text1: "Welcome"
text2: "Get started today"
```

---

## Performance Tips

### 1. Server Components by Default

Use Server Components when possible - they're faster and don't increase bundle size:

```typescript
// app/page.tsx - Server Component (preferred)
import { loadLocale } from '@/lib/locales/loader';

export default function Page() {
  const locale = loadLocale('home');
  return <h1>{locale.hero.title}</h1>;
}
```

### 2. Load Only What You Need

Don't load all locales if you only need one:

```typescript
// Good: Only load what's needed
const home = loadLocale('home');

// Less optimal: Loading everything
const allLocales = loadAllLocales();
const home = allLocales.home;
```

### 3. Memoize in Client Components

The hooks already use `useMemo` internally, but for complex operations:

```typescript
const processedData = useMemo(() => {
  const locale = useLocaleFile('home');
  return locale.expertise.roles.dps.heroes.map(/* ... */);
}, []);
```

---

## Troubleshooting

### "Locale file not found" Error

Make sure the file exists and the name matches:

```typescript
// If you have: locales/english/my-page.yaml
loadLocale('my-page'); // Correct
loadLocale('myPage'); // Wrong
loadLocale('my-page.yaml'); // Wrong (no extension)
```

### "useLocale must be used within a LocaleProvider" Error

Ensure your client component is wrapped in LocaleProvider:

```typescript
// app/layout.tsx
<LocaleProvider locales={locales}>
  {children}
</LocaleProvider>
```

### Missing Key Warnings

Check the console for warnings about missing keys:

```
[Locale] Missing key: "hero.nonexistent" in home
```

Fix by adding the key to your YAML file or providing a fallback.

---

## Migration Guide

### From Hardcoded Strings

Before:
```typescript
<button>Submit</button>
```

After:
```typescript
const common = loadLocale('common');
<button>{common.buttons.primary.submit}</button>
```

### From JSON Files

If you're migrating from JSON to YAML:

1. Convert JSON to YAML (keep the same structure)
2. Update imports: `loadLocale()` instead of `import json`
3. Everything else stays the same!

---

## Additional Resources

- [YAML Syntax Guide](https://yaml.org/)
- [date-fns Format Strings](https://date-fns.org/docs/format)
- [Next.js 16 App Router](https://nextjs.org/docs)

---

## Questions?

For more examples, check the implementation in:
- `/lib/locales/loader.ts` - Server-side loading
- `/lib/locales/client.tsx` - Client-side hooks
- `/lib/locales/utils.ts` - Helper utilities
- `/lib/locales/types.ts` - Type definitions
