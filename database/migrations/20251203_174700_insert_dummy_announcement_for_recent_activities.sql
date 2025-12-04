-- ============================================================================
-- INSERT DUMMY ANNOUNCEMENT FOR RECENT ACTIVITIES
-- ============================================================================
-- Inserts a dummy announcement for Recent Activities display
-- This will appear in the HR Dashboard Recent Activities section
-- ============================================================================

-- Insert dummy announcement
-- Uses the first active HR admin user as the creator (or first user if no HR admin)
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
    'Company Holiday Schedule 2025' AS title,
    'Please note that the company will be closed on the following holidays: New Year''s Day, Independence Day, Christmas Day, and other national holidays. Full schedule will be published in the employee handbook.' AS content,
    COALESCE(
        (SELECT id FROM users WHERE is_active = true AND role = 'hr_admin' LIMIT 1),
        (SELECT id FROM users WHERE is_active = true LIMIT 1),
        (SELECT id FROM users LIMIT 1)
    ) AS created_by,
    true AS is_active,
    NULL AS scheduled_time, -- Available immediately
    NOW() AS created_at,
    NOW() AS updated_at
WHERE EXISTS (SELECT 1 FROM users LIMIT 1) -- Only insert if users exist
AND NOT EXISTS (
    -- Don't insert if this exact announcement already exists
    SELECT 1 FROM announcements 
    WHERE title = 'Company Holiday Schedule 2025' 
    AND created_at > NOW() - INTERVAL '1 day'
);

-- Note: If no users exist in the database, this migration will not insert anything
-- Make sure to create a user first before running this migration




