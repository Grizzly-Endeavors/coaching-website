# English Locale Files - Summary

## Overview
This directory contains all user-facing text content from the Overwatch Coaching website, organized into YAML locale files for easy internationalization and content management.

## Directory Structure

```
locales/english/
├── common.yaml                    # Shared UI elements (6.5KB)
├── home.yaml                      # Home page content (6.1KB)
├── pricing.yaml                   # Pricing page content (6.6KB)
├── contact.yaml                   # Contact page content (2.4KB)
├── booking.yaml                   # Booking page content (5.6KB)
├── blog.yaml                      # Blog listing and post pages (2.8KB)
├── checkout.yaml                  # Success/cancel pages (2.9KB)
├── terms.yaml                     # Terms of service page (5.2KB)
├── privacy.yaml                   # Privacy policy page (3.9KB)
├── admin-login.yaml               # Admin login page (1.6KB)
├── admin-dashboard.yaml           # Admin dashboard page (2.8KB)
├── admin-blog.yaml                # Admin blog management (2.9KB)
├── admin-submissions.yaml         # Admin submissions page (2.9KB)
├── admin-availability.yaml        # Admin availability manager (5.2KB)
├── validation.yaml                # Form validation messages (5.2KB)
├── metadata.yaml                  # SEO/meta tags for all pages (4.4KB)
└── components/
    ├── discord-connection.yaml    # Discord OAuth component (2.6KB)
    └── time-slot-picker.yaml      # Time slot picker component (2.8KB)
```

## Total Statistics

- **Total Files**: 18 YAML files
- **Total Size**: ~75KB
- **Total Text Strings**: ~857 localized strings
- **Components**: 2 reusable component locales

## File Descriptions

### Core Pages

#### common.yaml
- **Purpose**: Shared UI elements used across all pages
- **Contains**:
  - Navigation links and mobile menu
  - Footer content and social links
  - Common buttons (primary, secondary, loading states)
  - Status labels and badges
  - Aria labels for accessibility
  - Time/date formats
  - Loading states
  - Empty states
  - Common error messages
- **Usage**: Import in layout components and shared UI

#### home.yaml
- **Purpose**: Landing page content
- **Contains**:
  - Hero section (title, subtitle, CTA buttons)
  - Background & credentials (bio, achievements)
  - Coaching philosophy (4 key principles)
  - Hero expertise (Tank, DPS, Support heroes)
  - Differentiators (4 unique selling points)
  - Call-to-action section
- **Key Data**:
  - 4 achievement cards
  - 4 philosophy points
  - 24 hero names across 3 roles
  - 4 differentiator points

#### pricing.yaml
- **Purpose**: Pricing packages and comparisons
- **Contains**:
  - 3 coaching package cards (Async, VOD, Live)
  - Package features (6 per package)
  - How it works (4-step process)
  - Package comparison details
  - FAQ section (5 questions)
  - Call-to-action section
- **Key Data**:
  - 3 pricing tiers ($25, $40, $50)
  - 18 total feature bullet points
  - 5 frequently asked questions

#### contact.yaml
- **Purpose**: Contact form and information
- **Contains**:
  - Hero section
  - Contact form fields and labels
  - Form states (success/error)
  - Contact information (email, Discord, response time)
  - Quick booking card
- **Forms**: Name, email, message fields with validation

#### booking.yaml
- **Purpose**: Booking flow and replay submission
- **Contains**:
  - Multi-step booking process
  - Discord connection step
  - Coaching type selection
  - Replay submission form fields
  - Form descriptions per coaching type
  - Turnaround messages
- **Key Data**:
  - 8 rank options (Bronze to Top 500)
  - 3 role options (Tank, DPS, Support)
  - 3 coaching types
  - 3 replay code slots per submission

#### blog.yaml
- **Purpose**: Blog listing and individual posts
- **Contains**:
  - Blog listing page (title, description, empty states)
  - Blog post page (navigation, metadata, CTA)
  - Tag filter component
  - Pagination component
  - Loading states
  - 404 not found page
