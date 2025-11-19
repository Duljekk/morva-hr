-- ============================================================================
-- NOTIFICATIONS RLS POLICIES
-- ============================================================================
-- Row Level Security policies for notifications table
-- Ensures users can only access their own notifications
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
-- Best Practice: Use TO authenticated and (select auth.uid()) for better performance
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = user_id);

-- Policy: Users can update their own notifications (mark as read)
-- Best Practice: Use TO authenticated and (select auth.uid()) for better performance
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- Policy: System can create notifications (application code)
-- This allows server actions to create notifications for users
-- Note: Using service_role key bypasses RLS, but this policy allows authenticated users
-- to create notifications if needed (e.g., for testing)
CREATE POLICY "System can create notifications"
    ON notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Note: DELETE policy not needed for Phase 1
-- Users won't delete notifications in initial implementation


