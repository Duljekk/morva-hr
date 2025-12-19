---
name: seed-and-display-leave-balances
overview: Seed initial leave quotas for all employees and expose an aggregated total leave balance on the HR employee list page.
todos:
  - id: align-leave-type-ids
    content: Align existing leave type IDs and labels to PTO (annual), Sick (sick), and Work From Home (wfh) across schema and code mappings.
    status: pending
  - id: seed-existing-balances
    content: Create a SQL migration to seed leave_balances rows for all existing employees with 12 PTO, 5 Sick, and 5 WFH for the current year.
    status: pending
    dependencies:
      - align-leave-type-ids
  - id: init-new-user-balances
    content: Implement logic (server action or DB trigger) to initialize leave_balances for each newly created employee with the same quotas.
    status: pending
    dependencies:
      - align-leave-type-ids
  - id: use-leave-balances-api
    content: Update getLeaveBalance and getAllLeaveBalances to read from leave_balances (with optional fallback to leave_types.max_days_per_year).
    status: pending
    dependencies:
      - seed-existing-balances
      - init-new-user-balances
  - id: employee-table-aggregate
    content: Add an HR server action and UI wiring to fetch and display aggregated total leave balance (used/allocated) per employee on the employee table page.
    status: pending
    dependencies:
      - use-leave-balances-api
  - id: test-end-to-end
    content: Test migrations, balance seeding, new-user initialization, and HR table aggregate display across dev/staging environments.
    status: pending
    dependencies:
      - employee-table-aggregate
---

# Seed & Display Leave Balances (PTO/Sick/WFH)

## Goals
- Seed **per-employee yearly leave balances** so every existing employee starts with **12 PTO, 5 Sick, 5 WFH**.
- Ensure future employees are initialized with the same quotas.
- Expose an HR-facing query for the **employee table page** that shows a **total leave balance summary** (e.g. `20/22` used/allocated), aggregating across types.

## 1. Confirm & Align Leave Type IDs
- **Files**: `database/schema.sql`, `database/seed.sql`, `database/migrations/20250107_120100_seed_leave_types.sql`, `lib/actions/employee/leaves.ts`, `lib/actions/shared/attendance.ts`, `lib/actions/hr/dashboard.ts`, `app/(employee)/_components/useDashboardData.ts`.
- **Steps**:
  - Verify that leave types are:
    - `annual` → "Paid Time Off" (PTO)
    - `sick` → "Sick Leave"
    - `wfh` → "Work From Home" (add if missing via migration or manual SQL).
  - Update any hard-coded mappings (e.g. `leaveTypeMap`, casts like `'annual' | 'sick' | 'unpaid'`) to align with these three types and optionally deactivate `unpaid`.

## 2. Decide Source of Quotas (Policy vs Per-User)
- **Files**: `database/schema.sql`, `database/seed.sql`, `lib/actions/employee/leaves.ts`.
- **Approach** (recommended):
  - Treat `leave_types.max_days_per_year` as the **policy default** (12/5/5).
  - Use `leave_balances` as the **ledger**:
    - `allocated`: initial quota per user per year (copied from policy).
    - `used`: sum of approved leave days (updated over time).
    - `balance = allocated - used` (enforced by existing constraint).
- This aligns with Supabase/Postgres best practices: global policy table + per-user balance table.

## 3. Seed Leave Balances for All Existing Employees
- **Files**: new migration, e.g. `database/migrations/[timestamp]_seed_leave_balances_for_existing_users.sql`.
- **Steps**:
  - In SQL migration, for the current year:
    - Insert one `leave_balances` row per `(user_id, leave_type_id)` for all active users:
      - PTO (`annual`): `allocated = 12`, `used = 0`, `balance = 12`.
      - Sick (`sick`): `allocated = 5`, `used = 0`, `balance = 5`.
      - WFH (`wfh`): `allocated = 5`, `used = 0`, `balance = 5`.
    - Use `INSERT ... SELECT` from `users` with `ON CONFLICT (user_id, leave_type_id, year) DO NOTHING` to keep migration idempotent.
  - Optionally parameterize the target year with `EXTRACT(YEAR FROM NOW())` so it works across environments.

```sql
-- Pseudocode shape for migration body (to be adapted exactly in the file)
INSERT INTO leave_balances (user_id, leave_type_id, allocated, used, balance, year)
SELECT u.id, 'annual', 12, 0, 12, EXTRACT(YEAR FROM NOW())::int
FROM users u
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- Repeat for 'sick' (5) and 'wfh' (5)
```

