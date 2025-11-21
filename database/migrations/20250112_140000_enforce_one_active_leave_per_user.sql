-- Migration: Enforce One Active Leave Request Per User
-- Description: Creates a partial unique index to ensure each user can only have one active leave request at a time.
-- Active requests are defined as those with status 'pending' or 'approved' where end_date >= CURRENT_DATE.

-- Create partial unique index on user_id for active leave requests
-- This prevents multiple active leave requests per user at the database level
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_leave_per_user 
ON leave_requests(user_id) 
WHERE status IN ('pending', 'approved') 
  AND end_date >= CURRENT_DATE;

-- Add comment explaining the index
COMMENT ON INDEX idx_one_active_leave_per_user IS 
'Ensures each user can only have one active leave request (pending or approved with end_date >= current date) at a time';

























