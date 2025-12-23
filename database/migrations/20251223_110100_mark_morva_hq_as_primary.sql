-- Mark Morva HQ as the primary location
-- This script identifies the Morva HQ location and marks it as primary
-- Run this after adding the is_primary column

-- Update the location that matches Morva HQ coordinates
-- Using subquery to avoid LIMIT syntax error in UPDATE
UPDATE check_in_locations
SET is_primary = TRUE
WHERE id = (
  SELECT id 
  FROM check_in_locations 
  WHERE name ILIKE '%morva%'
     OR (
       latitude BETWEEN -6.374 AND -6.372
       AND longitude BETWEEN 106.902 AND 106.904
     )
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Ensure only one location is marked as primary
-- (In case multiple locations matched the criteria)
UPDATE check_in_locations
SET is_primary = FALSE
WHERE id NOT IN (
  SELECT id 
  FROM check_in_locations 
  WHERE is_primary = TRUE 
  ORDER BY created_at ASC 
  LIMIT 1
);
