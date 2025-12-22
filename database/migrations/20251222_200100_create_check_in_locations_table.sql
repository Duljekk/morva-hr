-- Create check_in_locations table for future multi-location support
CREATE TABLE check_in_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 50,
    google_maps_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT valid_radius CHECK (radius_meters > 0 AND radius_meters <= 1000)
);

-- Create indexes for common queries
CREATE INDEX idx_check_in_locations_is_active ON check_in_locations(is_active);
CREATE INDEX idx_check_in_locations_created_by ON check_in_locations(created_by);

-- Add comment for documentation
COMMENT ON TABLE check_in_locations IS 'Office locations for GPS-based check-in validation';

-- Add location reference to attendance_records (optional, for future use)
ALTER TABLE attendance_records
ADD COLUMN check_in_location_id UUID REFERENCES check_in_locations(id) ON DELETE SET NULL;

COMMENT ON COLUMN attendance_records.check_in_location_id IS 'Reference to the office location used for check-in validation';
