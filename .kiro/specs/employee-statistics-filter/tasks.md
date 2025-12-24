# Implementation Plan

- [x] 1. Extend server action to support month/year filtering





  - [x] 1.1 Update `getEmployeeAttendanceStats` function signature to accept optional month and year parameters


    - Add `month?: number` and `year?: number` parameters with defaults to current month/year
    - Update JSDoc documentation
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.2 Implement date range calculation for selected month/year in GMT+7


    - Calculate first day of month (startDate) and last day of month (endDate)
    - Use existing timezone utilities from `lib/utils/timezone.ts`
    - _Requirements: 2.3_
  - [x] 1.3 Update database query to filter by date range

    - Modify Supabase query to use `.gte('date', startDate).lte('date', endDate)`
    - Update periodLabel to reflect selected month/year (e.g., "December 2025")
    - _Requirements: 2.1, 2.2_
  - [ ]* 1.4 Write property test for date filtering timezone boundaries
    - **Property 4: Date filtering uses correct timezone boundaries**
    - **Validates: Requirements 2.3**
  - [ ]* 1.5 Write property test for average hours calculation
    - **Property 2: Average hours calculation correctness**
    - **Validates: Requirements 2.1**
  - [ ]* 1.6 Write property test for average check-in time calculation
    - **Property 3: Average check-in time calculation correctness**
    - **Validates: Requirements 2.2**

- [x] 2. Create EmptyStatePlaceholder component





  - [x] 2.1 Create `EmptyStatePlaceholder.tsx` component file


    - Accept `month` (string) and `year` (number) props
    - Display message: "No attendance data for {month} {year}"
    - Style consistently with existing empty states in the codebase
    - _Requirements: 3.1, 3.2_
  - [ ]* 2.2 Write unit tests for EmptyStatePlaceholder
    - Test rendering with various month/year combinations
    - Test accessibility attributes
    - _Requirements: 3.1, 3.2_


- [x] 3. Update EmployeeDetailsRightSection for filter state management




  - [x] 3.1 Add state for selected month and year


    - Initialize with current month/year using `useState`
    - Create handler functions for `onMonthChange` and `onYearChange`
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 3.2 Implement statistics re-fetch on filter change

    - Add `useEffect` dependency on `selectedMonth` and `selectedYear`
    - Add separate loading state for statistics (`statsLoading`)
    - Call `getEmployeeAttendanceStats` with month/year parameters
    - _Requirements: 1.4, 2.1, 2.2_
  - [x] 3.3 Pass filter props to StatisticSection component

    - Pass `selectedMonth`, `selectedYear`, `onMonthChange`, `onYearChange` props
    - _Requirements: 1.1, 1.2_
  - [x] 3.4 Integrate EmptyStatePlaceholder for no-data scenarios

    - Check if `stats` is null or has no data after fetch
    - Render EmptyStatePlaceholder instead of StatisticSection when empty
    - Ensure dropdowns remain visible and functional
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 3.5 Write property test for filter selection triggering fetch
    - **Property 1: Filter selection triggers data fetch with correct parameters**
    - **Validates: Requirements 1.1, 1.2**

- [ ] 4. Checkpoint - Make sure all tests are passing
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 5. Write property test for serialization round-trip
  - [ ]* 5.1 Write property test for statistics serialization
    - **Property 5: Statistics serialization round-trip**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
    - Generate random EmployeeAttendanceStats objects
    - Serialize to JSON and deserialize back
    - Verify all fields are preserved correctly


- [x] 6. Final Checkpoint - Make sure all tests are passing




  - Ensure all tests pass, ask the user if questions arise.

