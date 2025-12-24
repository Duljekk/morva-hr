# Implementation Plan

- [x] 1. Create CardOfficeSkeleton component



  - [x] 1.1 Create CardOfficeSkeleton.tsx with skeleton placeholders matching CardOffice layout
    - Create file at `components/hr/settings/CardOfficeSkeleton.tsx`
    - Include icon container placeholder (40x40, rounded-lg)
    - Include location name placeholder (neutral-200)
    - Include address placeholder (neutral-100)
    - Include radio button placeholder (top-right position)
    - Apply rounded-2xl border-radius and p-5 padding
    - Use memo() for performance optimization
    - Include aria-busy="true" and aria-live="polite" attributes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3_

  - [ ]* 1.2 Write property test for CardOfficeSkeleton accessibility
    - **Property 2: Accessibility attributes presence**
    - **Validates: Requirements 5.2**


- [x] 2. Create SettingsLeftSectionSkeleton component





  - [x] 2.1 Create SettingsLeftSectionSkeleton.tsx with skeleton placeholders matching SettingsLeftSection layout

    - Create file at `components/hr/settings/SettingsLeftSectionSkeleton.tsx`
    - Include banner placeholder (84px height, sky-50 background)
    - Include circular logo placeholder (96x96)
    - Include company name placeholder (neutral-200)
    - Include industry placeholder (neutral-100)
    - Include website link placeholder with icon spacing
    - Include email placeholder with icon spacing
    - Match shadow and border-radius of actual component
    - Use memo() for performance optimization
    - Include aria-busy="true" and aria-live="polite" attributes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3_

  - [ ]* 2.2 Write unit tests for SettingsLeftSectionSkeleton
    - Test component renders without errors
    - Test all placeholder elements are present
    - Test accessibility attributes are applied
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.2_


- [x] 3. Create SettingsRightSectionSkeleton component





  - [x] 3.1 Create SettingsRightSectionSkeleton.tsx with skeleton placeholders matching SettingsRightSection layout

    - Create file at `components/hr/settings/SettingsRightSectionSkeleton.tsx`
    - Include "Office" title as static text (not skeleton)
    - Include input field placeholder (222px width)
    - Include "Add Location" button placeholder
    - Render configurable count of CardOfficeSkeleton components (default: 3)
    - Use memo() for performance optimization
    - Include aria-busy="true" and aria-live="polite" attributes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3_

  - [ ]* 3.2 Write property test for skeleton count rendering
    - **Property 1: Skeleton count rendering**
    - **Validates: Requirements 3.4**



- [x] 4. Update exports and integrate with SettingsPageClient




  - [x] 4.1 Export skeleton components from settings index.ts

    - Add exports for CardOfficeSkeleton, SettingsLeftSectionSkeleton, SettingsRightSectionSkeleton
    - _Requirements: 5.4_


  - [x] 4.2 Update SettingsPageClient to use skeleton components

    - Replace inline loading spinner with SettingsLeftSectionSkeleton and SettingsRightSectionSkeleton
    - Use existing isLoadingLocations state to toggle between skeleton and content
    - Ensure no layout shift during transition
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 5. Final Checkpoint - Make sure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
