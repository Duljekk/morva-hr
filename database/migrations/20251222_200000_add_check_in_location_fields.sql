-- Add location columns to attendance_records for GPS check-in tracking
ALTER TABLE attendance_records
ADD COLUMN check_in_latitude DECIMAL(10, 8),
ADD COLUMN check_in_longitude DECIMAL(11, 8),
ADD COLUMN check_in_location_accuracy DECIMAL(6, 2);

-- Add constraints for valid coordinate ranges
ALTER TABLE attendance_records
ADD CONSTRAINT valid_check_in_latitude 
  CHECK (check_in_latitude IS NULL OR (check_in_latitude >= -90 AND check_in_latitude <= 90)),
ADD CONSTRAINT valid_check_in_longitude 
  CHECK (check_in_longitude IS NULL OR (check_in_longitude >= -180 AND check_in_longitude <= 180));

-- Add comment for documentation
COMMENT ON COLUMN attendance_records.check_in_latitude IS 'GPS latitude at check-in time';
COMMENT ON COLUMN attendance_records.check_in_longitude IS 'GPS longitude at check-in time';
COMMENT ON COLUMN attendance_records.check_in_location_accuracy IS 'GPS accuracy in meters at check-in time';
