-- ============================================================================
-- Migration: Create Auto Reset Location Function
-- Description: Creates the auto_reset_location_to_primary() function that
--              automatically resets the selected check-in location back to
--              the primary/Office location at the start of each day.
-- Date: 2025-12-23
-- Timezone: Asia/Jakarta (UTC+7)
-- ============================================================================

-- Drop existing function if exists (for idempotency)
DROP FUNCTION IF EXISTS auto_reset_location_to_primary();

-- Create the auto reset location function
CREATE OR REPLACE FUNCTION auto_reset_location_to_primary()
RETURNS TABLE (
    success BOOLEAN,
    previous_location_id UUID,
    previous_location_name TEXT,
    primary_location_id UUID,
    primary_location_name TEXT,
    error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_primary_location RECORD;
    v_current_selected RECORD;
    v_error_msg TEXT;
BEGIN
    -- Log function start
    RAISE LOG 'Auto reset location function started: %', NOW() AT TIME ZONE 'Asia/Jakarta';
    
    -- Initialize return values
    success := FALSE;
    previous_location_id := NULL;
    previous_location_name := NULL;
    primary_location_id := NULL;
    primary_location_name := NULL;
    error_message := NULL;
    
    BEGIN
        -- Find the primary location
        SELECT id, name INTO v_primary_location
        FROM check_in_locations
        WHERE is_primary = TRUE
          AND is_active = TRUE
        LIMIT 1;
        
        -- If no primary location found, log and exit
        IF v_primary_location.id IS NULL THEN
            error_message := 'No primary location found. Cannot reset location.';
            RAISE LOG 'Auto reset location: %', error_message;
            RETURN NEXT;
            RETURN;
        END IF;
        
        primary_location_id := v_primary_location.id;
        primary_location_name := v_primary_location.name;
        
        -- Find the currently selected location
        SELECT id, name INTO v_current_selected
        FROM check_in_locations
        WHERE is_selected = TRUE
        LIMIT 1;
        
        -- Store previous location info
        IF v_current_selected.id IS NOT NULL THEN
            previous_location_id := v_current_selected.id;
            previous_location_name := v_current_selected.name;
        END IF;
        
        -- Check if primary is already selected
        IF v_current_selected.id = v_primary_location.id THEN
            success := TRUE;
            RAISE LOG 'Auto reset location: Primary location already selected (id=%, name=%)',
                v_primary_location.id, v_primary_location.name;
            RETURN NEXT;
            RETURN;
        END IF;
        
        -- Deselect all locations
        UPDATE check_in_locations
        SET is_selected = FALSE, updated_at = NOW()
        WHERE is_selected = TRUE;
        
        -- Select the primary location
        UPDATE check_in_locations
        SET is_selected = TRUE, updated_at = NOW()
        WHERE id = v_primary_location.id;
        
        success := TRUE;
        
        -- Log successful reset
        RAISE LOG 'Auto reset location: Successfully reset from "%" (id=%) to primary "%" (id=%)',
            COALESCE(v_current_selected.name, 'none'),
            COALESCE(v_current_selected.id::TEXT, 'none'),
            v_primary_location.name,
            v_primary_location.id;
            
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_error_msg = MESSAGE_TEXT;
        error_message := v_error_msg;
        success := FALSE;
        
        RAISE LOG 'Auto reset location ERROR: %', v_error_msg;
    END;
    
    RETURN NEXT;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION auto_reset_location_to_primary() IS 
'Automatically resets the selected check-in location back to the primary/Office location.
This function is designed to run daily at midnight (or early morning) to ensure
employees start each day with the default Office location selected.
If a non-primary location (WFC) was selected the previous day, it will be reset.
Returns: success boolean, previous/primary location info, and any error message.
Scheduled to run daily via pg_cron.';

-- Grant execute permission to postgres
GRANT EXECUTE ON FUNCTION auto_reset_location_to_primary() TO postgres;
