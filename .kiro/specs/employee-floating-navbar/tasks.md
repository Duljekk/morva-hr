# Implementation Plan: Employee Floating Navbar

## Overview

This plan implements a floating navigation bar for the employee side of MorvaHR, replacing the existing bottom navigation with a modern pill-shaped design matching the Figma specifications.

## Tasks

- [x] 1. Create navigation icon components
  - [x] 1.1 Create HomeIcon component with active/inactive states
    - Create `components/icons/employee/HomeIcon.tsx`
    - Implement house/home-door SVG icon matching Figma design
    - Support `active` prop for color switching (white when active, neutral-500 when inactive)
    - _Requirements: 2.2, 3.1, 3.2_
  - [x] 1.2 Create AttendanceIcon component with active/inactive states
    - Create `components/icons/employee/AttendanceIcon.tsx`
    - Implement calendar-days SVG icon matching Figma design
    - Support `active` prop for color switching
    - _Requirements: 2.3, 3.1, 3.2_
  - [x] 1.3 Create PayslipIcon component with active/inactive states
    - Create `components/icons/employee/PayslipIcon.tsx`
    - Implement receipt-bill SVG icon matching Figma design
    - Support `active` prop for color switching
    - _Requirements: 2.4, 3.1, 3.2_
  - [x] 1.4 Create ProfileIcon component with active/inactive states
    - Create `components/icons/employee/ProfileIcon.tsx`
    - Implement person/avatar SVG icon matching Figma design
    - Support `active` prop for color switching
    - _Requirements: 2.5, 3.1, 3.2_

- [x] 2. Implement FloatingNavbar component
  - [x] 2.1 Create FloatingNavbar component structure
    - Create `components/employee/FloatingNavbar.tsx`
    - Implement pill-shaped container with dark background (bg-neutral-900)
    - Apply rounded-full (60px radius), padding 8px, gap 12px
    - Position fixed at bottom center with appropriate z-index
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 5.4_
  - [x] 2.2 Implement navigation items with touch targets
    - Create 40x40px touch target containers for each nav item
    - Center 24x24px icons within touch targets
    - Add semantic nav wrapper and accessible labels
    - _Requirements: 2.1, 2.6, 5.1, 5.2_
  - [x] 2.3 Implement active state detection and styling
    - Use `usePathname` hook to detect current route
    - Apply active/inactive states to icons based on current route
    - Add aria-current="page" to active navigation item
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.3_
  - [x] 2.4 Implement navigation functionality
    - Use Next.js Link component for client-side navigation
    - Configure routes: /, /attendance, /payslip, /profile
    - Ensure navbar remains visible during navigation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 3. Update route configuration
  - [x] 3.1 Add floating navbar routes to routes.tsx
    - Add `employeeFloatingNavRoutes` array with new route configuration
    - Include path, label, icon component, and exact matching flag
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Integrate FloatingNavbar into employee layout
  - [x] 4.1 Update employee layout to use FloatingNavbar
    - Import and render FloatingNavbar in `app/(employee)/layout.tsx`
    - Remove or replace existing EmployeeNav component usage
    - Ensure proper bottom padding on page content to avoid overlap
    - _Requirements: 1.6, 6.3_

- [x] 5. Checkpoint - Verify implementation
  - Ensure all navigation items render correctly
  - Verify active state updates on navigation
  - Test accessibility attributes
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 6. Write property tests for FloatingNavbar
  - [ ]* 6.1 Write property test for single active item invariant
    - **Property 3: Single Active Item Invariant**
    - **Validates: Requirements 3.4**
  - [ ]* 6.2 Write property test for accessibility label presence
    - **Property 5: Accessibility Label Presence**
    - **Validates: Requirements 5.2**
  - [ ]* 6.3 Write property test for active item accessibility attribute
    - **Property 6: Active Item Accessibility Attribute**
    - **Validates: Requirements 5.3**

- [x] 7. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The implementation uses TypeScript and follows existing codebase patterns
- Icons are implemented as inline SVG components for reliability
- The component integrates with Next.js App Router for client-side navigation
