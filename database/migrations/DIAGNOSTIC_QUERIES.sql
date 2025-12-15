-- DIAGNOSTIC QUERIES FOR TROUBLESHOOTING INVITATION ERRORS

-- 1. Check if the trigger exists
SELECT 
  trigger_name, 
  event_object_table, 
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
AND trigger_name = 'on_auth_user_created';

-- 2. Check if the function exists
SELECT 
  routine_name, 
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 3. Check users table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 4. Temporarily disable the trigger to test if that's the issue
-- Run this to disable:
-- ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

-- 5. Re-enable the trigger after testing
-- Run this to re-enable:
-- ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- 6. Check recent PostgreSQL logs for errors
-- (Only available in Supabase Dashboard → Logs → Postgres Logs)
