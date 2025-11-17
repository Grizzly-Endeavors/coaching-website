# Overwatch Coaching Website - Component Library

A comprehensive component library built with React, TypeScript, and Tailwind CSS following the dark purple design system specified in PROJECT_SPEC.md.

## Table of Contents

- [Installation & Usage](#installation--usage)
- [Design System](#design-system)
- [Component Categories](#component-categories)
  - [UI Components](#ui-components)
  - [Layout Components](#layout-components)
  - [Form Components](#form-components)
- [Examples](#examples)

---

## Installation & Usage

### Importing Components

```typescript
// Import individual components
import { Button, Card, Modal } from '@/components/ui';
import { Header, Footer } from '@/components/layout';
import { FormField, FormError } from '@/components/forms';

// Or import everything
import { Button, Card, Header, Footer, FormField } from '@/components';
```

---

## Design System

All components follow the design system defined in PROJECT_SPEC.md:

### Colors

- **Backgrounds:** `#0f0f23` (primary), `#1a1a2e` (surface), `#2a2a40` (elevated)
- **Purple Accents:** `#8b5cf6` (primary), `#a78bfa` (hover)
- **Text:** `#e5e7eb` (primary), `#9ca3af` (secondary), `#6b7280` (muted)
- **Status:** `#10b981` (success), `#f59e0b` (warning), `#ef4444` (error)

### Typography

- **Font Family:** Inter (all components)
- **Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Design Features

- Rounded corners (8-12px)
- Purple glow effects on interactive elements
- Smooth transitions (200-300ms)
- High contrast for accessibility
- Mobile-first responsive design

---

## Component Categories

## UI Components

### Button

A versatile button component with multiple variants and states.

**Props:**
- `variant?: 'primary' | 'secondary' | 'ghost'` - Visual style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `isLoading?: boolean` - Shows loading spinner
- `disabled?: boolean` - Disables the button

**Example:**
```tsx
<Button variant="primary" size="md">
  Book Session
</Button>

<Button variant="secondary" size="sm" isLoading>
  Submitting...
</Button>

<Button variant="ghost" disabled>
  Disabled
</Button>
```

**Features:**
- Purple glow effects on hover
- Loading state with spinner
- Focus ring for accessibility
- Fully keyboard accessible

---

### Input

Versatile input component supporting text, email, password, and textarea.

**Props:**
- `inputType?: 'text' | 'email' | 'password' | 'textarea'`
- `label?: string` - Input label
- `error?: string` - Error message
- `helperText?: string` - Helper text below input
- `rows?: number` - Rows for textarea (default: 4)

**Example:**
```tsx
<Input
  label="Email Address"
  inputType="email"
  placeholder="your@email.com"
  required
/>

<Input
  label="Message"
  inputType="textarea"
  rows={6}
  helperText="Tell us about your coaching needs"
/>

<Input
  label="Replay Code"
  error="Invalid replay code format"
/>
```

**Features:**
- Dark theme styling
- Required field indicator
- Error and helper text support
- Accessible with ARIA attributes
- Hover and focus states

---

### Card

Container component with multiple sub-components for structured content.

**Props:**
- `variant?: 'surface' | 'elevated'` - Background darkness
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding
- `hover?: boolean` - Enable hover effect

**Sub-components:**
- `CardHeader` - Card header section
- `CardTitle` - Card title
- `CardDescription` - Card description
- `CardContent` - Main content area
- `CardFooter` - Footer section with top border

**Example:**
```tsx
<Card variant="surface" hover>
  <CardHeader>
    <CardTitle>1-on-1 Coaching</CardTitle>
    <CardDescription>Personalized coaching session</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Work directly with an expert coach...</p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Book Now</Button>
  </CardFooter>
</Card>
```

**Features:**
- Two background variants
- Flexible padding options
- Optional hover effect with purple glow
- Composable sub-components

---

### Badge

Status indicator component for labels and tags.

**Props:**
- `variant?: 'default' | 'success' | 'warning' | 'error' | 'pending' | 'in_progress' | 'completed'`
- `size?: 'sm' | 'md' | 'lg'`

**Helper Function:**
- `getStatusBadgeVariant(status: string)` - Maps status strings to badge variants

**Example:**
```tsx
<Badge variant="success">Completed</Badge>
<Badge variant="pending" size="sm">Pending</Badge>
<Badge variant="in_progress">In Progress</Badge>

// Using helper function
<Badge variant={getStatusBadgeVariant('COMPLETED')}>
  Completed
</Badge>
```

**Features:**
- Multiple status variants with appropriate colors
- Three size options
- Rounded pill design
- Subtle background with colored border

---

### Modal

Accessible modal/dialog component with backdrop.

**Props:**
- `isOpen: boolean` - Controls visibility
- `onClose: () => void` - Close handler
- `title?: string` - Modal title
- `description?: string` - Modal description
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Modal width
- `showCloseButton?: boolean` - Show/hide close button (default: true)

**Sub-components:**
- `ModalFooter` - Footer section for action buttons

**Example:**
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Submission"
  description="Are you sure you want to submit this replay?"
  size="md"
>
  <p>Your replay code will be reviewed within 24-48 hours.</p>

  <ModalFooter>
    <Button variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

**Features:**
- Escape key to close
- Click outside to close
- Prevents body scroll when open
- Accessible with ARIA attributes
- Purple glow shadow effect
- Backdrop blur

---

### LoadingSpinner

Loading indicator component with optional fullscreen mode.

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Spinner size
- `variant?: 'primary' | 'white'` - Color variant
- `text?: string` - Loading text
- `fullScreen?: boolean` - Fullscreen overlay mode

**Helper Component:**
- `LoadingOverlay` - Conditional fullscreen loading overlay

**Example:**
```tsx
<LoadingSpinner size="md" text="Loading..." />

<LoadingSpinner fullScreen text="Processing your request..." />

// Using LoadingOverlay
<LoadingOverlay isLoading={isSubmitting} text="Submitting replay..." />
```

**Features:**
- Animated spinning effect
- Purple glow for primary variant
- Optional loading text
- Fullscreen mode with backdrop
- Accessible with ARIA live regions

---

### Toast

Notification system with provider and hook.

**Setup:**
```tsx
// Wrap your app with ToastProvider
import { ToastProvider } from '@/components/ui';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  );
}
```

**Usage:**
```tsx
import { useToast, useToastHelpers } from '@/components/ui';

function MyComponent() {
  const { showToast } = useToast();
  // Or use helpers for convenience
  const toast = useToastHelpers();

  const handleSuccess = () => {
    toast.success('Replay submitted!', 'We will review it within 24 hours.');
  };

  const handleError = () => {
    toast.error('Submission failed', 'Please check your replay code.');
  };

  return <Button onClick={handleSuccess}>Submit</Button>;
}
```

**Toast Types:**
- `success` - Green with checkmark icon
- `error` - Red with X icon
- `warning` - Amber with warning icon
- `info` - Blue with info icon

**Features:**
- Auto-dismiss after configurable duration
- Manual dismiss button
- Stacked notifications
- Slide-in animation
- Accessible with ARIA live regions
- Icon per type

---

## Layout Components

### Header

Main site header with logo, navigation, and CTA buttons.

**Props:**
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<Header />
```

**Features:**
- Sticky positioning
- Responsive mobile menu
- Logo with purple glow
- Navigation links
- CTA buttons (Book Session, Submit Replay)
- Mobile hamburger menu
- Auto-closes on route change
- Backdrop blur effect

---

### Footer

Site footer with links, social media, and copyright.

**Props:**
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<Footer />
```

**Features:**
- Multi-column responsive layout
- Navigation links
- Resource links
- Social media icons (Discord, Twitter, YouTube, Twitch)
- Copyright with dynamic year
- Privacy and terms links

---

### Navigation

Standalone navigation component with desktop and mobile variants.

**Props:**
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<Navigation />
```

**Features:**
- Active route highlighting
- Mobile slide-out menu
- Prevents body scroll when open
- Accessible with ARIA attributes
- Smooth transitions
- Backdrop blur

---

## Form Components

### FormField

Wrapper component for consistent form field spacing.

**Props:**
- `children: React.ReactNode`
- `className?: string`

**Related Components:**
- `FormFieldset` - Groups related fields with legend
- `FormGroup` - Grid layout for multiple fields

**Example:**
```tsx
<FormField>
  <FormLabel htmlFor="email" required>Email</FormLabel>
  <Input id="email" type="email" />
  <FormError message={errors.email} />
</FormField>

<FormFieldset legend="Player Information">
  <FormGroup columns={2}>
    <FormField>
      <FormLabel>Rank</FormLabel>
      <select>...</select>
    </FormField>
    <FormField>
      <FormLabel>Role</FormLabel>
      <select>...</select>
    </FormField>
  </FormGroup>
</FormFieldset>
```

---

### FormLabel

Styled label component with required/optional indicators.

**Props:**
- `required?: boolean` - Shows red asterisk
- `optional?: boolean` - Shows "(optional)" text
- `children: React.ReactNode`

**Related Components:**
- `FormDescription` - Helper text
- `FormHint` - Informational hint with icon

**Example:**
```tsx
<FormLabel htmlFor="email" required>
  Email Address
</FormLabel>

<FormLabel htmlFor="notes" optional>
  Additional Notes
</FormLabel>

<FormDescription>
  We'll never share your email with anyone else.
</FormDescription>

<FormHint>
  Use a valid Overwatch replay code (e.g., ABC123)
</FormHint>
```

---

### FormError

Error message component for form validation.

**Props:**
- `message?: string | string[]` - Error message(s)
- `className?: string`
- `id?: string` - For aria-describedby

**Related Component:**
- `FormErrorBanner` - Prominent form-level error banner

**Example:**
```tsx
<FormError message="Email is required" />

<FormError message={[
  "Password must be at least 8 characters",
  "Password must contain a number"
]} />

<FormErrorBanner
  title="Submission Failed"
  message="Please correct the errors below."
  onDismiss={() => setError(null)}
/>
```

**Features:**
- Single or multiple error messages
- Error icon
- Red color scheme
- Accessible with ARIA attributes
- Banner variant for form-level errors
- Dismissible banner

---

## Examples

### Complete Form Example

```tsx
import { useState } from 'react';
import {
  FormField,
  FormLabel,
  FormError,
  FormGroup,
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components';

function ReplaySubmissionForm() {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Submit logic...
  };

  return (
    <Card variant="surface">
      <CardHeader>
        <CardTitle>Submit Replay Code</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormGroup columns={2}>
            <FormField>
              <FormLabel htmlFor="email" required>Email</FormLabel>
              <Input
                id="email"
                inputType="email"
                error={errors.email}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="discord">Discord Tag</FormLabel>
              <Input
                id="discord"
                placeholder="Username#1234"
              />
            </FormField>
          </FormGroup>

          <FormField>
            <FormLabel htmlFor="code" required>Replay Code</FormLabel>
            <Input
              id="code"
              placeholder="ABC123"
              error={errors.code}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full"
          >
            Submit Replay
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

### Page Layout Example

```tsx
import { Header, Footer } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui';

function PageLayout({ children, isLoading }) {
  return (
    <div className="min-h-screen bg-[#0f0f23] flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading..." />
        ) : (
          children
        )}
      </main>

      <Footer />
    </div>
  );
}
```

---

## Accessibility Features

All components include:

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Color contrast compliance
- ✅ Error announcements

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Contributing

When adding new components:

1. Follow the existing design system
2. Include TypeScript types
3. Add accessibility features
4. Document props and usage
5. Include examples
6. Test on mobile devices

---

## License

Part of the Overwatch Coaching Website project.
