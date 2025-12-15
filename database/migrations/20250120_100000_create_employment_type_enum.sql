-- Migration: Create Employment Type Enum
-- Description: Create enum type for employment types (intern, full_time, part_time, contractor)
-- Date: 2025-01-20

-- Create employment_type enum
CREATE TYPE employment_type AS ENUM ('intern', 'full_time', 'part_time', 'contractor');

-- Add comment for documentation
COMMENT ON TYPE employment_type IS 'Employment type enumeration: intern, full_time, part_time, contractor';

