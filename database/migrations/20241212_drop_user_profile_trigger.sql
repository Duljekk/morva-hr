-- Migration: Drop User Profile Trigger
-- Description: Remove the automatic user profile creation trigger to prevent conflicts with signup flow
-- Date: 2024-12-12
-- Issue: Runtime error during user signup due to race condition between trigger and server action

-- Drop the trigger that automatically creates user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function as well since it's no longer needed
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Add comment for documentation
COMMENT ON TABLE public.users IS 
'User profiles table. Profile creation is now handled exclusively by the signup server action
to prevent race conditions and ensure proper data validation. The automatic trigger 
(handle_new_user) has been removed in favor of explicit profile creation during signup.';

-- Note: User profile creation is now handled by:
-- 1. HR Admin invite flow: lib/actions/hr/users.ts (inviteUser function)
-- 2. User signup flow: lib/actions/auth/signup.ts (signup function)
-- This ensures consistent data validation and proper error handling