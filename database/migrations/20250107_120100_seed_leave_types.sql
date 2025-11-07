-- Migration: Seed Leave Types
-- Created: 2025-01-07 12:01:00
-- Description: Insert initial leave types data

BEGIN;

-- Insert predefined leave types
INSERT INTO leave_types (id, name, requires_approval, requires_attachment, max_days_per_year, is_active) VALUES
    ('sick', 'Sick Leave', true, true, NULL, true),
    ('annual', 'Annual Leave', true, false, 20, true),
    ('unpaid', 'Unpaid Leave', true, false, NULL, true)
ON CONFLICT (id) DO NOTHING;

-- Verify migration
DO $$
DECLARE
    leave_type_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO leave_type_count FROM leave_types;
    
    IF leave_type_count < 3 THEN
        RAISE EXCEPTION 'Migration failed: Expected at least 3 leave types, found %', leave_type_count;
    END IF;
    
    RAISE NOTICE 'Migration completed successfully: % leave types seeded', leave_type_count;
END $$;

COMMIT;




