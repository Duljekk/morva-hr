-- ============================================================================
-- ANNOUNCEMENT REACTIONS TABLE MIGRATION
-- ============================================================================
-- Creates the announcement_reactions table for emoji reactions on announcements
-- Allows users to react to announcements with emojis and see real-time updates
-- ============================================================================

-- Create announcement_reactions table
CREATE TABLE announcement_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL, -- e.g., '❤️', '👍', '🎉'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    -- Prevents duplicate reactions: one user can only react once per emoji per announcement
    CONSTRAINT unique_announcement_user_emoji UNIQUE(announcement_id, user_id, emoji)
);

-- Indexes for performance optimization
-- Index for fetching all reactions for an announcement
CREATE INDEX idx_announcement_reactions_announcement_id ON announcement_reactions(announcement_id);
-- Index for fetching all reactions by a user
CREATE INDEX idx_announcement_reactions_user_id ON announcement_reactions(user_id);
-- Index for emoji lookups
CREATE INDEX idx_announcement_reactions_emoji ON announcement_reactions(emoji);
-- Composite index for efficient reaction count queries (group by announcement_id and emoji)
CREATE INDEX idx_announcement_reactions_lookup ON announcement_reactions(announcement_id, emoji);

-- Comments
COMMENT ON TABLE announcement_reactions IS 'Emoji reactions from users on announcements';
COMMENT ON COLUMN announcement_reactions.emoji IS 'Emoji character(s) used for the reaction (e.g., ❤️, 👍, 🎉)';
COMMENT ON CONSTRAINT unique_announcement_user_emoji ON announcement_reactions IS 'Prevents duplicate reactions: each user can only react once per emoji per announcement';
COMMENT ON INDEX idx_announcement_reactions_lookup IS 'Composite index optimizing reaction count queries grouped by announcement and emoji';



























