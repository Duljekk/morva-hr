# Authentication Quick Start Guide

Get up and running with MorvaHR authentication in 5 minutes.

## Step 1: Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to initialize (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `database/schema.sql` from this project
3. Paste and run the SQL in the editor
4. This creates all necessary tables, enums, and policies

## Step 3: Configure Environment Variables

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Create a Test User

### Option A: Via Supabase Dashboard (Easiest)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Click **Create user**

### Option B: Via SQL (Includes Profile)

1. Go to **SQL Editor** in Supabase
2. Run this SQL (replace with your values):

```sql
-- First, get the user ID from auth.users after creating via dashboard
-- Or use this to create both auth user and profile:

-- Create auth user (returns user ID)
SELECT id FROM auth.users WHERE email = 'test@example.com';

-- If user doesn't exist, create via dashboard first, then:
-- Insert user profile
INSERT INTO public.users (
  id, 
  email, 
  username, 
  full_name, 
  role, 
  employee_id
) VALUES (
  'USER_ID_FROM_AUTH_USERS',  -- Get this from auth.users
  'test@example.com',
  'testuser',
  'Test User',
  'employee',  -- or 'hr_admin'
  'EMP001'
);
```

**Important**: The `users.id` must match the ID from `auth.users`!

## Step 5: Install Dependencies

```bash
npm install
```

Dependencies should already include `@supabase/supabase-js` and `@supabase/ssr`.

## Step 6: Start Development Server

```bash
npm run dev
```

## Step 7: Test Authentication

1. Open [http://localhost:3000/login](http://localhost:3000/login)
2. Sign in with your test user credentials
3. You should be redirected to the home page (/)

## Verification Checklist

✅ Supabase project created  
✅ Database schema applied  
✅ Environment variables configured  
✅ Test user created in both `auth.users` and `public.users`  
✅ Can access `/login` page  
✅ Can sign in successfully  
✅ Redirected to `/` after login  
✅ Can sign out  

## Common Issues

### ❌ "Invalid API credentials"
- Double-check your `.env.local` file
- Make sure you're using the `anon` key, not `service_role`
- Restart your dev server after changing env variables

### ❌ "User profile not found"
- User must exist in BOTH `auth.users` and `public.users` tables
- The `id` must match in both tables
- Check RLS policies are enabled

### ❌ "Redirects not working"
- Clear your browser cookies
- Check that middleware.ts is in the root directory
- Verify the route protection array in middleware.ts

### ❌ "Session not persisting"
- Check if cookies are enabled in your browser
- Try in incognito/private mode
- Clear all site data and try again

## Next Steps

Once authentication is working:

1. **Add more users**: Create employee and HR admin accounts
2. **Customize roles**: Modify role checks in your components
3. **Add features**: Build attendance tracking, leave requests, etc.
4. **Set up RLS**: Review and customize Row Level Security policies
5. **Deploy**: Push to production and update env variables

## Need Help?

- Review the detailed docs in `lib/auth/README.md`
- Check Supabase logs: Dashboard → Logs
- Review browser console for client-side errors
- Check terminal for server-side errors

## Example User Creation Script

Save this as `scripts/create-user.sql` and run in Supabase SQL Editor:

```sql
-- Create test employee
-- First create in Authentication → Users in dashboard, then run:
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
  (SELECT id FROM auth.users WHERE email = 'employee@test.com'),
  'employee@test.com',
  'johndoe',
  'John Doe',
  'employee',
  'EMP001',
  11,
  19
);

-- Create test HR admin
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
  (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
  'admin@test.com',
  'admin',
  'HR Admin',
  'hr_admin',
  'ADM001',
  9,
  17
);
```

## Quick Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Check for type errors
npx tsc --noEmit

# Run linter
npm run lint
```

That's it! You now have a fully functional authentication system. 🎉

