-- Add is_selected column to check_in_locations table
-- This column marks which location is the primary location for check-in validation
-- Only one location should be selected at a time (enforced at application level)

ALTER TABLE check_in_locations
ADD COLUMN is_selected BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for quick lookup of selected location
CREATE INDEX idx_check_in_locations_is_selected ON check_in_locations(is_selected) WHERE is_selected = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN check_in_locations.is_selected IS 'Marks the primary location used for GPS check-in validation. Only one location should be selected at a time.';
