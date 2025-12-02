-- ============================================================================
-- ANNOUNCEMENT REACTIONS RLS POLICIES
-- ============================================================================
-- Row Level Security policies for announcement_reactions table
-- Ensures users can view all reactions but only manage their own
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE announcement_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to make migration idempotent)
DROP POLICY IF EXISTS "Users can view all reactions" ON announcement_reactions;
DROP POLICY IF EXISTS "Users can add their own reactions" ON announcement_reactions;
DROP POLICY IF EXISTS "Users can remove their own reactions" ON announcement_reactions;

-- Policy: Users can view all reactions
-- All authenticated users can see all reactions (for displaying counts and who reacted)
-- Best Practice: Use TO authenticated and (select auth.uid()) for better performance
CREATE POLICY "Users can view all reactions"
    ON announcement_reactions FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Users can add their own reactions
-- Users can only add reactions with their own user_id
-- Best Practice: Use TO authenticated and (select auth.uid()) for better performance
CREATE POLICY "Users can add their own reactions"
    ON announcement_reactions FOR INSERT
    TO authenticated
    WITH CHECK ((select auth.uid()) = user_id);

-- Policy: Users can remove their own reactions
-- Users can only delete reactions they created
-- Best Practice: Use TO authenticated and (select auth.uid()) for better performance
CREATE POLICY "Users can remove their own reactions"
    ON announcement_reactions FOR DELETE
    TO authenticated
    USING ((select auth.uid()) = user_id);

-- Note: No UPDATE policy needed - reactions are immutable
-- Users delete and re-add reactions if they want to change them























