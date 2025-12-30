# Design Document: Employee Profile Page

## Overview

The Employee Profile Page is a mobile-first page in the MorvaHR employee app that displays the logged-in employee's personal information, leave balances with visual indicators, and leave request history. The page follows the existing design system and reuses components like Avatar, RoleBadge, and UnifiedBadge.

## Architecture

The profile page follows Next.js App Router conventions with server-side data fetching and client-side interactivity. It integrates with the existing employee layout which includes the FloatingNavbar.

```
app/(employee)/profile/
├── page.tsx              # Server component - data fetching
└── _components/
    ├── ProfilePageClient.tsx      # Client component - main page
    ├── ProfileHeader.tsx          # Profile info section
    ├── LeaveBalancesCard.tsx      # Leave balances card (uses shared LeaveBalanceIndicator)
    ├── LeaveRequestsCard.tsx      # Leave requests history
    └── LeaveRequestItem.tsx       # Individual leave request

components/shared/
├── Bar.tsx                        # Already exists - individual bar segment
├── LeaveBalanceIndicator.tsx      # Extract from EmployeeTableRow - bar visualization
└── LeaveBalanceBadge.tsx          # Extract from EmployeeTableRow - fraction badge
```

## Components and Interfaces

### Reusable Components (Already Exist)

The following components already exist and will be reused:

- `Avatar` - `components/shared/Avatar.tsx` - Profile picture display
- `RoleBadge` - `components/shared/RoleBadge.tsx` - Role badge (Intern/Full-time)
- `UnifiedBadge` - `components/shared/UnifiedBadge.tsx` - Status badges
- `MailIcon` - `components/icons/shared/Mail.tsx` - Email icon
- `Bar` - `components/shared/Bar.tsx` - Individual bar segment
- `LeaveBalanceIndicator` - Extract from `components/hr/employees/EmployeeTableRow.tsx`
- `LeaveBalanceBadge` - Extract from `components/hr/employees/EmployeeTableRow.tsx`

### ProfilePageClient

Main client component that orchestrates the profile page layout.

```typescript
interface ProfilePageClientProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: 'Intern' | 'Full-time';
    avatarUrl?: string | null;
  };
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
}
```

### ProfileHeader

Displays the user's profile picture, name, role badge, and email.

```typescript
interface ProfileHeaderProps {
  fullName: string;
  email: string;
  role: 'Intern' | 'Full-time';
  avatarUrl?: string | null;
  onSettingsClick?: () => void;
}
```

### LeaveBalancesCard

Card component displaying all leave balances with visual bars.

```typescript
interface LeaveBalance {
  type: 'annual' | 'wfh' | 'sick';
  label: string;
  remaining: number;
  total: number;
}

interface LeaveBalancesCardProps {
  balances: LeaveBalance[];
}
```

### LeaveBalanceIndicator (Reuse from HR)

Visual bar indicator showing remaining vs used leave days. This component already exists in `components/hr/employees/EmployeeTableRow.tsx` and uses the shared `Bar` component from `components/shared/Bar.tsx`.

The existing implementation will be extracted and moved to a shared location for reuse.

```typescript
// Existing Bar component from components/shared/Bar.tsx
type BarVariant = 'High' | 'Medium' | 'Low' | 'Empty';

interface BarProps {
  color?: BarVariant;
  className?: string;
}

// LeaveBalanceIndicator props (to be extracted from EmployeeTableRow)
interface LeaveBalanceIndicatorProps {
  current: number;  // remaining days
  total: number;
}

// LeaveBalanceBadge props (to be extracted from EmployeeTableRow)
interface LeaveBalanceBadgeProps {
  current: number;
  total: number;
}
```

**Reusable Components:**
- `Bar` - Already exists at `components/shared/Bar.tsx`
- `LeaveBalanceIndicator` - Extract from `EmployeeTableRow.tsx` to `components/shared/LeaveBalanceIndicator.tsx`
- `LeaveBalanceBadge` - Extract from `EmployeeTableRow.tsx` to `components/shared/LeaveBalanceBadge.tsx`

### LeaveRequestsCard

Card component displaying the list of leave requests.

```typescript
interface LeaveRequestsCardProps {
  requests: LeaveRequest[];
}
```

### LeaveRequestItem

Individual leave request list item.

```typescript
interface LeaveRequest {
  id: string;
  type: 'annual' | 'sick' | 'wfh' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  isHalfDay?: boolean;
}

interface LeaveRequestItemProps {
  request: LeaveRequest;
  isLast?: boolean;
}
```

## Data Models

### User Profile Data

```typescript
interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  employment_type: 'intern' | 'full-time';
  profile_picture_url?: string | null;
}
```

### Leave Balance Data

```typescript
interface LeaveBalanceData {
  leave_type: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
}
```

### Leave Request Data

```typescript
interface LeaveRequestData {
  id: string;
  leave_type: {
    name: string;
    slug: string;
  };
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected';
  is_half_day: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Leave Balance Display Completeness

*For any* leave balance data provided to LeaveBalancesCard, the component SHALL render all required elements: the leave type label, a LeaveBalanceBar component, and a badge showing the remaining/total ratio in the format "X/Y".

**Validates: Requirements 3.3, 3.4, 3.5**

### Property 2: Leave Balance Bar Accuracy

*For any* valid remaining and total values where 0 ≤ remaining ≤ total, the LeaveBalanceIndicator SHALL render exactly 10 bar segments (MAX_BARS), with the number of filled segments proportional to the remaining/total ratio. The Bar component color variant (High/Medium/Low) is determined by the number of filled bars: 6-10 = High (green), 3-5 = Medium (amber), 1-2 = Low (red).

**Validates: Requirements 4.1, 4.2, 4.3, 4.5**

### Property 3: Leave Request Item Completeness

*For any* leave request data provided to LeaveRequestItem, the component SHALL render: an icon corresponding to the leave type, the leave type name, the formatted date range, and a status badge with the correct color (amber for pending, green for approved, red for rejected).

**Validates: Requirements 5.3, 5.4, 5.5, 5.6**

## Error Handling

### Data Fetching Errors

- If user profile fetch fails: Display error message with retry button
- If leave balances fetch fails: Show card with error state and retry option
- If leave requests fetch fails: Show card with error state and retry option

### Edge Cases

- No profile picture: Avatar component displays placeholder (handled internally)
- No leave requests: Display empty state message "No leave requests yet"
- Zero leave balance: Display bar with all empty segments
- Full leave balance: Display bar with all filled segments

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples and edge cases:

1. ProfileHeader renders correctly with all props
2. LeaveBalanceIndicator renders correct number of filled/empty bars
3. LeaveBalanceBadge displays correct color based on balance level
4. LeaveRequestItem displays correct status badge color
5. Empty state displays when no leave requests
6. Settings button triggers navigation

### Property-Based Tests

Property-based tests will use fast-check library to verify universal properties:

1. **Leave Balance Indicator Proportionality**: For any current/total combination, filled bars are proportional to the ratio
2. **Leave Balance Badge Color Consistency**: For any balance level, badge color matches bar color variant
3. **Leave Request Status Badge Color**: For any status value, the badge has the correct color mapping

### Test Configuration

- Property tests: Minimum 100 iterations per property
- Test framework: Jest with React Testing Library
- Property testing library: fast-check
- Tag format: **Feature: employee-profile-page, Property {number}: {property_text}**
