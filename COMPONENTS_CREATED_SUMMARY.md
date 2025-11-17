# UI Components and Layout Structure - Summary

This document summarizes all the reusable UI components and layout structures created for the Overwatch Coaching website.

## Overview

All components follow:
- ✅ TypeScript with proper prop types and interfaces
- ✅ Dark purple design system from PROJECT_SPEC.md
- ✅ Accessibility features (ARIA labels, semantic HTML)
- ✅ Mobile responsive design
- ✅ Tailwind CSS styling
- ✅ Hover/focus states
- ✅ JSDoc comments for documentation

---

## Layout Components

### 1. Header (`/home/user/coaching-website/components/layout/Header.tsx`)
**Status:** ✅ Updated with enhancements

**Features:**
- Sticky header with enhanced blur effect on scroll
- Navigation menu: Home, Services, About, Blog, Booking, Contact
- Mobile hamburger menu with smooth animations
- Dark purple theme with active link highlighting
- CTA buttons (Submit Replay, Book Session)
- Responsive design for all screen sizes
- Auto-closes mobile menu on route change

**Key Props:**
- `className`: Optional additional CSS classes

**Usage:**
```tsx
import { Header } from '@/components/layout/Header';

<Header />
```

---

### 2. Footer (`/home/user/coaching-website/components/layout/Footer.tsx`)
**Status:** ✅ Updated with JSDoc comments

**Features:**
- Dark purple theme
- Quick links (Home, Services, About, Blog, Contact, Booking)
- Resources section (Book Session, Submit Replay, Admin Login)
- Social media icons (Discord, Twitter, YouTube, Twitch)
- Copyright notice with dynamic year
- Privacy Policy and Terms of Service links
- Fully responsive grid layout

**Key Props:**
- `className`: Optional additional CSS classes

**Usage:**
```tsx
import { Footer } from '@/components/layout/Footer';

<Footer />
```

---

## UI Components

### 3. Button (`/home/user/coaching-website/components/ui/Button.tsx`)
**Status:** ✅ Updated with outline variant

**Variants:**
- `primary`: Purple background with glow effect
- `secondary`: Dark elevated background with border
- `outline`: Transparent with purple border

**Sizes:**
- `sm`: Small (px-4 py-2)
- `md`: Medium (px-6 py-3) - default
- `lg`: Large (px-8 py-4)

**Features:**
- Loading state with spinner
- Disabled state
- Full width option
- Active scale animation
- Focus ring for accessibility

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" loading={isSubmitting}>
  Submit
</Button>
```

---

### 4. Card (`/home/user/coaching-website/components/ui/Card.tsx`)
**Status:** ✅ Updated with purpleBorder prop and JSDoc

**Variants:**
- `surface`: Dark surface background (#1a1a2e) - default
- `elevated`: Elevated background (#2a2a40)

**Padding:**
- `none`, `sm`, `md` (default), `lg`

**Features:**
- Optional hover effect with lift animation
- Optional purple border
- Rounded corners
- Smooth transitions

**Sub-components:**
- `CardHeader`: Header section with margin
- `CardTitle`: Bold heading
- `CardDescription`: Secondary text
- `CardContent`: Main content area
- `CardFooter`: Footer with top border

**Props:**
```typescript
interface CardProps {
  variant?: 'surface' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  purpleBorder?: boolean;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import { Card, CardTitle, CardContent } from '@/components/ui/Card';

<Card hover purpleBorder>
  <CardTitle>Service Name</CardTitle>
  <CardContent>
    <p>Service description...</p>
  </CardContent>
</Card>
```

---

### 5. Input (`/home/user/coaching-website/components/ui/Input.tsx`)
**Status:** ✅ Updated with JSDoc comments

**Features:**
- Text, email, password, and textarea variants
- Label with required indicator
- Error state with red border and message
- Helper text support
- Dark theme styling
- Focus ring
- Disabled state
- Accessibility attributes

**Props:**
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  inputType?: 'text' | 'email' | 'password' | 'textarea';
  rows?: number; // for textarea
}
```

**Usage:**
```tsx
import { Input } from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
  required
/>
```

---

### 6. TextArea (`/home/user/coaching-website/components/ui/Textarea.tsx`)
**Status:** ✅ Updated with JSDoc and helperText

**Features:**
- Multi-line text input
- Label with required indicator
- Error state styling
- Helper text support
- Vertical resize only
- Minimum height (120px)
- Dark theme
- Accessibility support

**Props:**
```typescript
interface TextareaProps {
  label?: string;
  error?: string;
  helperText?: string;
}
```

**Usage:**
```tsx
import Textarea from '@/components/ui/Textarea';

<Textarea
  label="Additional Notes"
  placeholder="Tell us more..."
  rows={5}
  error={errors.notes}
/>
```

---

### 7. Select (`/home/user/coaching-website/components/ui/Select.tsx`)
**Status:** ✅ Updated with JSDoc comments

**Features:**
- Dropdown select with options
- Label with required indicator
- Error state
- Placeholder option
- Dark theme
- Disabled options support
- Focus ring

**Props:**
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}
```

**Usage:**
```tsx
import Select from '@/components/ui/Select';