## 4. Initialize Balances for New Employees
- **Files**: `lib/actions/hr/employees.ts` (or wherever HR creates employees/invites), `lib/actions/hr/users.ts` (invite flow), `database/schema.sql` (optional trigger).
- **Approach A (recommended: server action)**:
  - After successfully creating a new user and profile in your HR invite flow (`inviteUserByEmail` or equivalent), call a new server action/helper:
    - `initializeLeaveBalancesForUser(userId: string, year?: number)` which:
      - Inserts rows into `leave_balances` for `annual`, `sick`, `wfh` using the same quotas (12/5/5).
      - Uses `ON CONFLICT` to avoid duplicates.
- **Approach B (DB trigger, optional)**:
  - Add a `AFTER INSERT ON users` trigger in `database/schema.sql` that inserts balances automatically for new users.
- Choose A or B based on your preference for keeping business logic in TypeScript vs SQL.

## 5. Rewire Balance Computation to Use `leave_balances`
- **Files**: `lib/actions/employee/leaves.ts`.
- **Current behavior**: `getLeaveBalance` and `getAllLeaveBalances` compute `used` from `leave_requests` and compare to `leave_types.max_days_per_year`, ignoring `leave_balances`.
- **Target behavior**:
  - Update these functions to:
    - Read `allocated`, `used`, and `balance` from `leave_balances` (for the current year and current user).
    - Optionally still fall back to `max_days_per_year` to derive `allocated` if a balance row is missing.
  - This keeps a single source of truth for balances and makes the planned employee-table total query straightforward.

## 6. Enforce or Respect Balances on Submission (Optional but Recommended)
- **Files**: `lib/actions/employee/leaves.ts` (`submitLeaveRequest`).
- **Steps**:
  - Replace the current "Skipping balance check" behavior with:
    - Lookup the user’s `leave_balances` row for the requested `leave_type_id` and current year.
    - If `total_days` requested would exceed `balance`, return a validation error.
    - On approval, update `leave_balances.used` and `balance` accordingly (either here or in HR approval action).
- This step is optional for your plan, but consider at least **reading** from `leave_balances` to keep the UI consistent.

## 7. Aggregated Total Leave Balance for Employee Table Page

### 7.1 Design the Aggregate
- **Definition** for the employee table:
  - **Allocated total**: sum of `allocated` across PTO, Sick, WFH.
  - **Used total**: sum of `used` across those types.
  - Display as `used/allocated` (e.g. `20/22`).

### 7.2 Server Action to Fetch Totals
- **Files**: `lib/actions/hr/employees.ts` (or a new HR-specific listing action), `lib/actions/hr/employeeDetails.ts` (if you want to reuse logic).
- **Steps**:
  - Add a server action, e.g. `getEmployeeLeaveSummaryForTable` or fold into an existing `getEmployees`/`getAllEmployees` action:
    - `SELECT` from `users` with a `LEFT JOIN` on `leave_balances` for the current year.
    - `GROUP BY users.id, users.full_name, ...` and compute:
      - `SUM(lb.allocated) AS total_allocated`
      - `SUM(lb.used) AS total_used`
    - Restrict to `leave_type_id IN ('annual','sick','wfh')`.
  - Return a shape like:

```ts
{
  id: string;
  full_name: string;
  totalLeaveAllocated: number; // e.g. 22
  totalLeaveUsed: number;      // e.g. 20
}
```

- Optionally, use `unstable_cache` with a tag like `'leave-balances'` for performance.

### 7.3 Wire Up Employee Table UI
- **Files**: HR employee list component (e.g. `[some]/EmployeeTable.tsx` or `components/hr/employees/EmployeesTable.tsx`).
- **Steps**:
  - Extend the data fetch on the HR employee page to call the new server action instead of (or in addition to) the existing employee list action.
  - Add a **"Leave Balance"** column that renders `"{totalLeaveUsed}/{totalLeaveAllocated}"`.
  - Handle edge cases where a user might have no balance rows (show `0/0` or `"--"`).

## 8. Testing & Validation
- **Database-level**:
  - Run the new migration and confirm `leave_balances` has one row per user per leave type and correct year.
  - Spot-check a few employees to ensure `allocated = 12/5/5` and `used = 0` initially.
- **Backend-level**:
  - Test `getAllLeaveBalances` for a user and confirm it reads from `leave_balances` and matches the seeded values.
  - Create a leave request and (optionally) simulate approval, then confirm `used` and `balance` in `leave_balances` update as expected.
- **UI-level**:
  - On the HR employee table page, verify that:
    - Every row shows the aggregated total (e.g. `0/22` at first).
    - After some approved leaves, values update (e.g. `5/22`).

## 9. Migration & Rollout Considerations
- Ensure migrations are **idempotent** (use `ON CONFLICT` on `leave_balances` unique constraint) and safe to run in all environments.
- If you already have historical approved leaves, decide whether to **backfill `used`** based on past `leave_requests` or start tracking from now (the plan above assumes starting from now with `used = 0`).
- Document the year rollover strategy (e.g. at each new year, run a migration or script to insert new `