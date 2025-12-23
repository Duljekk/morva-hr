-- Create atomic function for selecting a check-in location
-- This ensures we never end up with multiple selected locations or no selected location
-- due to race conditions between the deselect and select operations

CREATE OR REPLACE FUNCTION select_check_in_location(location_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Deselect all locations first
  UPDATE check_in_locations
  SET is_selected = FALSE, updated_at = NOW()
  WHERE is_selected = TRUE;
  
  -- Select the specified location
  UPDATE check_in_locations
  SET is_selected = TRUE, updated_at = NOW()
  WHERE id = location_id;
  
  -- Verify the location was selected (exists and is now selected)
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Location with ID % not found', location_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION select_check_in_location(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION select_check_in_location IS 'Atomically selects a check-in location, ensuring only one location is selected at a time';
