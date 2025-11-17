# Component Library - Quick Reference

Quick reference guide for developers using the Overwatch Coaching component library.

---

## Import Patterns

```tsx
// Single import from main barrel
import { Button, Card, Header, FormField } from '@/components';

// Category-specific imports
import { Button, Input, Modal } from '@/components/ui';
import { Header, Footer } from '@/components/layout';
import { FormField, FormError } from '@/components/forms';
```

---

## UI Components Quick Reference

### Button
```tsx
<Button variant="primary|secondary|ghost" size="sm|md|lg" isLoading={bool}>
  Click me
</Button>
```

### Input
```tsx
<Input
  inputType="text|email|password|textarea"
  label="Label"
  error="Error message"
  helperText="Helper text"
/>
```

### Card
```tsx
<Card variant="surface|elevated" padding="none|sm|md|lg" hover={bool}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Badge
```tsx
<Badge variant="default|success|warning|error|pending|in_progress|completed" size="sm|md|lg">
  Status
</Badge>
```

### Modal
```tsx
<Modal isOpen={bool} onClose={fn} title="Title" size="sm|md|lg|xl">
  Content
  <ModalFooter>Actions</ModalFooter>
</Modal>
```

### LoadingSpinner
```tsx
<LoadingSpinner size="sm|md|lg|xl" variant="primary|white" text="Loading..." fullScreen={bool} />
<LoadingOverlay isLoading={bool} text="Processing..." />
```

### Toast
```tsx
// Setup (once in app root)
<ToastProvider>
  <App />
</ToastProvider>

// Usage
const toast = useToastHelpers();
toast.success('Title', 'Message');
toast.error('Title', 'Message');
toast.warning('Title', 'Message');
toast.info('Title', 'Message');
```

---

## Layout Components Quick Reference

### Header
```tsx
<Header />
// Includes: Logo, navigation, mobile menu, CTA buttons
```

### Footer
```tsx
<Footer />
// Includes: Links, social media, copyright
```

### Navigation
```tsx
<Navigation />
// Responsive navigation with active states
```

---

## Form Components Quick Reference

### FormField
```tsx
<FormField>
  <FormLabel htmlFor="id" required>Label</FormLabel>
  <Input id="id" />
  <FormError message="Error" />
</FormField>

<FormGroup columns={1|2|3}>
  <FormField>...</FormField>
  <FormField>...</FormField>
</FormGroup>

<FormFieldset legend="Legend">
  <FormField>...</FormField>
</FormFieldset>
```

### FormLabel
```tsx
<FormLabel htmlFor="id" required optional>Label</FormLabel>
<FormDescription>Helper text</FormDescription>
<FormHint>Informational hint</FormHint>
```

### FormError
```tsx
<FormError message="Error message" />
<FormError message={["Error 1", "Error 2"]} />
<FormErrorBanner title="Error" message="Message" onDismiss={fn} />
```

---

## Common Patterns

### Basic Form
```tsx
<Card variant="surface">
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <FormField>
        <FormLabel htmlFor="email" required>Email</FormLabel>
        <Input id="email" inputType="email" error={errors.email} />
      </FormField>

      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  </CardContent>
</Card>
```

### Page Layout
```tsx
function Page() {
  return (
    <div className="min-h-screen bg-[#0f0f23] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Content */}
      </main>
      <Footer />
    </div>
  );
}
```

### Loading State
```tsx
{isLoading ? (
  <LoadingSpinner size="lg" text="Loading data..." />
) : (
  <Content />
)}

// Or fullscreen
<LoadingOverlay isLoading={isSubmitting} text="Processing..." />
```

### Modal with Form
```tsx
<Modal isOpen={isOpen} onClose={close} title="Submit Replay">
  <FormField>
    <FormLabel required>Replay Code</FormLabel>
    <Input value={code} onChange={setCode} />
  </FormField>

  <ModalFooter>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={submit}>Submit</Button>
  </ModalFooter>
</Modal>
```

### Status Badge
```tsx
import { Badge, getStatusBadgeVariant } from '@/components/ui';

