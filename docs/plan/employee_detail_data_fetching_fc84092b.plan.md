---
name: Employee Detail Data Fetching
overview: Implement secure, server-side data fetching for the HR employee detail page, pulling a single employee's profile and related stats from Supabase and wiring it into the existing EmployeeDetails UI components.
todos:
  - id: define-detail-contract
    content: Clarify which fields from users, leave_balances, and attendance_records are needed to populate EmployeeDetailsLeftSection and later statistics
    status: pending
  - id: create-detail-action
    content: Create lib/actions/hr/employeeDetails.ts with getEmployeeDetailsById(id) using requireHRAdmin and Supabase queries
    status: pending
    dependencies:
      - define-detail-contract
  - id: create-detail-transform-utils
    content: Create lib/utils/employeeDetailTransform.ts to map users rows and optional stats into EmployeeLeftSectionData
    status: pending
    dependencies:
      - define-detail-contract
  - id: wire-detail-page
    content: Update app/(admin)/admin/employees/[id]/page.tsx to be a proper server component that calls getEmployeeDetailsById and renders the left/right sections
    status: pending
    dependencies:
      - create-detail-action
      - create-detail-transform-utils
  - id: export-detail-action
    content: Export getEmployeeDetailsById from lib/actions/hr/index.ts (if present) for consistent imports
    status: pending
    dependencies:
      - create-detail-action
  - id: optional-activities-phase
    content: Design follow-up actions to replace mocked stats and activity groups in EmployeeDetailsRightSection with real data
    status: pending
    dependencies:
      - wire-detail-page
  - id: test-detail-flow
    content: Manually test HR employee detail flow for valid, invalid, and edge-case data, ensuring RLS and formatting behave correctly
    status: pending
    dependencies:
      - wire-detail-page
---

# Employee Detail Data Fetching - Implementation Plan

## Overview

Implement secure, server-side data fetching for the HR employee detail page in the App Router. The page at `/admin/employees/[id] `will load a single employee's profile from Supabase (and related statistics later), then pass typed data into the existing `EmployeeDetailsLeftSection` and `EmployeeDetailsRightSection` components.

## High-Level Flow

```mermaid
graph TD
  A[EmployeeDetailPage /admin/employees/[id]] -->|params.id| B[getEmployeeById server action]
  B -->|requireHRAdmin| C[Supabase (RLS-protected)]
  C -->|Query| D[users table]
  C -->|Optional| E[leave_balances, attendance_records]
  D -->|Transform| F[EmployeeLeftSectionData]
  E -->|Aggregate| G[Detail Stats & Activities]
  F -->|props| H[EmployeeDetailsLeftSection]
  G -->|props| I[EmployeeDetailsRightSection]
```

## Phase 1: Define the Employee Detail Fetching Contract

**Goal**: Clearly define what the detail page needs from the database.

- **Primary source table**: `users`
  - Use core profile + employment fields: `id, email, full_name, profile_picture_url, employment_type, birthdate, salary, contract_start_date, contract_end_date, is_active`.
- **Left section mapping** (`EmployeeLeftSectionData` in `components/hr/employee/EmployeeDetailsLeftSection.tsx`):
  - `name`  `full_name`
  - `email`  `email`
  - `imageUrl`  `profile_picture_url`
  - `role` (UI badge)  map from `employment_type` or `role` enum
  - `birthDate`  formatted `birthdate` (e.g. "10 December, 2001")
  - `salary`  formatted `salary` (e.g. `IDR 6.500.000`)
  - `leaveBalance`  aggregate from `leave_balances` or computed fallback
  - `contractPeriod`  formatted `contract_start_date` + `contract_end_date`
  - `bankDetails`  initially mock or later from a dedicated table/columns
- **Right section (phase 2/optional)**:
  - `employeeId` already accepted by `EmployeeDetailsRightSection`.
  - Future enhancement: fetch per-employee stats from `attendance_records` and `leave_requests`.

## Phase 2: Create a Server Action for Employee Detail

**New file**: `lib/actions/hr/employeeDetails.ts`

Implement a **server-only** function `getEmployeeDetailsById(id: string)` that:

- Uses `requireHRAdmin()` from `lib/auth/server.ts` to enforce HR-only access (best practice for RLS + role gating).
- Uses the authenticated Supabase client from `requireHRAdmin()` (so RLS is applied correctly).
- Queries the `users` table:
  - Filter: `.eq('id', id).eq('is_active', true).limit(1).single()`
  - Select fields: `id, email, full_name, profile_picture_url, role, employment_type, birthdate, salary, contract_start_date, contract_end_date`.
- Optionally, in the same action, query supporting tables in parallel using `Promise.all` for performance (based on Supabase best practices):
  - `leave_balances` for current year per user (sum `allocated`, `used`, or `balance`).
  - `attendance_records` to derive a high-level status (last check-in/out, etc.) for future use.
- Returns a typed result, e.g.:
  - `type EmployeeDetailsResult = { leftSection: EmployeeLeftSectionData; /* later: stats, activities */ }`.
  - Or `{ data?: EmployeeDetailsResult; error?: string }` for graceful error handling.

**Error handling & RLS considerations** (from Supabase/Next.js docs):

