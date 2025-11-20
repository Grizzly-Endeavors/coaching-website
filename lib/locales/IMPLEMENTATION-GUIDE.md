# Implementation Guide for Your Coaching Website

This guide shows exactly how to integrate the locale system into your existing Next.js app structure.

## Your Current App Structure

```
app/
├── layout.tsx                    # Root layout
├── (public)/
│   ├── layout.tsx               # Public pages layout
│   ├── page.tsx                 # Home page
│   ├── pricing/page.tsx         # Pricing page
│   ├── blog/page.tsx            # Blog page
│   ├── booking/page.tsx         # Booking page
│   └── contact/page.tsx         # Contact page
├── admin/
│   ├── layout.tsx               # Admin layout
│   └── ...                      # Admin pages
└── login/
    └── layout.tsx               # Login layout
```

## Step-by-Step Integration

### Step 1: Update Root Layout

Update `/home/user/coaching-website/app/layout.tsx`:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { loadAllLocales } from '@/lib/locales/loader';
import { LocaleProvider } from '@/lib/locales/client';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load all locales once at the root
  const locales = loadAllLocales();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap entire app with LocaleProvider */}
        <LocaleProvider locales={locales}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Home Page

Update `/home/user/coaching-website/app/(public)/page.tsx`:

```typescript
// app/(public)/page.tsx
import { loadLocale } from '@/lib/locales/loader';

export default function HomePage() {
  // Load home page locale
  const home = loadLocale('home');
  const common = loadLocale('common');

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>{home.hero.title}</h1>
        <p>{home.hero.subtitle}</p>
        <div className="buttons">
          <button>{home.hero.buttons.view_pricing}</button>
          <button>{home.hero.buttons.get_coaching}</button>
        </div>
      </section>

      {/* Background Section */}
      <section className="background">
        <h2>{home.background.section_title}</h2>
        <p>{home.background.bio.paragraph_1}</p>
        <p>{home.background.bio.paragraph_2}</p>
        <p>{home.background.bio.paragraph_3}</p>

        {/* Achievements */}
        <div className="achievements">
          {home.background.achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <h3>{achievement.title}</h3>
              <p className="value">{achievement.value}</p>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy">
        <h2>{home.philosophy.section_title}</h2>
        <p>{home.philosophy.section_subtitle}</p>
        <div className="points">
          {home.philosophy.points.map((point, index) => (
            <div key={index} className="point">
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Expertise Section */}
      <section className="expertise">
        <h2>{home.expertise.section_title}</h2>
        <p>{home.expertise.section_subtitle}</p>

        {/* Tank Heroes */}
        <div className="role-section">
          <h3>{home.expertise.roles.tank.name}</h3>
          <ul>
            {home.expertise.roles.tank.heroes.map((hero) => (
              <li key={hero}>{hero}</li>
            ))}
          </ul>
        </div>

        {/* DPS Heroes */}
        <div className="role-section">
          <h3>{home.expertise.roles.dps.name}</h3>
          <ul>
            {home.expertise.roles.dps.heroes.map((hero) => (
              <li key={hero}>{hero}</li>
            ))}
          </ul>
        </div>

        {/* Support Heroes */}
        <div className="role-section">
          <h3>{home.expertise.roles.support.name}</h3>
          <ul>
            {home.expertise.roles.support.heroes.map((hero) => (
              <li key={hero}>{hero}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>{home.cta.title}</h2>
        <p>{home.cta.description}</p>
        <div className="buttons">
          <button>{home.cta.buttons.get_coaching}</button>
          <button>{home.cta.buttons.contact_me}</button>
        </div>
      </section>
    </>
  );
}
```

### Step 3: Update Navigation Component

If you have a navigation component, update it:

```typescript
// components/Navigation.tsx (Server Component)
import { loadLocale } from '@/lib/locales/loader';
import Link from 'next/link';

export function Navigation() {
  const common = loadLocale('common');
  const nav = common.navigation.links;

  return (
    <nav>
      <Link href="/">{nav.home}</Link>
      <Link href="/pricing">{nav.pricing}</Link>
      <Link href="/blog">{nav.blog}</Link>
      <Link href="/contact">{nav.contact}</Link>
    </nav>
  );
}
```

Or if it's a client component:

```typescript
// components/Navigation.tsx (Client Component)
'use client';

import { useCommonLocale } from '@/lib/locales/client';
import Link from 'next/link';

export function Navigation() {
  const common = useCommonLocale();
  const nav = common.navigation.links;

  return (
    <nav>
      <Link href="/">{nav.home}</Link>
      <Link href="/pricing">{nav.pricing}</Link>
      <Link href="/blog">{nav.blog}</Link>
      <Link href="/contact">{nav.contact}</Link>
    </nav>
  );
}
```

