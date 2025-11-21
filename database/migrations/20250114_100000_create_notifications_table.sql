-- ============================================================================
-- NOTIFICATIONS TABLE MIGRATION
-- ============================================================================
-- Creates the notifications table for user-specific notifications
-- Phase 1: Focus on leave request notifications
-- ============================================================================

-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
    'leave_approved',
    'leave_rejected',
    'leave_sent',
    'payslip_ready',
    'announcement',
    'attendance_reminder'
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    related_entity_type TEXT, -- e.g., 'leave_request', 'payslip', 'announcement'
    related_entity_id UUID,   -- ID of the related entity
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_read_status CHECK (
        (is_read = FALSE AND read_at IS NULL) OR
        (is_read = TRUE AND read_at IS NOT NULL)
    )
);

-- Indexes for performance optimization
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
-- Partial index for unread notifications (optimizes COUNT queries)
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) 
    WHERE is_read = FALSE;
-- Index for related entity lookups
CREATE INDEX idx_notifications_related_entity ON notifications(related_entity_type, related_entity_id);

-- Comments
COMMENT ON TABLE notifications IS 'User-specific notifications for leave requests, payslips, and announcements';
COMMENT ON TYPE notification_type IS 'Types of notifications that can be sent to users';
COMMENT ON COLUMN notifications.related_entity_type IS 'Type of related entity (e.g., leave_request, payslip)';
COMMENT ON COLUMN notifications.related_entity_id IS 'ID of the related entity for navigation';
COMMENT ON INDEX idx_notifications_user_unread IS 'Partial index optimizing unread notification queries';










