# Login Troubleshooting Guide

## Issue: "Username not found" but email login works

This means:
- ✅ User exists in Supabase Auth (`auth.users`)
- ❌ User profile missing or username mismatch in `public.users` table

## Quick Fix

### Step 1: Check if User Profile Exists

In Supabase SQL Editor, run:

```sql
-- Check if user profile exists
SELECT id, email, username, full_name, role 
FROM public.users 
WHERE email = 'your-email@example.com';
```

### Step 2: Create User Profile (if missing)

If the query returns no results, create the profile:

```sql
-- First, get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then insert the profile (replace with your values)
INSERT INTO public.users (
  id,           -- MUST match the ID from auth.users
  email,
  username,     -- This is what you'll use to login
  full_name,
  role
) VALUES (
  'PASTE_USER_ID_FROM_ABOVE',  -- Replace this!
  'your-email@example.com',
  'yourusername',               -- Choose your username
  'Your Full Name',
  'employee'                    -- or 'hr_admin'
);
```

### Step 3: Update Username (if it exists but different)

If the profile exists but username is different:

```sql
-- Update the username
UPDATE public.users 
SET username = 'newusername' 
WHERE email = 'your-email@example.com';
```

### Step 4: Verify

```sql
-- Check again
SELECT id, email, username, full_name, role 
FROM public.users 
WHERE email = 'your-email@example.com';
```

## Complete Setup Script

Here's a complete script to set up a new user:

```sql
-- 1. Check auth user ID
SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- 2. Insert profile (use the ID from step 1)
INSERT INTO public.users (
  id,
  email,
  username,
  full_name,
  role,
  employee_id,
  shift_start_hour,
  shift_end_hour
) VALUES (
  'USER_ID_FROM_STEP_1',
  'user@example.com',
  'username',
  'John Doe',
  'employee',
  'EMP001',
  11,
  19
) ON CONFLICT (id) DO UPDATE
SET 
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name;

-- 3. Verify
SELECT * FROM public.users WHERE email = 'user@example.com';
```

## Common Issues

### Issue 1: Row Level Security (RLS) Blocking Query

Check if RLS is blocking the lookup:

```sql
-- Temporarily disable RLS for testing (in SQL Editor you have admin access)
-- This query should work in SQL Editor:
SELECT email, username FROM public.users WHERE username = 'yourusername';
```

If this works in SQL Editor but not in the app, check your RLS policies:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Add policy to allow public read of email/username for login
CREATE POLICY "Allow public to read email and username for login"
ON public.users
FOR SELECT
USING (true);
```

### Issue 2: Case Sensitivity

Usernames might be case-sensitive. Try:

```sql
-- Make username lookup case-insensitive
SELECT email FROM public.users WHERE LOWER(username) = LOWER('YourUsername');
```

If you need case-insensitive usernames, update the login page to use:
```typescript
.eq('username', username.toLowerCase())
```

## After Creating Profile

1. Refresh your browser
2. Clear cookies: DevTools → Application → Cookies → Clear all
3. Try logging in with your username
4. Should work now! ✅

## Need More Help?

Check your Supabase logs:
1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Postgres Logs**
3. Look for errors during login attempts

