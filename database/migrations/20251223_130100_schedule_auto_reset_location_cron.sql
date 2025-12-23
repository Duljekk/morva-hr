-- ============================================================================
-- Migration: Schedule Auto Reset Location Cron Job
-- Description: Schedules the auto_reset_location_to_primary() function to run
--              DAILY at 20:00 Asia/Jakarta timezone (13:00 UTC) to reset the
--              selected location back to the primary/Office location.
-- Date: 2025-12-23
-- Timezone: Asia/Jakarta (UTC+7)
-- ============================================================================

-- Remove existing job if it exists (for idempotency)
SELECT cron.unschedule('auto-reset-location-daily')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'auto-reset-location-daily'
);

-- Schedule the auto reset location function to run DAILY at 20:00 Asia/Jakarta
-- Cron expression: '0 13 * * *' = At 13:00 UTC = 20:00 Asia/Jakarta (UTC+7)
-- This resets the location at the end of the business day
SELECT cron.schedule(
    'auto-reset-location-daily',     -- Job name
    '0 13 * * *',                    -- Daily at 13:00 UTC (20:00 Asia/Jakarta)
    'SELECT auto_reset_location_to_primary();'  -- SQL command to execute
);

-- Verify job creation
DO $$
DECLARE
    v_job_count INTEGER;
    v_job_schedule TEXT;
BEGIN
    SELECT COUNT(*), MAX(schedule) INTO v_job_count, v_job_schedule
    FROM cron.job 
    WHERE jobname = 'auto-reset-location-daily';
    
    IF v_job_count = 0 THEN
        RAISE EXCEPTION 'Failed to create auto-reset-location-daily cron job';
    END IF;
    
    RAISE NOTICE 'auto-reset-location-daily cron job created successfully';
    RAISE NOTICE 'Schedule: % (13:00 UTC = 20:00 Asia/Jakarta)', v_job_schedule;
    RAISE NOTICE 'Purpose: Resets selected location to primary/Office at end of each business day';
END $$;
