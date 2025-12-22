# Auto Check-Out Feature

## Overview

The Auto Check-Out feature automatically processes forgotten check-outs for employees who checked in but forgot to check out. This ensures accurate attendance records without manual intervention.

**Key Change**: Auto check-out now processes on the **same day** at `shift_end_hour + 1`, not the next day.

## How It Works

1. **Hourly Execution**: A PostgreSQL function runs **every hour** at minute 0
2. **Same-Day Processing**: 
   - Checks if current hour >= `shift_end_hour + 1` for each employee
   - Only processes records from **today** where employee hasn't checked out
3. **Check-Out Time Calculation**:
   - Check-out time = `shift_end_hour + 1 hour` on the **same day**
   - Example: If shift ends at 19:00, auto check-out is set to 20:00 on the same day
4. **Status**: All auto check-outs are marked as `'overtime'` status

## Example Timeline

| Time (Asia/Jakarta) | Event |
|---------------------|-------|
| 11:00 | Employee checks in |
| 19:00 | Shift ends (shift_end_hour = 19) |
| 20:00 | Cron job runs, detects current_hour (20) >= shift_end_hour + 1 (20) |
| 20:00 | Auto check-out triggered, sets check_out_time to 20:00 same day |

## Technical Implementation

### Database Components

| Component | Description |
|-----------|-------------|
| `pg_cron` extension | PostgreSQL job scheduler |
| `auto_checkout_forgotten_records()` | Function that processes same-day forgotten check-outs |
| `auto-checkout-hourly` cron job | Scheduled job running every hour at minute 0 |

### Migration Files

```
database/migrations/
├── 20251222_100000_enable_pg_cron_extension.sql
├── 20251222_100100_create_auto_checkout_function.sql
└── 20251222_100200_schedule_auto_checkout_cron.sql
```

### Function Logic

```sql
-- Processes records where:
-- 1. check_in_time IS NOT NULL (employee checked in)
-- 2. check_out_time IS NULL (employee hasn't checked out)
-- 3. date = TODAY (same day processing)
-- 4. current_hour >= shift_end_hour + 1 (time has passed)
-- 5. user is_active = TRUE
```

## Manual Operations

### Run Function Manually

```sql
-- Execute the auto check-out function manually
SELECT * FROM auto_checkout_forgotten_records();
```

Returns:
- `processed_count`: Number of records processed
- `user_ids`: Array of user IDs that were auto checked-out
- `errors`: Array of any errors encountered

### Check Pending Auto Check-Outs

```sql
-- See which employees will be auto checked-out and when
SELECT 
    u.full_name,
    ar.date,
    ar.check_in_time AT TIME ZONE 'Asia/Jakarta' as check_in_local,
    u.shift_end_hour,
    (u.shift_end_hour + 1) as auto_checkout_hour,
    EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta')) as current_hour,
    CASE 
        WHEN EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta')) >= (u.shift_end_hour + 1) 
        THEN 'ELIGIBLE NOW'
        ELSE 'Pending (wait until hour ' || (u.shift_end_hour + 1) || ')'
    END as status
FROM attendance_records ar
JOIN users u ON ar.user_id = u.id
WHERE ar.date = (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE
  AND ar.check_in_time IS NOT NULL
  AND ar.check_out_time IS NULL
  AND u.is_active = TRUE;
```

### Check Cron Job Status

```sql
-- View the scheduled cron job
SELECT jobid, jobname, schedule, command, active 
FROM cron.job 
WHERE jobname = 'auto-checkout-hourly';

-- View recent job executions
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

### View Auto Check-Out Records

```sql
-- Find records that were auto checked-out today
SELECT 
    ar.id,
    u.full_name,
    ar.date,
    ar.check_in_time AT TIME ZONE 'Asia/Jakarta' as check_in_local,
    ar.check_out_time AT TIME ZONE 'Asia/Jakarta' as check_out_local,
    ar.check_out_status,
    ar.total_hours,
    ar.overtime_hours,
    ar.updated_at
FROM attendance_records ar
JOIN users u ON ar.user_id = u.id
WHERE ar.check_out_status = 'overtime'
  AND DATE(ar.updated_at AT TIME ZONE 'Asia/Jakarta') = CURRENT_DATE
ORDER BY ar.updated_at DESC;
```

### Pause/Resume Cron Job

```sql
-- Pause the job (set inactive)
UPDATE cron.job SET active = false WHERE jobname = 'auto-checkout-hourly';

-- Resume the job (set active)
UPDATE cron.job SET active = true WHERE jobname = 'auto-checkout-hourly';

-- Completely remove the job
SELECT cron.unschedule('auto-checkout-hourly');
```

## Monitoring

### Check pg_cron Scheduler Status

```sql
-- Verify pg_cron scheduler is running
SELECT pid, usename, application_name, state
FROM pg_stat_activity 
WHERE application_name ILIKE 'pg_cron scheduler';
```

### Check for Failed Jobs

```sql
-- Find failed cron job runs
SELECT *
FROM cron.job_run_details
WHERE status <> 'succeeded' AND status <> 'running'
  AND start_time > NOW() - INTERVAL '7 days'
ORDER BY start_time DESC;
```

## Troubleshooting

### Cron Job Not Running

1. **Check if pg_cron scheduler is active**:
   ```sql
   SELECT * FROM pg_stat_activity 
   WHERE application_name ILIKE 'pg_cron scheduler';
   ```
   If no rows returned, restart the database from Supabase Dashboard.

2. **Check if job exists and is active**:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'auto-checkout-hourly';
   ```

3. **Check job run history for errors**:
   ```sql
   SELECT * FROM cron.job_run_details 
   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'auto-checkout-hourly')
   ORDER BY start_time DESC LIMIT 5;
   ```

### Function Not Processing Records

1. **Verify current time and eligible records**:
   ```sql
   SELECT 
       NOW() AT TIME ZONE 'Asia/Jakarta' as current_time,
       EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta')) as current_hour;
   ```

2. **Check if records meet criteria**:
   ```sql
   SELECT ar.*, u.shift_end_hour, u.is_active
   FROM attendance_records ar
   JOIN users u ON ar.user_id = u.id
   WHERE ar.date = (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE
     AND ar.check_in_time IS NOT NULL
     AND ar.check_out_time IS NULL;
   ```

## Rollback

To completely remove the auto check-out feature:

```sql
-- 1. Remove the cron job
SELECT cron.unschedule('auto-checkout-hourly');

-- 2. Drop the function
DROP FUNCTION IF EXISTS auto_checkout_forgotten_records();

-- 3. (Optional) Disable pg_cron extension - only if no other jobs exist
-- DROP EXTENSION IF EXISTS pg_cron;
```

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Different shift schedules per employee | Uses each user's `shift_end_hour` from users table |
| Inactive employees | Skipped (only processes `is_active = TRUE`) |
| Database errors during processing | Logs error, continues with other records |
| Function run multiple times same hour | Idempotent - already processed records have check_out_time set |
| Employee checks out before auto check-out | Not processed (check_out_time is already set) |
