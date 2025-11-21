-- ============================================================================
-- FIX NOTIFICATIONS FOREIGN KEY CONSTRAINT
-- ============================================================================
-- The foreign key constraint was causing issues because users don't always
-- exist in auth.users when authenticated via Supabase.
-- We remove the constraint and rely on RLS policies for security instead.
-- ============================================================================

-- Remove the foreign key constraint
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Add a comment explaining why there's no foreign key
COMMENT ON COLUMN notifications.user_id IS 'User ID from auth.users. No foreign key constraint to allow flexibility with authentication systems. RLS policies ensure security.';










