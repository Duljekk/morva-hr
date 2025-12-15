-- Migration: Update Users RLS Policies for Profile Fields
-- Description: Update users table RLS policies to handle new profile fields with field-level access control
-- Date: 2025-01-20

-- Drop existing update policies to recreate with new conditions
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_hr_admin" ON users;

-- Policy: Users can update their own non-sensitive profile fields
-- Allowed: profile_picture_url, birthdate
-- Restricted: employment_type, salary, contract_start_date, contract_end_date, role, employee_id
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        -- Ensure role cannot be changed
        role = (SELECT role FROM users WHERE id = auth.uid()) AND
        -- Ensure employee_id cannot be changed
        employee_id = (SELECT employee_id FROM users WHERE id = auth.uid()) AND
        -- Ensure employment_type cannot be changed
        (employment_type IS NULL OR employment_type = (SELECT employment_type FROM users WHERE id = auth.uid())) AND
        -- Ensure salary cannot be changed
        (salary IS NULL OR salary = (SELECT salary FROM users WHERE id = auth.uid())) AND
        -- Ensure contract dates cannot be changed
        (contract_start_date IS NULL OR contract_start_date = (SELECT contract_start_date FROM users WHERE id = auth.uid())) AND
        (contract_end_date IS NULL OR contract_end_date = (SELECT contract_end_date FROM users WHERE id = auth.uid()))
    );

-- Policy: HR admins can update any user field
CREATE POLICY "users_update_hr_admin"
    ON users FOR UPDATE
    USING (is_hr_admin())
    WITH CHECK (is_hr_admin());

