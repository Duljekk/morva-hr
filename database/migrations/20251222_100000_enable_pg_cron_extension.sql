-- ============================================================================
-- Migration: Enable pg_cron Extension
-- Description: Enables the pg_cron extension for scheduling recurring jobs
-- Date: 2025-12-22
-- ============================================================================

-- Enable pg_cron extension in pg_catalog schema (Supabase best practice)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Grant necessary permissions to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Verify extension installation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
    ) THEN
        RAISE EXCEPTION 'pg_cron extension failed to install';
    END IF;
    
    RAISE NOTICE 'pg_cron extension installed successfully';
END $$;

-- Add comment for documentation
COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL - used for auto check-out functionality';
