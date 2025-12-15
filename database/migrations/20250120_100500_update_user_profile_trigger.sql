-- Migration: Update User Profile Trigger
-- Description: Update handle_new_user() trigger to extract new profile fields from raw_user_meta_data
-- Date: 2025-01-20

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_employee_id TEXT;
  v_role user_role := 'employee';
  v_employment_type employment_type;
  v_birthdate DATE;
  v_salary DECIMAL(10,2);
  v_contract_start_date DATE;
  v_contract_end_date DATE;
BEGIN
  -- Extract metadata from user_metadata
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  v_username := COALESCE(NEW.raw_user_meta_data->>'username', '');
  v_employee_id := NEW.raw_user_meta_data->>'employee_id';
  
  -- Set role from metadata or default to employee
  IF NEW.raw_user_meta_data->>'role' = 'hr_admin' THEN
    v_role := 'hr_admin';
  END IF;
  
  -- Extract new profile fields
  IF NEW.raw_user_meta_data->>'employment_type' IS NOT NULL THEN
    v_employment_type := (NEW.raw_user_meta_data->>'employment_type')::employment_type;
  END IF;
  
  IF NEW.raw_user_meta_data->>'birthdate' IS NOT NULL THEN
    v_birthdate := (NEW.raw_user_meta_data->>'birthdate')::DATE;
  END IF;
  
  IF NEW.raw_user_meta_data->>'salary' IS NOT NULL THEN
    v_salary := (NEW.raw_user_meta_data->>'salary')::DECIMAL(10,2);
  END IF;
  
  IF NEW.raw_user_meta_data->>'contract_start_date' IS NOT NULL THEN
    v_contract_start_date := (NEW.raw_user_meta_data->>'contract_start_date')::DATE;
  END IF;
  
  IF NEW.raw_user_meta_data->>'contract_end_date' IS NOT NULL THEN
    v_contract_end_date := (NEW.raw_user_meta_data->>'contract_end_date')::DATE;
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
    employment_type,
    birthdate,
    salary,
    contract_start_date,
    contract_end_date,
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
    v_employment_type,
    v_birthdate,
    v_salary,
    v_contract_start_date,
    v_contract_end_date,
    NOW(),
    NOW(),
    TRUE
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate inserts
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates a user profile in public.users table when a new user is created in auth.users. 
Extracts metadata from raw_user_meta_data including full_name, username, role, employee_id, 
employment_type, birthdate, salary, and contract dates. Generates default values if metadata is not provided.';

