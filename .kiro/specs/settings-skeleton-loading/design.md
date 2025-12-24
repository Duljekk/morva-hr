# Design Document: Settings Page Skeleton Loading

## Overview

This design document outlines the implementation of skeleton loading states for the HR Settings page. The implementation follows established patterns from other HR pages (EmployeeTableSkeleton, AttendanceFeedSkeleton, LeaveRequestSectionSkeleton) to maintain consistency across the application.

The skeleton loading will provide visual feedback during the initial data fetch for office locations, displaying placeholder shapes that match the layout of the actual content components.

## Architecture

The skeleton loading implementation follows a component-based architecture:

```
SettingsPageClient
├── SettingsPageHeader (always rendered - static)
└── Tab Content (Company)
    ├── SettingsLeftSectionSkeleton (when loading)
    │   └── Company profile placeholders
    ├── SettingsLeftSection (when loaded)
    ├── SettingsRightSectionSkeleton (when loading)
    │   └── CardOfficeSkeleton × count
    └── SettingsRightSection (when loaded)
```

The existing `isLoadingLocations` state in SettingsPageClient will be leveraged to toggle between skeleton and actual content.

## Components and Interfaces

### SettingsLeftSectionSkeleton

```typescript
export interface SettingsLeftSectionSkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}
```

Displays skeleton placeholders for:
- Banner area (84px height)
- Company logo (96x96 circular)
- Company name text
- Industry text
- Website link with icon
- Email with icon

### SettingsRightSectionSkeleton

```typescript
export interface SettingsRightSectionSkeletonProps {
  /**
   * Number of CardOffice skeletons to display
   * @default 3
   */
  count?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
```

Displays:
- "Office" title (static text)
- Input field placeholder
- Button placeholder
- CardOfficeSkeleton components

### CardOfficeSkeleton

```typescript
export interface CardOfficeSkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}
```

Displays skeleton placeholders for:
- Icon container (40x40)
- Location name text
- Address text
- Radio button (top-right)

## Data Models

No new data models are required. The implementation uses existing state:

```typescript
// Existing state in SettingsPageClient
const [isLoadingLocations, setIsLoadingLocations] = useState(true);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Skeleton count rendering
*For any* valid count value (1-10), the SettingsRightSectionSkeleton component SHALL render exactly that number of CardOfficeSkeleton components.
**Validates: Requirements 3.4**

### Property 2: Accessibility attributes presence
*For any* skeleton component (SettingsLeftSectionSkeleton, SettingsRightSectionSkeleton, CardOfficeSkeleton), the root container SHALL include aria-busy="true" and aria-live="polite" attributes.
**Validates: Requirements 5.2**

## Error Handling

Skeleton components are purely presentational and do not handle errors. Error states are managed by the parent SettingsPageClient component through existing error handling:

- `locationError` state displays error messages
- `locationWarning` state displays warning messages
- Skeleton is replaced with actual content or error state when loading completes

## Testing Strategy

### Unit Tests

Unit tests will verify:
- Component renders without errors
- Correct number of skeleton items rendered
- Static elements (title) are present
- CSS classes are applied correctly

### Property-Based Tests

Property-based tests will use a testing library (e.g., fast-check) to verify:

1. **Skeleton count property**: For any count value within valid range, the correct number of CardOfficeSkeleton components are rendered
2. **Accessibility property**: For any skeleton component, accessibility attributes are present

Test annotations will follow the format:
```typescript
// **Feature: settings-skeleton-loading, Property 1: Skeleton count rendering**
```

### Integration Tests

Integration tests will verify:
- Skeleton displays during loading state
- Skeleton is replaced with content when loading completes
- No layout shift during transition

## Component Specifications

### Color Scheme (matching existing skeletons)

| Element Type | Tailwind Class | Usage |
|-------------|----------------|-------|
| Primary placeholder | bg-neutral-200 | Main content areas (logo, name, buttons) |
| Secondary placeholder | bg-neutral-100 | Supporting content (industry, address) |
| Container animation | animate-pulse | Applied to root container |

### Dimensions (matching actual components)

| Element | Dimensions | Border Radius |
|---------|------------|---------------|
| Company logo | 96x96 | rounded-full |
| Icon container | 40x40 | rounded-lg (8px) |
| Card container | full width | rounded-2xl (16px) |
| Banner | full width × 84px | none (top corners only) |
| Input placeholder | 222px width | rounded-lg |
| Button placeholder | auto width | rounded-lg |

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Settings Page Header (always visible)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ Left Section         │  │ Right Section                │ │
│  │ ┌──────────────────┐ │  │ Office          [input][btn] │ │
│  │ │ Banner (sky-50)  │ │  │                              │ │
│  │ └──────────────────┘ │  │ ┌────────────────────────┐   │ │
│  │ ○ Logo (96x96)       │  │ │ CardOfficeSkeleton 1   │   │ │
│  │ ████ Name            │  │ └────────────────────────┘   │ │
│  │ ███ Industry         │  │ ┌────────────────────────┐   │ │
│  │ 🔗 ███  ✉ ███        │  │ │ CardOfficeSkeleton 2   │   │ │
│  └──────────────────────┘  │ └────────────────────────┘   │ │
│                            │ ┌────────────────────────┐   │ │
│                            │ │ CardOfficeSkeleton 3   │   │ │
│                            │ └────────────────────────┘   │ │
│                            └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```
