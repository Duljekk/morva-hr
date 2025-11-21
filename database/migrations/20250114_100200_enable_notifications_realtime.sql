-- ============================================================================
-- ENABLE NOTIFICATIONS TABLE FOR REALTIME
-- ============================================================================
-- Adds the notifications table to the supabase_realtime publication
-- This enables real-time subscriptions for notification changes
-- ============================================================================

-- Add notifications table to the supabase_realtime publication
-- This allows clients to subscribe to INSERT and UPDATE events on notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Note: The supabase_realtime publication should already exist
-- If it doesn't, you may need to create it first:
-- CREATE PUBLICATION supabase_realtime;

-- Verify the table was added (optional check)
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';










