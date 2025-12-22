---
name: Auto Check-Out Implementation
overview: Implement automated check-out for employees who forget to check out, using a PostgreSQL function scheduled with pg_cron. The function runs HOURLY and auto check-outs employees at shift_end_hour + 1 hour on the SAME DAY as their check-in.
todos:
  - id: enable-pg-cron
    content: Create migration to enable pg_cron extension with proper permissions
    status: completed
  - id: create-auto-checkout-function
    content: Create PostgreSQL function auto_checkout_forgotten_records() with same-day processing logic
    status: completed
    dependencies:
      - enable-pg-cron
  - id: schedule-cron-job
    content: Schedule cron job to run function HOURLY for same-day processing
    status: completed
    dependencies:
      - create-auto-checkout-function
  - id: test-function-manually
    content: Test function manually with test data to verify correct behavior
    status: completed
    dependencies:
      - create-auto-checkout-function
  - id: verify-cron-execution
    content: Monitor first few cron job executions to ensure correct scheduling and processing
    status: in-progress
    dependencies:
      - schedule-cron-job
  - id: add-documentation
    content: Document feature behavior, manual trigger steps, monitoring queries, and troubleshooting guide
    status: completed
    dependencies:
      - schedule-cron-job
---

# Auto Check-Out Feature Implementation

## Overview

Implement an automated check-out system that processes forgotten check-outs on the **SAME DAY**. Employees who checked in but forgot to check out will be automatically checked out at `shift_end_hour + 1 hour` on the same day as their check-in, ensuring accurate attendance records.

## Architecture

The implementation uses:

- **PostgreSQL Function**: `auto_checkout_forgotten_records()` - Processes same-day forgotten check-outs
- **pg_cron Extension**: Schedules **HOURLY** execution to check for eligible records
- **Timezone-Safe Logic**: Uses `AT TIME ZONE 'Asia/Jakarta'` for accurate date/time calculations

## Key Change: Same-Day Processing

**Previous Logic (REMOVED):**

- Ran once daily at 00:30 AM
- Processed yesterday's forgotten check-outs

**New Logic (IMPLEMENTED):**

- Runs **every hour** at minute 0
- Processes **today's** forgotten check-outs
- Triggers when `current_hour >= shift_end_hour + 1`

## Implementation Phases

### Phase 1: Enable pg_cron Extension ✅

**File**: `database/migrations/20251222_100000_enable_pg_cron_extension.sql`

### Phase 2: Create Auto Check-Out Function ✅

**File**: `database/migrations/20251222_100100_create_auto_checkout_function.sql`**Core Logic:**

1. **Get Today's Date and Current Hour** in Asia/Jakarta timezone
2. **Find Eligible Records** where:

- `check_in_time IS NOT NULL`
- `check_out_time IS NULL`
- `date = TODAY`
- `current_hour >= shift_end_hour + 1`
- User is active (`is_active = true`)

3. **Calculate Check-Out Time**: `shift_end_hour + 1` on the same day

### Phase 3: Schedule Hourly Cron Job ✅

**File**: `database/migrations/20251222_100200_schedule_auto_checkout_cron.sql`**Cron Schedule:**

- Expression: `0 * * * *` (every hour at minute 0)
- Job Name: `auto-checkout-hourly`

### Phase 4: Documentation ✅

**File**: `docs/AUTO_CHECKOUT_FEATURE.md`

## Example Timeline

| Time (Asia/Jakarta) | Event ||---------------------|-------|| 11:00 | Employee checks in || 19:00 | Shift ends (shift_end_hour = 19) || 20:00 | Cron runs, current_hour (20) >= shift_end_hour + 1 (20) ✓ || 20:00 | Auto check-out triggered, sets check_out_time to 20:00 |

## Verification Queries

```sql
-- Check pending auto check-outs
SELECT 
    u.full_name,
    ar.date,
    u.shift_end_hour,
    (u.shift_end_hour + 1) as auto_checkout_hour,
    EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta')) as current_hour
FROM attendance_records ar
JOIN users u ON ar.user_id = u.id
WHERE ar.date = (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE
  AND ar.check_in_time IS NOT NULL
  AND ar.check_out_time IS NULL;

-- Check cron job status
SELECT * FROM cron.job WHERE jobname = 'auto-checkout-hourly';

-- Test function manually
SELECT * FROM auto_checkout_forgotten_records();
```



## Rollback

```sql
SELECT cron.unschedule('auto-checkout-hourly');
DROP FUNCTION IF EXISTS auto_checkout_forgotten_records();


```