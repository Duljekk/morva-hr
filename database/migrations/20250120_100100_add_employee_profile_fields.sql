-- Migration: Add Employee Profile Fields
-- Description: Add profile picture, birthdate, employment type, salary, and contract period fields to users table
-- Date: 2025-01-20

-- Add new columns to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
  ADD COLUMN IF NOT EXISTS birthdate DATE,
  ADD COLUMN IF NOT EXISTS employment_type employment_type,
  ADD COLUMN IF NOT EXISTS salary DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS contract_start_date DATE,
  ADD COLUMN IF NOT EXISTS contract_end_date DATE;

-- Add constraints
ALTER TABLE users
  ADD CONSTRAINT valid_contract_dates CHECK (
    contract_end_date IS NULL OR 
    contract_start_date IS NULL OR 
    contract_end_date >= contract_start_date
  ),
  ADD CONSTRAINT valid_salary CHECK (salary IS NULL OR salary >= 0),
  ADD CONSTRAINT valid_birthdate CHECK (
    birthdate IS NULL OR 
    (birthdate >= '1900-01-01'::DATE AND birthdate <= CURRENT_DATE - INTERVAL '16 years')
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_employment_type ON users(employment_type);
CREATE INDEX IF NOT EXISTS idx_users_contract_end_date ON users(contract_end_date);
CREATE INDEX IF NOT EXISTS idx_users_employment_active ON users(employment_type, is_active);

-- Add comments for documentation
COMMENT ON COLUMN users.profile_picture_url IS 'URL to profile picture stored in Supabase Storage';
COMMENT ON COLUMN users.birthdate IS 'Employee birthdate';
COMMENT ON COLUMN users.employment_type IS 'Type of employment: intern, full_time, part_time, or contractor';
COMMENT ON COLUMN users.salary IS 'Monthly salary in base currency';
COMMENT ON COLUMN users.contract_start_date IS 'Contract start date';
COMMENT ON COLUMN users.contract_end_date IS 'Contract end date (NULL for permanent employees)';

