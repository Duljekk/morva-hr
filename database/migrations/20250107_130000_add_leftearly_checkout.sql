-- Migration: Add 'leftearly' checkout status
-- Created: 2025-01-07 13:00:00
-- Description: Extend check_out_status enum with 'leftearly'

BEGIN;

-- Add new enum value if it does not already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum
        WHERE enumlabel = 'leftearly'
          AND enumtypid = 'check_out_status'::regtype
    ) THEN
        ALTER TYPE check_out_status ADD VALUE 'leftearly';
    END IF;
END $$;

COMMIT;