### Step 4: Update Footer Component

```typescript
// components/Footer.tsx (Server Component)
import { loadLocale } from '@/lib/locales/loader';
import { interpolate } from '@/lib/locales/utils';
import Link from 'next/link';

export function Footer() {
  const common = loadLocale('common');
  const footer = common.footer;

  return (
    <footer>
      {/* Brand Section */}
      <div className="brand">
        <h3>{footer.brand.name}</h3>
        <p>{footer.brand.tagline}</p>
      </div>

      {/* Navigation Links */}
      <div className="footer-links">
        <div className="section">
          <h4>{footer.sections.navigation.title}</h4>
          <Link href="/">{footer.sections.navigation.links.home}</Link>
          <Link href="/pricing">{footer.sections.navigation.links.pricing}</Link>
          <Link href="/blog">{footer.sections.navigation.links.blog}</Link>
          <Link href="/contact">{footer.sections.navigation.links.contact}</Link>
        </div>

        <div className="section">
          <h4>{footer.sections.resources.title}</h4>
          <Link href="/booking">{footer.sections.resources.links.get_coaching}</Link>
          <Link href="/login">{footer.sections.resources.links.admin_login}</Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>
          {interpolate(footer.bottom.copyright, {
            year: new Date().getFullYear(),
          })}
        </p>
        <div className="legal-links">
          <Link href="/privacy">{footer.bottom.privacy_policy}</Link>
          <Link href="/terms">{footer.bottom.terms_of_service}</Link>
        </div>
      </div>
    </footer>
  );
}
```

### Step 5: Update Booking Page

```typescript
// app/(public)/booking/page.tsx
'use client';

import { useLocaleFile, usePlural } from '@/lib/locales/client';
import { useState } from 'react';

export default function BookingPage() {
  const booking = useLocaleFile('booking');
  const common = useLocaleFile('common');
  const validation = useLocaleFile('validation');

  const [replayCount, setReplayCount] = useState(1);

  const replayText = usePlural(replayCount, {
    one: '1 replay code',
    other: '{count} replay codes',
  });

  return (
    <div>
      {/* Hero */}
      <h1>{booking.hero.title}</h1>

      {/* Discord Step */}
      <section>
        <h2>{booking.discord_step.step_number}</h2>
        <p>{booking.discord_step.description}</p>
      </section>

      {/* Coaching Type Selection */}
      <section>
        <h2>{booking.type_selection.title}</h2>
        <p>{booking.type_selection.subtitle}</p>

        <div className="coaching-types">
          <div className="type-card">
            <h3>{booking.type_selection.types.review_async.name}</h3>
            <p>{booking.type_selection.types.review_async.description}</p>
          </div>

          <div className="type-card">
            <h3>{booking.type_selection.types.vod_review.name}</h3>
            <p>{booking.type_selection.types.vod_review.description}</p>
          </div>

          <div className="type-card">
            <h3>{booking.type_selection.types.live_coaching.name}</h3>
            <p>{booking.type_selection.types.live_coaching.description}</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <form>
        {/* Email Field */}
        <div className="field">
          <label>{booking.form.fields.email.label}</label>
          <input
            type="email"
            placeholder={booking.form.fields.email.placeholder}
          />
          <small>{booking.form.fields.email.helper}</small>
        </div>

        {/* Rank Field */}
        <div className="field">
          <label>{booking.form.fields.rank.label}</label>
          <select>
            <option value="">{booking.form.fields.rank.placeholder}</option>
            {booking.data.ranks.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>

        {/* Role Field */}
        <div className="field">
          <label>{booking.form.fields.role.label}</label>
          <select>
            <option value="">{booking.form.fields.role.placeholder}</option>
            {booking.data.roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">
          {booking.form.submit.button_default}
        </button>

        {/* Privacy Notice */}
        <p className="privacy-notice">
          {booking.form.submit.privacy_notice}
        </p>
      </form>

      {/* Show replay count */}
      <p>Selected: {replayText}</p>
    </div>
  );
}
```

### Step 6: Create Type-Safe Hooks (Optional)

Create a new file for your typed hooks:

