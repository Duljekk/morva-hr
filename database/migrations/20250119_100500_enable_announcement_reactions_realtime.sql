-- ============================================================================
-- ENABLE ANNOUNCEMENT REACTIONS TABLE FOR REALTIME
-- ============================================================================
-- Adds the announcement_reactions table to the supabase_realtime publication
-- This enables real-time subscriptions for reaction changes (INSERT and DELETE)
-- ============================================================================

-- Add announcement_reactions table to the supabase_realtime publication
-- This allows clients to subscribe to INSERT and DELETE events on reactions
-- INSERT events: when a user adds a reaction
-- DELETE events: when a user removes a reaction
ALTER PUBLICATION supabase_realtime ADD TABLE announcement_reactions;

-- Note: The supabase_realtime publication should already exist
-- If it doesn't, you may need to create it first:
-- CREATE PUBLICATION supabase_realtime;

-- Verify the table was added (optional check)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'announcement_reactions';









































