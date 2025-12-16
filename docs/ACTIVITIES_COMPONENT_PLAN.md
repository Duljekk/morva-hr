# Activities Component Implementation Plan

## Design Analysis

The Activities component displays a chronological feed of check-in/check-out activities grouped by date. It includes:

- Header with "Activities" title and tab navigation (Attendance/Leave Request)
- Date-grouped activity feed with vertical dashed timeline
- Activity cards showing check-in/check-out entries with icons, times, and status badges

## Extracted Variables & Styles

### Colors

- **Backgrounds**: `#ffffff` (white), `#f5f5f5` (neutral-100 for active tab), `rgba(255,255,255,0.6)` (card bg)
- **Text**: `#404040` (neutral-700 for title/times), `#525252` (neutral-600 for dates), `#737373` (neutral-500 for descriptions)
- **Status Badges**:
  - On Time: `bg-[#f0fdf4]` (green-50), `text-[#00a63e]` (green-600)
  - Late: `bg-[#fffbeb]` (amber-50), `text-[#e17100]` (amber-600)
  - Overtime: `bg-[#f5f5f5]` (neutral-100), `text-[#525252]` (neutral-600)
- **Tab Badge**: `bg-[#2b7fff]` (blue-500), `text-white`
- **Dashed Line**: `border-[#a1a1a1]` (neutral-400)

### Typography

- **Title**: `font-semibold`, `text-xl` (20px), `leading-[30px]`, `tracking-[-0.2px]`
- **Tab Text**: `font-medium`, `text-sm` (14px), `leading-[18px]`
- **Date Header**: `font-medium`, `text-base` (16px), `leading-[20px]`
- **Activity Description**: `font-medium`, `text-xs` (12px), `leading-[16px]`
- **Activity Time**: `font-semibold`, `text-sm` (14px), `leading-[18px]`
- **Status Badge**: `font-semibold`, `text-[12px]`, `tracking-[-0.24px]` or `tracking-[-0.06px]`

### Spacing & Layout

- **Container Gap**: `gap-[10px]` (between header and feed)
- **Date Group Gap**: `gap-[12px]` (between date header and activities, between activity cards)
- **Card Padding**: `p-[12px]`
- **Icon Gap**: `gap-[8px]` (between icon and content)
- **Tab Container**: `h-[36px]`, `px-[2px]`, `py-0`, `gap-[2px]`
- **Tab Item**: `h-[32px]`, `p-[10px]`, `gap-[6px]`
- **Card Divider**: `h-0`, `pt-[10px]` for spacing

### Border Radius & Shadows

- **Card**: `rounded-[12px]`
- **Tab**: `rounded-[8px]` (inner), `rounded-[10px]` (container)
- **Badge**: `rounded-[12px]`
- **Icon Container**: `rounded-[8px]` (check-in), `rounded-[9px]` (check-out)
- **Card Shadow**: `shadow-[0px_2px_2px_-1px_rgba(0,0,0,0.05),0px_0px_0.5px_1px_rgba(0,0,0,0.08)]`
- **Active Tab Shadow**: `shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.75px_rgba(0,0,0,0.06)]`

## Component Structure

```
Activities (Main Container)
├── Header
│   ├── Title ("Activities")
│   └── Tabs Container
│       ├── Tab (Attendance) - Active
│       └── Tab (Leave Request) - with notification badge
└── Activities Feed
    └── ActivityGroup[] (by date)
        ├── Date Header (CalendarIcon + date label)
        └── Activity Cards Container
            ├── Vertical Dashed Line
            └── ActivityCard[]
                ├── Icon (CheckInIcon/CheckoutIcon)
                ├── Content
                │   ├── Description ("Checked In"/"Checked Out")
                │   └── Time ("11:00", "19:20")
                └── Status Badge (On Time/Late/Overtime)
```

## Implementation Steps

### Step 1: Create Composite Icons

**Files**: `components/icons/shared/ClockWithLightningIcon.tsx`, `components/icons/shared/ClockWithZIcon.tsx`

- Create `ClockWithLightningIcon` combining `Clock18Icon` with lightning bolt overlay
- Create `ClockWithZIcon` combining `Clock18Icon` with 'Z' symbol overlay
- Both icons: 18px size, use `currentColor` for styling
- Add to `components/icons/index.ts` and `IconRegistry.tsx`

**Note**: Based on the design analysis, we can use the existing `CheckInIcon` and `CheckoutIcon` instead, as they already represent check-in/check-out actions.

### Step 2: Create Generic Tabs Component

**Files**: `components/shared/Tabs.tsx`, `components/shared/Tab.tsx`

- Extract reusable tab pattern from `AttendanceFeedTab` but make it generic
- Support notification badges (optional count prop)
- Active state: white bg with shadow, inactive: transparent
- Follow ARIA best practices (role="tablist", role="tab", aria-selected, etc.)
- Keyboard navigation (Arrow keys, Home, End)

**Props**:

```typescript
interface TabProps {
  label: string;
  isActive?: boolean;
  notificationCount?: number;
  onClick?: () => void;
  id?: string;
  'aria-controls'?: string;
}

interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    notificationCount?: number;
  }>;
  activeTabId?: string;
  defaultActiveTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  'aria-label'?: string;
}
```

### Step 3: Create Activity Status Badge Component

**File**: `components/hr/activities/ActivityStatusBadge.tsx`

- Reusable badge for activity statuses (On Time, Late, Overtime)
- Similar to `AttendanceFeedBadge` but simplified (no icons, text-only)
- Color variants based on status prop

**Props**:

```typescript
interface ActivityStatusBadgeProps {
  status: 'onTime' | 'late' | 'overtime';
  className?: string;
}
```

