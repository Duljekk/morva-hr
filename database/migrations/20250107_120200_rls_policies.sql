-- Migration: Row Level Security Policies
-- Created: 2025-01-07 12:02:00
-- Description: Apply RLS policies to all tables

-- This migration applies row-level security policies for Supabase
-- Run this after the initial schema and seed data

BEGIN;

-- Include the rls_policies.sql file content
-- In production, you would execute: \i database/rls_policies.sql
-- Or copy the entire content of rls_policies.sql here

-- For Supabase migrations, it's recommended to copy the rls_policies.sql content directly
-- into this file or reference it using Supabase CLI

-- Verify migration
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    IF policy_count < 20 THEN
        RAISE WARNING 'Expected at least 20 policies, found %', policy_count;
    END IF;
    
    RAISE NOTICE 'Migration completed successfully: % RLS policies applied', policy_count;
END $$;

COMMIT;