<Badge variant={getStatusBadgeVariant(submission.status)}>
  {submission.status}
</Badge>
```

### Toast Notifications
```tsx
function MyComponent() {
  const toast = useToastHelpers();

  const handleSuccess = () => {
    toast.success('Saved!', 'Your changes have been saved.');
  };

  const handleError = (error: Error) => {
    toast.error('Error', error.message);
  };

  return <Button onClick={handleSuccess}>Save</Button>;
}
```

---

## Color Reference

```tsx
// Backgrounds
className="bg-[#0f0f23]"  // Primary background
className="bg-[#1a1a2e]"  // Surface (cards)
className="bg-[#2a2a40]"  // Elevated

// Text
className="text-gray-100"  // Primary text
className="text-gray-300"  // Secondary text
className="text-gray-400"  // Muted text

// Purple
className="text-purple-400"  // Purple text
className="bg-purple-600"    // Purple background
className="border-purple-600/30"  // Purple border with opacity

// Status
className="text-emerald-400"  // Success
className="text-amber-400"    // Warning
className="text-red-400"      // Error
```

---

## Common Class Patterns

```tsx
// Container
className="container mx-auto px-4 sm:px-6 lg:px-8"

// Card spacing
className="p-6"  // Padding
className="space-y-4"  // Vertical spacing between children

// Flex layouts
className="flex items-center gap-3"
className="flex flex-col md:flex-row gap-4"

// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Text
className="text-sm font-medium text-gray-300"
className="text-2xl font-bold text-gray-100"

// Rounded corners
className="rounded-lg"   // 8px
className="rounded-xl"   // 12px
className="rounded-full" // Fully rounded

// Transitions
className="transition-all duration-200"
className="hover:bg-purple-600/10"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-purple-500"
```

---

## Accessibility Checklist

When using components, ensure:

- ✅ Form inputs have labels (`<FormLabel>` or `label` prop)
- ✅ Buttons have descriptive text or `aria-label`
- ✅ Modals have `title` and `description`
- ✅ Error messages use `<FormError>`
- ✅ Loading states use `<LoadingSpinner>` with `text`
- ✅ Required fields use `required` prop
- ✅ Images have `alt` text
- ✅ Links have descriptive text

---

## TypeScript Types

All components export their prop types:

```tsx
import type { ButtonProps } from '@/components/ui';
import type { CardProps } from '@/components/ui';
import type { FormFieldProps } from '@/components/forms';

// Custom wrapper example
function MyButton(props: ButtonProps) {
  return <Button {...props} />;
}
```

---

## Mobile Responsive

All components are mobile-first. Common breakpoints:

- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

```tsx
// Example: Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
```

---

## Customization

All components accept `className` for additional styles:

```tsx
<Button className="w-full mt-4">Full Width Button</Button>
<Card className="border-2 border-purple-500">Custom Card</Card>
```

---

## Common Issues & Solutions

### Button not clickable in Link
```tsx
// ❌ Don't use asChild (not implemented)
<Button asChild><Link>Text</Link></Button>

// ✅ Wrap Link around Button
<Link href="/page"><Button>Text</Button></Link>
```

### Form validation errors
```tsx
// ✅ Use FormError component
<FormField>
  <Input error={errors.email} />
  <FormError message={errors.email} />
</FormField>
```

### Modal not closing on Escape
```tsx
// ✅ Ensure onClose is provided
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
```

---

## Performance Tips

- Use `LoadingSpinner` for async operations
- Implement loading states for better UX
- Use `Card` with `hover` for clickable cards
- Toast notifications auto-dismiss (default 5s)
- Modal prevents body scroll automatically

---

## Resources

- Full Documentation: `components/README.md`
- Component Summary: `COMPONENTS_SUMMARY.md`
- Design System: `PROJECT_SPEC.md`

---

## Support

For questions or issues with components:
1. Check `components/README.md` for detailed documentation
2. Review component TypeScript types
3. Refer to examples in this guide
4. Check PROJECT_SPEC.md for design system details