- If the `users` query returns `null` (no row or blocked by RLS), treat as **not found** at the page level.
- If Supabase returns an error, log contextual details (user id, requested employee id) and propagate a generic error string.

## Phase 3: Add Transformation Utilities

**New file**: `lib/utils/employeeDetailTransform.ts`

Create pure utility functions to convert raw DB rows into `EmployeeLeftSectionData`:

- `mapEmploymentTypeToRoleBadge(type: 'intern' | 'full_time' | 'part_time' | 'contractor' | null | undefined): RoleBadgeVariant`
  - Map to existing badge variants used elsewhere (`'Intern'`, `'Full-time'`, etc.).
- `formatBirthDate(date: string | null): string`
  - Use Intl.DateTimeFormat or a small helper to format as `"10 December, 2001"`.
- `formatCurrencyIDR(amount: number | null): string`
  - Format salary, default to `"-"` if null.
- `formatContractPeriod(start: string | null, end: string | null): string`
  - Examples: `"8 Sep - 8 Dec 2025"`, `"Permanent"` if no end date, `"-"` if data missing.
- `buildDefaultLeaveBalance(): { current: number; total: number }`
  - Simple default (e.g., `{ current: 0, total: 10 }`) until a real leave-balance integration is wired.
- `toEmployeeLeftSectionData(userRow, leaveBalance?): EmployeeLeftSectionData`
  - Single function that consumes a typed `users` row (+ optional leave stats) and produces the exact shape required by `EmployeeDetailsLeftSection`.

This keeps the server action lean and makes UI mappings reusable in tests or other server components.

## Phase 4: Wire the Detail Page as a Server Component

**File**: `app/(admin)/admin/employees/[id]/page.tsx`

Replace the placeholder implementation with a full **server component** using the new server action:

- Keep the route signature but simplify `params` typing to standard App Router style:
  - `export default async function EmployeeDetailPage({ params }: { params: { id: string } }) { ... }`
- Inside the component:

  1. Read `const { id } = await params;` (or directly `params.id` if not async).
  2. Call `const result = await getEmployeeDetailsById(id);`.
  3. If `result.error` or `!result.data`, call `notFound()` from `next/navigation` or render a friendly error state.
  4. Render a layout that composes left and right sections:

     - Left: `<EmployeeDetailsLeftSection employee={result.data.leftSection} />`
     - Right: `<EmployeeDetailsRightSection employeeId={id} />` (still using mock stats initially).
- Consider setting `export const revalidate = 0;` or `dynamic = 'force-dynamic'` if detail pages must always reflect latest DB state; otherwise, you can allow caching.

This follows Next.js + Supabase recommendations: do authenticated data fetching in server components, and pass only the needed props into client components.

## Phase 5: (Optional) Implement Real Stats & Activity Feed

**Goal**: Replace mocks in `EmployeeDetailsRightSection` with real per-employee data.

- Add new server action functions in `lib/actions/hr/employeeActivities.ts`, e.g.:
  - `getEmployeeAttendanceStats(id: string)` to compute average check-in time and total hours (from `attendance_records`).
  - `getEmployeeActivityTimeline(id: string)` to build the `ActivityGroupData[]` structure used by `EmployeeActivitiesPanel`.
- Use Supabase best practices from the docs for **SSR with RLS**:
  - Always use an authenticated server client (like `requireHRAdmin()` provides).
  - Restrict queries with `.eq('user_id', id)` and date ranges.
  - Use `Promise.all` for parallel queries to statistics and activities.
- Decide between two integration patterns:

  1. **Server-driven props**: fetch all stats in the page server component and pass them as props to `EmployeeDetailsRightSection` (converted to accept data props instead of generating mock data).
  2. **Client-side fetch with API route**: expose a small `app/api/hr/employees/[id]/activities/route.ts `handler that calls the server actions, then have the client component fetch via `useEffect`/SWR. (Prefer server-driven props initially for simplicity and security.)

You can defer this phase if the current goal is strictly to show the left profile card with real data.

## Phase 6: Index & Barrel Updates

- If present, update `lib/actions/hr/index.ts` to export `getEmployeeDetailsById` so that imports are consistent, e.g.:
  - `export * from './employeeDetails';`
- Optionally, add a short doc entry under `docs/` (e.g. `docs/employee-detail-data-fetching.md`) explaining the data flow for future maintainers, mirroring this plan.

## Phase 7: Testing Checklist

- [ ] As an HR admin, navigate to `/admin/employees/[id]` for a valid employee and see real profile data rendered in the left section.
- [ ] Visit the page for an invalid or soft-deleted employee id and verify it shows 404 or an appropriate error.
- [ ] Verify that non-HR users cannot access the detail data (RLS + `requireHRAdmin` throw/redirect).
- [ ] Check that date, salary, and contract period formatting match the Figma/UI requirements.
- [ ] Confirm that missing optional fields (no avatar, no end date, no salary) are rendered with sensible defaults.
- [ ] Confirm that the page does not leak any sensitive columns beyond what the UI needs.
- [ ] (If Phase 5 implemented) Verify activity timeline and stats match underlying `attendance_records`/`leave_requests` data.