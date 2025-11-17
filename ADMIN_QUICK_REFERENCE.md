# Admin Panel Quick Reference

## Access URLs

**Login:** `/admin/login`
**Dashboard:** `/admin`
**Submissions:** `/admin/submissions`
**Blog Manager:** `/admin/blog`
**Schedule:** `/admin/schedule`

---

## Page Routes

| Route | Purpose | File Path |
|-------|---------|-----------|
| `/admin/login` | Admin authentication | `app/admin/login/page.tsx` |
| `/admin` | Dashboard overview | `app/admin/page.tsx` |
| `/admin/submissions` | Submissions list | `app/admin/submissions/page.tsx` |
| `/admin/submissions/[id]` | Submission detail | `app/admin/submissions/[id]/page.tsx` |
| `/admin/blog` | Blog posts manager | `app/admin/blog/page.tsx` |
| `/admin/blog/new` | Create blog post | `app/admin/blog/new/page.tsx` |
| `/admin/blog/edit/[id]` | Edit blog post | `app/admin/blog/edit/[id]/page.tsx` |
| `/admin/schedule` | Bookings overview | `app/admin/schedule/page.tsx` |

---

## Component Usage

### Import Admin Components
```typescript
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminTable,
  AdminTableRow,
  AdminTableCell,
  AdminLoading,
  StatusBadge,
  SubmissionsTable,
} from '@/components/admin';
```

### StatusBadge Component
```typescript
<StatusBadge status="PENDING" />
<StatusBadge status="COMPLETED" />
<StatusBadge status="IN_PROGRESS" />
```

### SubmissionsTable Component
```typescript
<SubmissionsTable
  submissions={submissionsArray}
  emptyMessage="No submissions found"
/>
```

### AdminButton Variants
```typescript
<AdminButton variant="primary">Primary</AdminButton>
<AdminButton variant="secondary">Secondary</AdminButton>
<AdminButton variant="danger">Delete</AdminButton>
<AdminButton variant="ghost">Cancel</AdminButton>
```

---

## API Endpoints Used

### Submissions
- `GET /api/admin/submissions?status=PENDING&sort=desc`
- `GET /api/admin/submissions/[id]`
- `PATCH /api/admin/submissions/[id]`
- `DELETE /api/admin/submissions/[id]`

### Blog
- `GET /api/admin/blog/posts`
- `POST /api/admin/blog/posts`
- `POST /api/admin/blog/upload`
- `GET /api/admin/blog/[id]`
- `PATCH /api/admin/blog/[id]`
- `DELETE /api/admin/blog/[id]`

### Bookings
- `GET /api/admin/bookings`
- `PATCH /api/admin/bookings/[id]`

---

## Mobile Responsiveness

### Breakpoints
- **Mobile:** `< 1024px` - Hamburger menu
- **Desktop:** `≥ 1024px` - Fixed sidebar

### Mobile Features
- Slide-out sidebar with overlay
- Touch-friendly navigation
- Responsive tables (horizontal scroll)
- Stacked form layouts
- Mobile header with hamburger menu

---

## Status Types

### Submission Status
- `PENDING` - Orange
- `IN_PROGRESS` - Blue
- `COMPLETED` - Green
- `ARCHIVED` - Gray

### Booking Status
- `SCHEDULED` - Purple
- `COMPLETED` - Green
- `CANCELLED` - Red
- `NO_SHOW` - Red

---

## Key Features

### Dashboard
- ✅ Real-time statistics
- ✅ Upcoming bookings (next 5)
- ✅ Recent submissions (last 10)
- ✅ Quick action buttons
- ✅ Completion rate calculation

### Submissions Manager
- ✅ Filter by status
- ✅ Sort by date
- ✅ View/edit/delete submissions
- ✅ Send email notifications
- ✅ Update review status

### Blog Manager
- ✅ Create from markdown files
- ✅ Manual post creation
- ✅ Live markdown preview
- ✅ Publish/unpublish toggle
- ✅ Tag management
- ✅ Draft/published filtering

### Schedule
- ✅ Upcoming/past bookings split
- ✅ Mark as completed
- ✅ Mark as no-show
- ✅ Filter by status
- ✅ Google Calendar link

---

## Authentication

All admin routes are protected by NextAuth:
- Server-side session check in `app/admin/layout.tsx`
- Automatic redirect to `/admin/login` if not authenticated
- Session persists based on "Remember me" checkbox

---

## Customization

### Colors (from design system)
```css
--bg-primary: #0f0f23
--bg-surface: #1a1a2e
--bg-elevated: #2a2a40
--purple-primary: #8b5cf6
--purple-hover: #a78bfa
--text-primary: #e5e7eb
--text-secondary: #9ca3af
--text-muted: #6b7280
```

### Component Styling
All admin components use Tailwind CSS with the project's color scheme. Customize by:
1. Updating component files in `components/admin/`
2. Maintaining consistent purple accent color
3. Keeping dark theme for all admin pages

---

## Common Tasks

### Adding a New Status Type
1. Update `StatusBadge.tsx` variant switch case
2. Add color to variant styles
3. Update Prisma enum if needed

### Adding a New Admin Page
1. Create page in `app/admin/[your-page]/page.tsx`
2. Add navigation link in `AdminLayoutClient.tsx`
3. Create corresponding API route if needed
4. Use existing admin components for consistency

### Customizing Table Columns
1. Update `SubmissionsTable.tsx` or create new table component
2. Modify headers array
3. Update table cell rendering logic
4. Maintain responsive design

---

## Development Workflow

1. **Local Development:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/admin/login
   ```

2. **Create Admin User:**
   ```bash
   # Use Prisma Studio or seed script
   npx prisma studio
   ```

3. **Test Authentication:**
   - Login at `/admin/login`
   - Verify redirect to `/admin`
   - Test logout functionality

4. **Test Mobile:**
   - Resize browser to < 1024px
   - Verify hamburger menu appears
   - Test sidebar slide-in/out
   - Verify all pages are responsive

---

## Troubleshooting

### Sidebar Not Showing
- Check screen width (should be ≥ 1024px for auto-show)
- Verify `AdminLayoutClient.tsx` is imported correctly
- Check z-index conflicts

### API Errors
- Verify API routes exist in `app/api/admin/`
- Check authentication session
- Review API route error handling

### Mobile Menu Not Working
- Ensure `AdminLayoutClient.tsx` is a client component (`'use client'`)
- Check useState for sidebarOpen
- Verify onClick handlers are attached

---

## Files Modified/Created

### New Files
- `/home/user/coaching-website/app/admin/AdminLayoutClient.tsx`
- `/home/user/coaching-website/components/admin/StatusBadge.tsx`
- `/home/user/coaching-website/components/admin/SubmissionsTable.tsx`
- `/home/user/coaching-website/ADMIN_PANEL_SUMMARY.md`
- `/home/user/coaching-website/ADMIN_QUICK_REFERENCE.md`

### Updated Files
- `/home/user/coaching-website/app/admin/layout.tsx` (mobile-responsive)
- `/home/user/coaching-website/components/admin/index.ts` (added exports)

### Existing Files (Already Complete)
- All admin page components
- All existing admin UI components
- All API routes

---

## Support

For issues or questions:
1. Check `ADMIN_PANEL_SUMMARY.md` for detailed implementation info
2. Review `PROJECT_SPEC.md` for original specifications
3. Examine component files for usage examples
4. Test in different screen sizes for responsive issues
