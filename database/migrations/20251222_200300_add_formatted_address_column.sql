-- Add formatted_address column to check_in_locations table
-- This column stores the human-readable address retrieved from Google Geocoding API
-- Column is nullable to support graceful degradation when geocoding fails

ALTER TABLE check_in_locations
ADD COLUMN formatted_address TEXT;

-- Add comment for documentation
COMMENT ON COLUMN check_in_locations.formatted_address IS 'Human-readable address from Google Geocoding API, nullable for graceful degradation';