<Select
  label="Rank"
  placeholder="Select your rank"
  options={[
    { value: 'bronze', label: 'Bronze' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
  ]}
  error={errors.rank}
/>
```

---

### 8. Badge (`/home/user/coaching-website/components/ui/Badge.tsx`)
**Status:** ✅ Updated with purple variant and JSDoc

**Variants:**
- `purple`: Purple badge (default)
- `success`: Green badge
- `warning`: Amber badge
- `error`: Red badge
- `pending`: Amber (alias for warning)
- `in_progress`: Purple (alias for purple)
- `completed`: Green (alias for success)

**Sizes:**
- `sm`, `md` (default), `lg`

**Props:**
```typescript
interface BadgeProps {
  variant?: 'purple' | 'success' | 'warning' | 'error' | 'pending' | 'in_progress' | 'completed';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Helper Function:**
```typescript
getStatusBadgeVariant(status: string): BadgeProps['variant']
```

**Usage:**
```tsx
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';

<Badge variant="success">Completed</Badge>
<Badge variant="purple">DPS</Badge>
<Badge variant={getStatusBadgeVariant('PENDING')}>Pending</Badge>
```

---

### 9. Loading (`/home/user/coaching-website/components/ui/Loading.tsx`)
**Status:** ✅ Created with JSDoc

**Variants:**
- Inline spinner
- Full-page overlay

**Sizes:**
- `sm`: Small spinner (h-6 w-6)
- `md`: Medium spinner (h-10 w-10) - default
- `lg`: Large spinner (h-16 w-16)

**Features:**
- Animated spinning icon
- Optional message
- Overlay variant with backdrop blur
- Purple theme
- Accessibility labels

**Props:**
```typescript
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  message?: string;
}
```

**Usage:**
```tsx
import Loading from '@/components/ui/Loading';

// Inline
<Loading size="lg" message="Loading data..." />

// Full-page overlay
<Loading overlay message="Please wait..." />
```

---

## App Layouts

### 10. Root Layout (`/home/user/coaching-website/app/layout.tsx`)
**Status:** ✅ Verified - Complete

**Features:**
- Inter font configuration with CSS variables
- HTML lang attribute set to "en"
- Comprehensive metadata (title, description, keywords, OpenGraph, Twitter)
- SEO-friendly setup
- Imports globals.css
- Dark theme by default
- Antialiased text rendering

**Metadata:**
- Title: "Overwatch Coaching | Professional Rank Improvement"
- Description: Professional coaching services
- OpenGraph and Twitter card support
- Robots configuration for SEO

---

### 11. Public Layout (`/home/user/coaching-website/app/(public)/layout.tsx`)
**Status:** ✅ Verified - Complete

**Features:**
- Wraps all public pages
- Includes Header component
- Main content wrapper with min-h-screen
- Includes Footer component
- Creates consistent layout for all public pages

**Structure:**
```tsx
<>
  <Header />
  <main className="min-h-screen">
    {children}
  </main>
  <Footer />
</>
```

---

## Component Export Index

**File:** `/home/user/coaching-website/components/ui/index.ts`
**Status:** ✅ Updated

All components are exported from a central index file for convenient importing:

```typescript
// Import examples
import { Button, Card, Badge, Loading } from '@/components/ui';
import { Input, Select, Textarea } from '@/components/ui';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
```

---

## Design System Compliance

All components follow the design system defined in PROJECT_SPEC.md:

### Colors
- Background Primary: `#0f0f23`
- Background Surface: `#1a1a2e`
- Background Elevated: `#2a2a40`
- Purple Primary: `#8b5cf6` (purple-600)
- Purple Hover: `#a78bfa` (purple-500)
- Purple Glow: `rgba(139, 92, 246, 0.3)`
- Text Primary: `#e5e7eb` (gray-200)
- Text Secondary: `#9ca3af` (gray-400)
- Text Muted: `#6b7280` (gray-500)

### Typography
- Font Family: Inter (loaded via Next.js font system)
- Headings: Bold (font-weight 700), tracking tight
- Body: Regular (font-weight 400), leading relaxed

### Effects
- Rounded corners: 8-12px (rounded-lg, rounded-xl)
- Purple glow effects on interactive elements
- Smooth transitions (duration-200, duration-300)
- Hover states with scale/translate animations
- Focus rings for accessibility

---

## Accessibility Features

All components include:
- ✅ Proper ARIA labels and attributes
- ✅ Semantic HTML elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Error announcements with role="alert"
- ✅ Proper label associations (htmlFor/id)
- ✅ aria-current for active navigation
- ✅ aria-busy for loading states

---

## Mobile Responsiveness

All components are mobile-first and include:
- ✅ Responsive breakpoints (sm, md, lg)
- ✅ Mobile hamburger menu in Header
- ✅ Touch-friendly tap targets
- ✅ Flexible grid layouts
- ✅ Adaptive text sizes
- ✅ Collapsible sections on mobile

---

## File Structure

```
/home/user/coaching-website/
├── app/
│   ├── layout.tsx                    # Root layout (Inter font, metadata)
│   ├── (public)/
│   │   └── layout.tsx                # Public pages layout (Header + Footer)
│   └── admin/
│       └── layout.tsx                # Admin layout (separate)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # Site header with navigation
│   │   └── Footer.tsx                # Site footer
│   │
│   └── ui/
│       ├── Badge.tsx                 # Status badges and tags
│       ├── Button.tsx                # Button with variants
│       ├── Card.tsx                  # Card container
│       ├── Input.tsx                 # Text input
│       ├── Loading.tsx               # Loading spinner
│       ├── Select.tsx                # Dropdown select
│       ├── Textarea.tsx              # Multi-line text input
│       ├── TextArea.tsx              # Alternative textarea (duplicate)
│       └── index.ts                  # Barrel export file
│
├── app/globals.css                   # Global styles and design system
└── tailwind.config.ts                # Tailwind configuration
```

---

## Next Steps

These components are ready to be used throughout the application:

1. **Public Pages:** Use Card, Button, Badge for service listings, testimonials
2. **Forms:** Use Input, Textarea, Select, Button for replay submission and contact forms
3. **Blog:** Use Card, Badge for post listings and tags
4. **Admin:** Components can be extended or wrapped for admin-specific needs
5. **Loading States:** Use Loading component for async operations

---

## Testing Recommendations

Before deployment, test:
- [ ] All component variants render correctly
- [ ] Mobile hamburger menu opens/closes
- [ ] Header blur effect on scroll
- [ ] Form validation states (error, disabled)
- [ ] Loading states with spinners
- [ ] Hover effects and animations
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Dark theme consistency
- [ ] Responsive layouts on all breakpoints

---

## Summary

**Total Components Created/Updated:** 11

**Layout Components:**
1. ✅ Header - Enhanced with scroll effects and active states
2. ✅ Footer - Updated with JSDoc comments

**UI Components:**
3. ✅ Button - Added outline variant
4. ✅ Card - Added purpleBorder prop
5. ✅ Input - Added JSDoc comments
6. ✅ TextArea/Textarea - Enhanced with helper text
7. ✅ Select - Added JSDoc comments
8. ✅ Badge - Updated variants
9. ✅ Loading - Created with overlay variant

**App Layouts:**
10. ✅ Root Layout - Verified
11. ✅ Public Layout - Verified

All components are production-ready, fully typed, accessible, and follow the Overwatch Coaching website design system.
