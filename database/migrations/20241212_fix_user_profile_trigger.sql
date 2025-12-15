-- Fixed trigger function to match actual users table schema
-- The users table uses shift_start_hour and shift_end_hour as INTEGER, not TIME

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert new user profile with data from auth.users metadata
  INSERT INTO public.users (
    id,
    email,
    username,
    full_name,
    employee_id,
    role,
    shift_start_hour,
    shift_end_hour,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'employee_id',
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    COALESCE((NEW.raw_user_meta_data->>'shift_start_hour')::INTEGER, 9),
    COALESCE((NEW.raw_user_meta_data->>'shift_end_hour')::INTEGER, 18),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    employee_id = EXCLUDED.employee_id,
    role = EXCLUDED.role,
    shift_start_hour = EXCLUDED.shift_start_hour,
    shift_end_hour = EXCLUDED.shift_end_hour;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger already exists, just update the function
