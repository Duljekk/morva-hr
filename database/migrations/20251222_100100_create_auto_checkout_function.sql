-- ============================================================================
-- Migration: Create Auto Check-Out Function
-- Description: Creates the auto_checkout_forgotten_records() function that
--              processes forgotten check-outs for employees who checked in
--              but forgot to check out. Processes SAME DAY at shift_end_hour + 1.
-- Date: 2025-12-22
-- Timezone: Asia/Jakarta (UTC+7)
-- ============================================================================

-- Drop existing function if exists (for idempotency)
DROP FUNCTION IF EXISTS auto_checkout_forgotten_records();

-- Create the auto check-out function (SAME DAY processing)
CREATE OR REPLACE FUNCTION auto_checkout_forgotten_records()
RETURNS TABLE (
    processed_count INTEGER,
    user_ids UUID[],
    errors TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_today DATE;
    v_current_hour INTEGER;
    v_record RECORD;
    v_checkout_time TIMESTAMPTZ;
    v_total_hours DECIMAL(5,2);
    v_overtime_hours DECIMAL(5,2);
    v_shift_duration INTEGER;
    v_processed_count INTEGER := 0;
    v_user_ids UUID[] := ARRAY[]::UUID[];
    v_errors TEXT[] := ARRAY[]::TEXT[];
    v_error_msg TEXT;
BEGIN
    -- Log function start
    RAISE LOG 'Auto check-out function started: %', NOW() AT TIME ZONE 'Asia/Jakarta';
    
    -- Get today's date and current hour in Asia/Jakarta timezone
    v_today := (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE;
    v_current_hour := EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'Asia/Jakarta'));
    
    RAISE LOG 'Processing same-day forgotten check-outs for date: %, current hour: %', v_today, v_current_hour;
    
    -- Find all attendance records from TODAY where:
    -- 1. Employee has checked in
    -- 2. Employee has NOT checked out
    -- 3. Current time has passed their shift_end_hour + 1
    -- 4. User is active
    FOR v_record IN
        SELECT 
            ar.id AS attendance_id,
            ar.user_id,
            ar.date AS attendance_date,
            ar.check_in_time,
            u.shift_start_hour,
            u.shift_end_hour,
            u.full_name
        FROM attendance_records ar
        INNER JOIN users u ON ar.user_id = u.id
        WHERE ar.check_in_time IS NOT NULL
          AND ar.check_out_time IS NULL
          AND ar.date = v_today
          AND u.is_active = TRUE
          AND v_current_hour >= (u.shift_end_hour + 1)  -- Current hour has passed shift_end + 1
        ORDER BY ar.check_in_time ASC
    LOOP
        BEGIN
            -- Calculate check-out time: attendance_date + (shift_end_hour + 1) in Asia/Jakarta
            -- This sets check-out to exactly shift_end_hour + 1 on the same day
            v_checkout_time := (
                (v_record.attendance_date::TEXT || ' ' || (v_record.shift_end_hour + 1)::TEXT || ':00:00')::TIMESTAMP 
                AT TIME ZONE 'Asia/Jakarta'
            );
            
            -- Calculate shift duration (standard working hours)
            v_shift_duration := v_record.shift_end_hour - v_record.shift_start_hour;
            
            -- Calculate total hours worked
            v_total_hours := ROUND(
                EXTRACT(EPOCH FROM (v_checkout_time - v_record.check_in_time)) / 3600.0,
                2
            );
            
            -- Calculate overtime hours (total - standard shift duration)
            -- Minimum 0 to handle edge cases
            v_overtime_hours := GREATEST(0, ROUND(v_total_hours - v_shift_duration, 2));
            
            -- Update the attendance record
            UPDATE attendance_records
            SET 
                check_out_time = v_checkout_time,
                check_out_status = 'overtime'::check_out_status,
                total_hours = v_total_hours,
                overtime_hours = v_overtime_hours,
                updated_at = NOW()
            WHERE id = v_record.attendance_id;
            
            -- Track processed record
            v_processed_count := v_processed_count + 1;
            v_user_ids := array_append(v_user_ids, v_record.user_id);
            
            -- Log successful processing
            RAISE LOG 'Auto check-out (same-day): user_id=%, name=%, date=%, checkout_time=%, total_hours=%, overtime_hours=%',
                v_record.user_id,
                v_record.full_name,
                v_record.attendance_date,
                v_checkout_time AT TIME ZONE 'Asia/Jakarta',
                v_total_hours,
                v_overtime_hours;
                
        EXCEPTION WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS v_error_msg = MESSAGE_TEXT;
            v_errors := array_append(v_errors, 
                format('user_id=%s, date=%s, error=%s', 
                    v_record.user_id, 
                    v_record.attendance_date, 
                    v_error_msg
                )
            );
            
            RAISE LOG 'Auto check-out ERROR: user_id=%, date=%, error=%',
                v_record.user_id,
                v_record.attendance_date,
                v_error_msg;
        END;
    END LOOP;
    
    -- Log function completion
    RAISE LOG 'Auto check-out completed: processed=%, errors=%', v_processed_count, array_length(v_errors, 1);
    
    -- Return summary
    processed_count := v_processed_count;
    user_ids := v_user_ids;
    errors := v_errors;
    
    RETURN NEXT;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION auto_checkout_forgotten_records() IS 
'Automatically checks out employees who forgot to check out on the SAME DAY.
Runs hourly and processes records where current hour >= shift_end_hour + 1.
Sets check-out time to shift_end_hour + 1 hour on the same day as check-in.
Returns: processed_count, user_ids array, errors array.
Scheduled to run hourly via pg_cron.';

-- Grant execute permission to postgres
GRANT EXECUTE ON FUNCTION auto_checkout_forgotten_records() TO postgres;
