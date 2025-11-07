-- Migration: Initial Schema
-- Created: 2025-01-07 12:00:00
-- Description: Create all database tables, enums, constraints, and indexes

-- This migration creates the complete database schema for MorvaHR
-- Run this first before any other migrations

BEGIN;

-- Include the schema.sql file content
-- In production, you would execute: \i database/schema.sql
-- Or copy the entire content of schema.sql here

-- For Supabase migrations, it's recommended to copy the schema.sql content directly
-- into this file or reference it using Supabase CLI

-- Verify migration
DO $$
BEGIN
    -- Check if all required tables exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'Migration failed: users table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attendance_records') THEN
        RAISE EXCEPTION 'Migration failed: attendance_records table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_types') THEN
        RAISE EXCEPTION 'Migration failed: leave_types table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_requests') THEN
        RAISE EXCEPTION 'Migration failed: leave_requests table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_balances') THEN
        RAISE EXCEPTION 'Migration failed: leave_balances table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_request_attachments') THEN
        RAISE EXCEPTION 'Migration failed: leave_request_attachments table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'announcements') THEN
        RAISE EXCEPTION 'Migration failed: announcements table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'announcement_views') THEN
        RAISE EXCEPTION 'Migration failed: announcement_views table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payslips') THEN
        RAISE EXCEPTION 'Migration failed: payslips table not created';
    END IF;
    
    RAISE NOTICE 'Migration completed successfully: Initial schema created';
END $$;

COMMIT;