- **Features**: Tag filtering, pagination, reading time calculation

#### checkout.yaml
- **Purpose**: Post-payment pages
- **Contains**:
  - Success page (4 title variants per coaching type)
  - Thank you messages
  - Scheduled session display
  - What's next steps (varies by coaching type)
  - Cancel page content
- **Dynamic Content**: Changes based on coaching type

### Legal Pages

#### terms.yaml
- **Purpose**: Terms of service template
- **Contains**:
  - 12 section titles and placeholder content
  - Placeholder notice
  - Legal notice to site owner
- **Note**: Template that requires customization by site owner

#### privacy.yaml
- **Purpose**: Privacy policy template
- **Contains**:
  - 7 section titles and placeholder content
  - Placeholder notice
  - Legal notice to site owner
- **Note**: Template that requires customization by site owner

### Admin Pages

#### admin-login.yaml
- **Purpose**: Admin authentication page
- **Contains**:
  - Page header
  - Login form fields
  - Error messages
  - Loading states
- **Fields**: Email, password, remember me checkbox

#### admin-dashboard.yaml
- **Purpose**: Main admin overview
- **Contains**:
  - Stats cards (3 metrics)
  - Quick action buttons (4 actions)
  - Upcoming bookings section
  - Recent submissions section
- **Metrics**: Pending submissions, total submissions, completion rate

#### admin-blog.yaml
- **Purpose**: Blog post management
- **Contains**:
  - Filter tabs (all, published, drafts)
  - Table headers and columns
  - Post actions (edit, publish, delete)
  - Empty states
  - Confirmation dialogs
  - Success/error messages

#### admin-submissions.yaml
- **Purpose**: Replay submission management
- **Contains**:
  - Search and filter controls
  - Status filter dropdown (6 statuses)
  - Sort options
  - Table headers
  - Empty states
  - Coaching type display names

#### admin-availability.yaml
- **Purpose**: Schedule management
- **Contains**:
  - Add slot dialog (day, time, session type)
  - Block time dialog (date, time, duration, reason)
  - Weekly schedule display
  - Blocked times section
  - Slot actions (enable, disable, delete)
  - Info card with usage instructions
- **Key Data**:
  - 7 days of week
  - 2 session types
  - 2 block reasons (blocked, holiday)

### System Files

#### validation.yaml
- **Purpose**: All form validation error messages
- **Contains**:
  - Email validation (2 messages)
  - Name validation (2 messages)
  - Replay code validation (3 messages)
  - Contact form validation (2 messages)
  - Booking form validation (10+ messages)
  - Login form validation (3 messages)
  - Friend code validation (2 messages)
  - Generic validation templates
- **Total**: ~30 unique validation messages

#### metadata.yaml
- **Purpose**: SEO and meta tags for all pages
- **Contains**:
  - Page titles (15+ pages)
  - Meta descriptions
  - Open Graph tags
  - Twitter card metadata
  - Default/fallback metadata
- **Coverage**: All public and admin pages

### Component Files

#### components/discord-connection.yaml
- **Purpose**: Discord OAuth connection component
- **Contains**:
  - Loading state
  - Connected state (with username, disconnect button)
  - Disconnected state (with connect button, description)
  - Session expiration warning
  - Error states
- **Location**: Used in booking flow (Step 1)

#### components/time-slot-picker.yaml
- **Purpose**: Calendar-style time slot selector
- **Contains**:
  - Header (title, timezone note, session type badge)
  - Navigation (month/year display, prev/next buttons)
  - Time slot display (day format, time format)
  - Selected slot display
  - Empty states
  - Loading state
- **Location**: Used in booking flow for VOD Review and Live Coaching

## Usage Guidelines

### Importing in Code

```typescript
// Example: Using common strings
import common from '@/locales/english/common.yaml'

// Access navigation
const homeLink = common.navigation.links.home // "Home"

// Access buttons
const submitButton = common.buttons.primary.submit // "Submit"
```

