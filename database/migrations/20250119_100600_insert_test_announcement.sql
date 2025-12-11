-- ============================================================================
-- INSERT TEST ANNOUNCEMENT
-- ============================================================================
-- Inserts a test announcement for development/testing purposes
-- This announcement matches the mock announcement used in the UI
-- ============================================================================

-- Insert test announcement
-- Uses the first active user as the creator (or first user if no active users)
INSERT INTO announcements (
    title,
    content,
    created_by,
    is_active,
    scheduled_time,
    created_at,
    updated_at
)
SELECT 
    'Moving Out Day' AS title,
    'We will be moving to our new office location. Please ensure all your belongings are packed and ready by 11:00 AM. The moving truck will arrive at 12:00 PM.' AS content,
    COALESCE(
        (SELECT id FROM users WHERE is_active = true LIMIT 1),
        (SELECT id FROM users LIMIT 1)
    ) AS created_by,
    true AS is_active,
    NULL AS scheduled_time, -- Available immediately
    NOW() AS created_at,
    NOW() AS updated_at
WHERE EXISTS (SELECT 1 FROM users LIMIT 1); -- Only insert if users exist

-- Note: If no users exist in the database, this migration will not insert anything
-- Make sure to create a user first before running this migration






































