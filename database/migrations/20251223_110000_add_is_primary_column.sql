-- Add is_primary column to check_in_locations table
-- This column marks the headquarters/primary office location
-- Only one location should be primary at a time (enforced at application level)

ALTER TABLE check_in_locations
ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for quick lookup of primary location
CREATE INDEX idx_check_in_locations_is_primary ON check_in_locations(is_primary) WHERE is_primary = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN check_in_locations.is_primary IS 'Marks the headquarters/primary office location. Displayed first in lists with custom branding.';
