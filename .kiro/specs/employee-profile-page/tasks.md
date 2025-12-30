# Implementation Plan: Employee Profile Page

## Overview

This implementation plan creates the Employee Profile Page for the MorvaHR employee app. The page displays user profile information, leave balances with visual indicators, and leave request history. We will reuse existing components (Avatar, RoleBadge, UnifiedBadge, Bar) and extract LeaveBalanceIndicator/LeaveBalanceBadge from the HR side for shared use.

## Tasks

- [x] 1. Extract shared leave balance components
  - [x] 1.1 Create `components/shared/LeaveBalanceIndicator.tsx`
    - Extract LeaveBalanceIndicator from `components/hr/employees/EmployeeTableRow.tsx`
    - Make it a standalone component with proper exports
    - Keep the same logic: 10 bars, proportional fill, color variants
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  - [x] 1.2 Create `components/shared/LeaveBalanceBadge.tsx`
    - Extract LeaveBalanceBadge from `components/hr/employees/EmployeeTableRow.tsx`
    - Make it a standalone component with proper exports
    - Keep the same color logic matching bar variants
    - _Requirements: 3.5_
  - [x] 1.3 Update `components/hr/employees/EmployeeTableRow.tsx`
    - Import the new shared components
    - Remove the inline component definitions
    - Verify HR employees table still works correctly
    - _Requirements: N/A (refactoring)_

- [x] 2. Create profile page structure
  - [x] 2.1 Create `app/(employee)/profile/page.tsx`
    - Server component for data fetching
    - Fetch user profile, leave balances, and leave requests
    - Pass data to ProfilePageClient
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 2.2 Create `app/(employee)/profile/_components/ProfilePageClient.tsx`
    - Main client component orchestrating the layout
    - White background, 24px horizontal padding
    - Bottom padding for floating navbar
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Implement ProfileHeader component
  - [x] 3.1 Create `app/(employee)/profile/_components/ProfileHeader.tsx`
    - Sky-blue banner (bg-sky-50) at top
    - Settings button (30px ghost button) in top-right
    - 96px circular avatar with white border
    - Name (18px semibold), RoleBadge, email with MailIcon
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3_
  - [ ]* 3.2 Write unit tests for ProfileHeader
    - Test avatar rendering with and without image
    - Test settings button click handler
    - Test role badge display
    - _Requirements: 1.1-1.6, 2.1-2.3_

- [x] 4. Implement LeaveBalancesCard component
  - [x] 4.1 Create `app/(employee)/profile/_components/LeaveBalancesCard.tsx`
    - Card with white background, shadow, 10px border radius
    - "Leave Balances" title (16px medium, neutral-600)
    - Display Paid Time Off, Work from Home, Sick Leave
    - Use shared LeaveBalanceIndicator and LeaveBalanceBadge
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 3.7_
  - [ ]* 4.2 Write property test for leave balance display completeness
    - **Property 1: Leave Balance Display Completeness**
    - For any leave balance data, verify all elements render
    - _Requirements: 3.3, 3.4, 3.5_
  - [ ]* 4.3 Write property test for leave balance bar accuracy
    - **Property 2: Leave Balance Bar Accuracy**
    - For any current/total, verify proportional fill
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 5. Implement LeaveRequestsCard component
  - [x] 5.1 Create `app/(employee)/profile/_components/LeaveRequestItem.tsx`
    - Leave type icon (36px, rounded, neutral-100 bg)
    - Leave type name (14px medium, neutral-800)
    - Date range (12px medium, neutral-400)
    - Status badge using UnifiedBadge (Pending: warning, Approved: success)
    - Border bottom except for last item
    - _Requirements: 5.3, 5.4, 5.5, 5.6_
  - [x] 5.2 Create `app/(employee)/profile/_components/LeaveRequestsCard.tsx`
    - Card with white background, shadow, 12px border radius
    - "Leave Requests" title (16px medium, neutral-600)
    - List of LeaveRequestItem components
    - Empty state when no requests
    - _Requirements: 5.1, 5.2, 5.7, 5.8_
  - [ ]* 5.3 Write property test for leave request item completeness
    - **Property 3: Leave Request Item Completeness**
    - For any leave request, verify all elements render with correct styling
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

- [x] 6. Create leave type icons
  - [x] 6.1 Create leave type icon components or use existing SVGs
    - Annual leave icon (calendar with checkmark)
    - Sick leave icon (medical/clipboard)
    - WFH icon (home)
    - Use existing SVGs from `app/assets/icons/` (annual-approved, sick-approved, etc.)
    - _Requirements: 5.3_

- [x] 7. Checkpoint - Ensure all components render correctly
  - Verify profile page displays with mock data
  - Ensure all tests pass
  - Ask the user if questions arise

- [x] 8. Implement data fetching and integration
  - [x] 8.1 Create or update server actions for profile data
    - Fetch current user profile from session
    - Fetch leave balances for the user
    - Fetch leave request history for the user
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 8.2 Add loading states
    - Skeleton components for profile header
    - Skeleton for leave balances card
    - Skeleton for leave requests card
    - _Requirements: 7.4_
  - [x] 8.3 Add error handling
    - Error state with retry button
    - Handle network failures gracefully
    - _Requirements: 7.5_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all property tests
  - Verify page works with real data
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Reusing existing components: Avatar, RoleBadge, UnifiedBadge, Bar, MailIcon
- Extracting shared components: LeaveBalanceIndicator, LeaveBalanceBadge