```typescript
// lib/locales/hooks.ts
import { createTypedLocaleHook } from '@/lib/locales/client';
import type {
  HomeLocale,
  CommonLocale,
  ValidationLocale,
  BookingLocale,
} from '@/lib/locales/types';

// Create typed hooks for each locale you use frequently
export const useHomeLocale = createTypedLocaleHook<HomeLocale>('home');
export const useCommonTyped = createTypedLocaleHook<CommonLocale>('common');
export const useValidationTyped = createTypedLocaleHook<ValidationLocale>('validation');
export const useBookingTyped = createTypedLocaleHook<BookingLocale>('booking');
```

Then use in components:

```typescript
'use client';

import { useHomeLocale } from '@/lib/locales/hooks';

export default function TypeSafeComponent() {
  const home = useHomeLocale();

  // Full TypeScript autocomplete!
  return (
    <div>
      <h1>{home.hero.title}</h1>
      <p>{home.hero.subtitle}</p>
    </div>
  );
}
```

## Common Patterns for Your App

### Form Validation Errors

```typescript
'use client';

import { useValidationLocale } from '@/lib/locales/client';
import { interpolate } from '@/lib/locales/utils';

export function FormField({ error }: { error?: string }) {
  const validation = useValidationLocale();

  return (
    <div>
      <input type="text" />
      {error && (
        <span className="error">
          {interpolate(validation.generic.required, { field: 'Email' })}
        </span>
      )}
    </div>
  );
}
```

### Status Badges

```typescript
'use client';

import { useCommonLocale } from '@/lib/locales/client';

export function StatusBadge({ status }: { status: string }) {
  const common = useCommonLocale();

  return (
    <span className={`badge badge-${status}`}>
      {common.status[status] || status}
    </span>
  );
}
```

### Loading States

```typescript
'use client';

import { useCommonLocale } from '@/lib/locales/client';

export function LoadingButton({ isLoading }: { isLoading: boolean }) {
  const common = useCommonLocale();

  return (
    <button disabled={isLoading}>
      {isLoading
        ? common.buttons.loading.processing
        : common.buttons.primary.submit}
    </button>
  );
}
```

## Migration Strategy

### Phase 1: Setup (Done!)
- ✅ Install dependencies
- ✅ Create locale system files
- ✅ All 18 YAML files are ready

### Phase 2: Foundation
1. Update root layout with LocaleProvider
2. Update Navigation component
3. Update Footer component
4. Test that everything works

### Phase 3: Pages (One at a time)
1. Home page (`app/(public)/page.tsx`)
2. Pricing page (`app/(public)/pricing/page.tsx`)
3. Booking page (`app/(public)/booking/page.tsx`)
4. Blog page (`app/(public)/blog/page.tsx`)
5. Contact page (`app/(public)/contact/page.tsx`)

### Phase 4: Admin Panel
1. Admin dashboard
2. Admin blog management
3. Admin submissions
4. Admin availability

### Phase 5: Polish
1. Add type-safe hooks for all locales
2. Check for any remaining hardcoded strings
3. Test all pages thoroughly
4. Update any missing translations in YAML files

## Testing Checklist

- [ ] Root layout has LocaleProvider
- [ ] Navigation shows correct text
- [ ] Footer shows correct text with current year
- [ ] Home page loads and displays correctly
- [ ] Booking page form fields show correct labels
- [ ] Admin panel shows correct status labels
- [ ] No console errors or warnings
- [ ] All buttons show correct text
- [ ] Pluralization works (test with different counts)
- [ ] Date formatting works correctly

## Troubleshooting

### Issue: "Cannot find module '@/lib/locales'"
**Solution**: Make sure your `tsconfig.json` has the `@` path alias set up:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: "useLocale must be used within LocaleProvider"
**Solution**: Make sure your root layout (`app/layout.tsx`) wraps children with `<LocaleProvider>`.

### Issue: Missing keys show `[key.path]`
**Solution**: Check the YAML file has the key, or provide a fallback:
```typescript
getLocaleString(data, 'missing.key', 'Fallback Text')
```

### Issue: TypeScript errors about missing properties
**Solution**: Update the type definitions in `types.ts` to match your YAML structure.

## Next Steps

1. **Start Small**: Begin with navigation and footer
2. **Test Frequently**: Check console for warnings
3. **Use Type-Safe Hooks**: Better DX and fewer bugs
4. **Migrate Gradually**: One component at a time
5. **Update YAML Files**: Add any missing translations as you go

## Need Help?

Refer to:
- `example-usage.md` - Comprehensive examples
- `quick-start-example.tsx` - Copy-paste code
- `README.md` - Quick reference
- `SETUP-COMPLETE.md` - Overview

Good luck with the integration!
