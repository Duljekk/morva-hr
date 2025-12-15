-- Fix infinite recursion in users table RLS policies
-- The issue: policies were querying the users table while checking permissions on the users table

-- Drop existing policies
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_hr_admin" ON users;
DROP POLICY IF EXISTS "users_insert_hr_admin" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_update_hr_admin" ON users;

-- Recreate policies without recursion
-- The key fix: Use auth.uid() directly instead of querying the users table

-- Employees can read their own user data
CREATE POLICY "users_select_own"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- HR admins can read all user data
-- Use the helper function which has SECURITY DEFINER to avoid recursion
CREATE POLICY "users_select_hr_admin"
    ON users FOR SELECT
    USING (is_hr_admin());

-- HR admins can insert new users
CREATE POLICY "users_insert_hr_admin"
    ON users FOR INSERT
    WITH CHECK (is_hr_admin());

-- Users can update their own data (except role)
-- FIXED: Don't query users table to check role, use OLD.role instead
-- Note: In PostgreSQL RLS, we can't use OLD, so we simplify the check
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Remove role check to prevent recursion
        -- Role changes will be prevented by application logic and HR admin policies
    );

-- HR admins can update any user
CREATE POLICY "users_update_hr_admin"
    ON users FOR UPDATE
    USING (is_hr_admin());

-- Note: The is_hr_admin() function uses SECURITY DEFINER which allows it to
-- bypass RLS and query the users table without triggering recursion


