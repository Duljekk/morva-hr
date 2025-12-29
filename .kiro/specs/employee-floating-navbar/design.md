# Design Document: Employee Floating Navbar

## Overview

This document describes the technical design for implementing a floating navigation bar component for the employee side of the MorvaHR application. The component replaces the existing bottom navigation with a modern, pill-shaped floating navbar that provides navigation to four key sections: Home, Attendance, Payslip, and Profile.

The design follows the Figma specifications and integrates with the existing Next.js App Router navigation patterns used in the codebase.

## Architecture

The floating navbar follows a client-side component architecture that:
1. Uses Next.js `usePathname` hook for route detection
2. Leverages the existing route configuration system in `lib/navigation/routes.tsx`
3. Implements accessible navigation with proper ARIA attributes
4. Uses CSS-in-JS via Tailwind classes for styling

```
┌─────────────────────────────────────────────────────────────┐
│                    Employee Layout                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   Page Content                        │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│           ┌─────────────────────────────┐                   │
│           │    FloatingNavbar           │                   │
│           │  ┌────┬────┬────┬────┐      │                   │
│           │  │ 🏠 │ 📅 │ 📄 │ 👤 │      │                   │
│           │  └────┴────┴────┴────┘      │                   │
│           └─────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### FloatingNavbar Component

```typescript
// components/employee/FloatingNavbar.tsx

interface FloatingNavbarProps {
  /** Optional override for current path (useful for testing) */
  currentPath?: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; active?: boolean }>;
  exact?: boolean;
}
```

### Icon Components

New icon components will be created to match the Figma design:

```typescript
// components/icons/employee/HomeIcon.tsx
interface IconProps {
  className?: string;
  active?: boolean;
}

// Icons needed:
// - HomeIcon (home-door, house)
// - AttendanceIcon (calendar-days) 
// - PayslipIcon (receipt-bill)
// - ProfileIcon (person, avatar)
```

### Route Configuration Update

```typescript
// lib/navigation/routes.tsx - Updated employee routes

export const employeeFloatingNavRoutes: NavItem[] = [
  { path: '/', label: 'Home', icon: HomeIcon, exact: true },
  { path: '/attendance', label: 'Attendance', icon: AttendanceIcon },
  { path: '/payslip', label: 'Payslip', icon: PayslipIcon },
  { path: '/profile', label: 'Profile', icon: ProfileIcon },
];
```

## Data Models

No database changes required. The component uses client-side routing state only.

### Navigation State

```typescript
interface NavigationState {
  currentPath: string;
  activeIndex: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Navigation Item Sizing Consistency

*For any* Navigation_Item in the Floating_Navbar, the touch target SHALL be exactly 40x40px and contain an icon of exactly 24x24px.

**Validates: Requirements 2.1**

### Property 2: Active State Color Correctness

*For any* route in the application, the Navigation_Item corresponding to that route SHALL display with white (#FFFFFF) icon color, and all other Navigation_Items SHALL display with neutral-500 (#525252) icon color.

**Validates: Requirements 3.1, 3.2**

### Property 3: Single Active Item Invariant

*For any* state of the Floating_Navbar, exactly one Navigation_Item SHALL have the Active_State at any given time.

**Validates: Requirements 3.4**

### Property 4: Active State Synchronization

*For any* navigation event, the Active_State SHALL immediately update to reflect the new current route.

**Validates: Requirements 3.3, 4.5**

### Property 5: Accessibility Label Presence

*For any* Navigation_Item, there SHALL exist an accessible label (aria-label or visible text) describing the destination.

**Validates: Requirements 5.2**

### Property 6: Active Item Accessibility Attribute

*For any* Navigation_Item in Active_State, the element SHALL have aria-current="page" attribute set.

**Validates: Requirements 5.3**

### Property 7: Responsive Centering

*For any* viewport width, the Floating_Navbar SHALL remain horizontally centered within the viewport.

**Validates: Requirements 6.1**

## Error Handling

### Route Not Found
- If the current path doesn't match any navigation item, no item will show active state
- The navbar remains functional and visible

### Icon Loading Failure
- Icons are inline SVG components, eliminating external loading failures
- Fallback: empty container maintains layout

## Testing Strategy

### Unit Tests
- Verify component renders with correct structure
- Verify each navigation item is present with correct icon
- Verify correct styling classes are applied
- Test accessibility attributes are present

### Property-Based Tests
Using a property-based testing library (e.g., fast-check):

1. **Property 1**: Generate random navigation items, verify all have consistent 40x40px touch targets
2. **Property 2**: Generate random routes, verify active/inactive color states
3. **Property 3**: For any rendered state, count active items equals exactly 1
4. **Property 5**: For all navigation items, verify accessible label exists
5. **Property 6**: For active items, verify aria-current="page" is set

### Integration Tests
- Test navigation between routes updates active state
- Test navbar persists across page transitions
- Test responsive behavior at different viewport widths

### Visual Regression Tests
- Capture screenshots at key breakpoints
- Compare against Figma design specifications
