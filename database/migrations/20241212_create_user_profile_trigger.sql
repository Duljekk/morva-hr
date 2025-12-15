-- Migration: Create User Profile Trigger
-- Description: Automatically create user profile in users table when auth user is created via invitation
-- Date: 2024-12-12

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_employee_id TEXT;
  v_role user_role := 'employee';
BEGIN
  -- Extract metadata from user_metadata
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', '');
  v_employee_id := NEW.raw_user_meta_data->>'employee_id';
  
  -- Set role from metadata or default to employee
  IF NEW.raw_user_meta_data->>'role' = 'hr_admin' THEN
    v_role := 'hr_admin';
  END IF;
  
  -- Generate username from email if not provided
  IF v_username = '' THEN
    v_username := split_part(NEW.email, '@', 1);
  END IF;
  
  -- Generate full_name from email if not provided
  IF v_full_name = '' THEN
    v_full_name := INITCAP(REPLACE(split_part(NEW.email, '@', 1), '.', ' '));
  END IF;
  
  -- Insert into users table
  INSERT INTO public.users (
    id,
    email,
    username,
    full_name,
    role,
    employee_id,
    shift_start_hour,
    shift_end_hour,
    created_at,
    updated_at,
    is_active
  ) VALUES (
    NEW.id,
    NEW.email,
    v_username,
    v_full_name,
    v_role,
    v_employee_id,
    COALESCE((NEW.raw_user_meta_data->>'shift_start_hour')::INTEGER, 11),
    COALESCE((NEW.raw_user_meta_data->>'shift_end_hour')::INTEGER, 19),
    NOW(),
    NOW(),
    TRUE
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate inserts
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, service_role;

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates a user profile in public.users table when a new user is created in auth.users. 
Extracts metadata from raw_user_meta_data including full_name, username, role, and employee_id.
Generates default values if metadata is not provided.';