**Styling**:
- Container: `px-[4px] py-[2px]`, `rounded-[12px]`
- Text: `font-semibold`, `text-[12px]`, appropriate color based on status

### Step 4: Create Activity Card Component

**File**: `components/hr/activities/ActivityCard.tsx`

- Single activity entry card (check-in or check-out)
- Layout: Icon (32x32px) + Content (description + time) + Status Badge
- Uses `CheckInIcon` or `CheckoutIcon` based on type
- Divider between multiple cards in same group

**Props**:

```typescript
interface ActivityCardProps {
  type: 'checkIn' | 'checkOut';
  time: string;
  status: 'onTime' | 'late' | 'overtime';
  showDivider?: boolean;
}
```

**Structure**:
- Container: `flex gap-[8px] items-center`
- Icon container: `size-[32px]`, `bg-neutral-100`, rounded corners
- Content: flex-col with description and time
- Status badge: positioned on the right

### Step 5: Create Activity Group Component

**File**: `components/hr/activities/ActivityGroup.tsx`

- Groups activity cards by date
- Date header with `CalendarIcon` (16px) + date label
- Vertical dashed line container (16px width, left padding)
- Activity cards container with proper spacing

**Props**:

```typescript
interface ActivityGroupProps {
  dateLabel: string; // "Today", "Yesterday", "December 6"
  activities: ActivityCardProps[];
  className?: string;
}
```

**Structure**:
- Date header: `flex gap-[4px] items-center`
- Timeline container: `w-[16px]`, `pl-[8px]`, vertical dashed border
- Activities container: `flex flex-col gap-[12px]`

### Step 6: Create Main Activities Component

**File**: `components/hr/activities/Activities.tsx`

- Main container component
- Header section with title and tabs
- Activities feed with multiple `ActivityGroup` components
- State management for active tab

**Props**:

```typescript
interface ActivityGroupData {
  dateLabel: string;
  activities: ActivityCardProps[];
}

interface ActivitiesProps {
  activities?: ActivityGroupData[];
  defaultActiveTab?: 'attendance' | 'leaveRequest';
  onTabChange?: (tabId: string) => void;
  className?: string;
}
```

### Step 7: Create Activities Page

**File**: `app/(hr)/hr/activities/page.tsx`

- Server/client component structure following Next.js patterns
- Mock data for demonstration
- Integrate `Activities` component

## Key Implementation Details

### Icon Implementation

- Use existing `CheckInIcon` and `CheckoutIcon` (already created)
- Icon container: 32x32px, `bg-neutral-100`, rounded corners
- Icon size: 18px (matches `CheckInIcon`/`CheckoutIcon` default)

### Status Badge Colors

- **On Time**: `bg-[#f0fdf4]` (green-50), `text-[#00a63e]` (green-600)
- **Late**: `bg-[#fffbeb]` (amber-50), `text-[#e17100]` (amber-600)  
- **Overtime**: `bg-[#f5f5f5]` (neutral-100), `text-[#525252]` (neutral-600)

### Vertical Timeline

- Dashed border: `border-l border-dashed border-neutral-400`
- Container: `w-[16px]`, `pl-[8px]`, `pr-0`, `py-0`
- Line grows to fill available height using `grow` or `flex-1`

### Card Structure

- Background: `bg-[rgba(255,255,255,0.6)]`
- Padding: `p-[12px]`
- Gap between items: `gap-[8px]`
- Divider: `h-0` with absolute positioned divider line (1px height, neutral-200 color)

### Tab Implementation

- Active tab: `bg-white`, `shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.75px_rgba(0,0,0,0.06)]`
- Inactive tab: transparent background
- Notification badge: `bg-[#2b7fff]`, `size-[16px]`, `rounded-[4px]`, white text

## Dependencies

### Existing Components to Reuse

- `CalendarIcon` - for date headers (16px)
- `CheckInIcon` - for check-in entries (18px default)
- `CheckoutIcon` - for check-out entries (18px default)
- Tab pattern from `AttendanceFeedTab` (as reference)

### New Components to Create

1. `Tabs` / `Tab` - Generic tab component with notification badge support
2. `ActivityStatusBadge` - Status badge component (text-only)
3. `ActivityCard` - Individual activity card
4. `ActivityGroup` - Date-grouped activities with vertical timeline
5. `Activities` - Main container component

## Accessibility Considerations

- Tabs: Proper ARIA roles (`tablist`, `tab`, `tabpanel`)
- Keyboard navigation for tabs (Arrow keys, Home, End, Enter/Space)
- Semantic HTML structure
- Icon `aria-hidden="true"` for decorative icons
- Status badges: Consider `aria-label` for screen readers
- Date headers: Use semantic date/time elements where appropriate

## File Structure

```
components/
├── shared/
│   ├── Tabs.tsx (new)
│   └── Tab.tsx (new)
└── hr/
    └── activities/
        ├── Activities.tsx (new)
        ├── ActivityGroup.tsx (new)
        ├── ActivityCard.tsx (new)
        └── ActivityStatusBadge.tsx (new)

app/(hr)/hr/activities/
└── page.tsx (new)
```

## Testing Considerations

- Test tab switching functionality
- Test with empty activity lists
- Test with single vs multiple activities per date
- Test status badge color variants
- Test responsive behavior
- Test keyboard navigation
- Test notification badge display/hide
- Test date grouping logic

## Implementation Order

1. Create generic Tabs/Tab components (foundation)
2. Create ActivityStatusBadge component (simple, reusable)
3. Create ActivityCard component (uses badge)
4. Create ActivityGroup component (uses ActivityCard)
5. Create main Activities component (uses Tabs and ActivityGroup)
6. Create activities page (uses Activities component)