### Variable Placeholders

Many strings include placeholders for dynamic content:

```yaml
# Example with placeholder
copyright: "© {year} Overwatch Coaching. All rights reserved."

# Usage in code
const year = new Date().getFullYear()
const text = footer.bottom.copyright.replace('{year}', year)
```

Common placeholders used:
- `{year}` - Current year
- `{count}` - Numeric count
- `{title}` - Post/item title
- `{username}` - User/Discord username
- `{date}` - Formatted date
- `{time}` - Formatted time
- `{minutes}` - Duration in minutes
- `{platform}` - Social media platform name

### Character Limits

Some strings have character limits noted in comments:

```yaml
# Location: booking form
# Character limit: 500 characters
replay_notes:
  too_long: "Notes are too long (max 500 characters)"
```

### Conditional Content

Some content varies based on state or type:

```yaml
# Different titles based on coaching type
titles:
  default: "Booking Confirmed!"
  review_async: "Replay Review Confirmed!"
  vod_review: "VOD Session Booked!"
  live_coaching: "Coaching Session Booked!"
```

## Key Data Arrays

### Ranks (booking.yaml)
```yaml
ranks:
  - Bronze
  - Silver
  - Gold
  - Platinum
  - Diamond
  - Master
  - Grandmaster
  - Top 500
```

### Roles (booking.yaml)
```yaml
roles:
  - Tank
  - DPS
  - Support
```

### Heroes (home.yaml)
- **Tank**: 8 heroes
- **DPS**: 8 heroes
- **Support**: 8 heroes
- **Total**: 24 heroes

### Coaching Types (booking.yaml)
```yaml
coaching_types:
  - review-async: "Asynchronous VOD Review"
  - vod-review: "Live VOD Review"
  - live-coaching: "Live Coaching"
```

### Session Types (admin-availability.yaml)
```yaml
session_types:
  - vod-review: "VOD Review ($40)"
  - live-coaching: "Live Coaching ($50)"
```

### Status Values (common.yaml)
- Submission/Booking: awaiting_payment, payment_received, payment_failed, in_progress, completed, archived, pending, cancelled, confirmed
- Blog: published, draft
- General: active, inactive, enabled, disabled, connected, disconnected

## Multi-Language Support

This structure is designed for easy internationalization:

1. **Create new language directory**: `locales/spanish/`
2. **Copy all files**: Maintain same structure
3. **Translate values**: Keep keys in English, translate values
4. **Import by locale**: `import home from '@/locales/{locale}/home.yaml'`

## Content Update Workflow

1. **Identify content location**: Check comments in YAML files for source location
2. **Update YAML file**: Modify the appropriate string
3. **Test in application**: Verify changes render correctly
4. **Version control**: Commit with descriptive message

## Special Notes

### Placeholder Pages
- `terms.yaml` and `privacy.yaml` contain placeholder templates
- Site owner must customize with proper legal content
- Includes notices reminding of customization requirement

### Dynamic Content
- Hero section varies by page state
- Success page content varies by coaching type
- Admin tables support sorting and filtering
- Blog supports pagination and tag filtering

### Accessibility
- All aria labels centralized in `common.yaml`
- Icon buttons have descriptive labels
- Form fields have proper labels and helpers

### Time Display
- All times shown in EST timezone
- Consistent date/time formatting across application
- Format templates in `common.yaml`

## Maintenance

### Adding New Content
1. Identify appropriate file (or create new one)
2. Add content with descriptive key
3. Include comment with location and context
4. Update this README if adding new file

### Modifying Existing Content
1. Search for string in YAML files
2. Check location comment for source
3. Update value (keep key unchanged)
4. Test in all contexts where used

### Version Control
- Track changes to locale files
- Review diffs carefully for unintended changes
- Document significant content updates

## Questions or Issues?

For questions about:
- **Structure**: Review this README and file comments
- **Missing content**: Check source files listed in comments
- **Translations**: Follow multi-language support guidelines above
- **Integration**: See usage guidelines section
