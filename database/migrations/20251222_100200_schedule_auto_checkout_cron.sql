-- ============================================================================
-- Migration: Schedule Auto Check-Out Cron Job
-- Description: Schedules the auto_checkout_forgotten_records() function to run
--              HOURLY to process same-day forgotten check-outs
-- Date: 2025-12-22
-- ============================================================================

-- Remove existing job if it exists (for idempotency)
SELECT cron.unschedule('auto-checkout-daily')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'auto-checkout-daily'
);

SELECT cron.unschedule('auto-checkout-hourly')
WHERE EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'auto-checkout-hourly'
);

-- Schedule the auto check-out function to run HOURLY
-- This allows same-day processing when shift_end_hour + 1 has passed
-- Cron expression: '0 * * * *' = At minute 0 of every hour
SELECT cron.schedule(
    'auto-checkout-hourly',          -- Job name
    '0 * * * *',                     -- Every hour at minute 0
    'SELECT auto_checkout_forgotten_records();'  -- SQL command to execute
);

-- Verify job creation
DO $$
DECLARE
    v_job_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_job_count
    FROM cron.job 
    WHERE jobname = 'auto-checkout-hourly';
    
    IF v_job_count = 0 THEN
        RAISE EXCEPTION 'Failed to create auto-checkout-hourly cron job';
    END IF;
    
    RAISE NOTICE 'auto-checkout-hourly cron job created successfully';
    RAISE NOTICE 'Schedule: Every hour at minute 0';
    RAISE NOTICE 'Processes same-day forgotten check-outs when current_hour >= shift_end_hour + 1';
END $$;
