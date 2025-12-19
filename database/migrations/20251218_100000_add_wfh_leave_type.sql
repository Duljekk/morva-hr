-- Migration: Add WFH Leave Type and Update Quotas
-- Created: 2025-12-18
-- Description: Add Work From Home leave type, update leave quotas for PTO (12), Sick (5), WFH (5)

BEGIN;

-- Insert WFH leave type
INSERT INTO leave_types (id, name, requires_approval, requires_attachment, max_days_per_year, is_active)
VALUES ('wfh', 'Work From Home', true, false, 5, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    max_days_per_year = EXCLUDED.max_days_per_year,
    is_active = EXCLUDED.is_active;

-- Update annual leave to 12 days (PTO)
UPDATE leave_types
SET max_days_per_year = 12, name = 'Paid Time Off'
WHERE id = 'annual';

-- Update sick leave to 5 days
UPDATE leave_types
SET max_days_per_year = 5
WHERE id = 'sick';

-- Deactivate unpaid leave type
UPDATE leave_types
SET is_active = false
WHERE id = 'unpaid';

-- Verify migration
DO $$
DECLARE
    leave_type_count INTEGER;
    wfh_exists BOOLEAN;
BEGIN
    SELECT COUNT(*) INTO leave_type_count FROM leave_types WHERE is_active = true;
    SELECT EXISTS(SELECT 1 FROM leave_types WHERE id = 'wfh' AND is_active = true) INTO wfh_exists;
    
    IF NOT wfh_exists THEN
        RAISE EXCEPTION 'Migration failed: WFH leave type not created';
    END IF;
    
    RAISE NOTICE 'Migration completed successfully: % active leave types', leave_type_count;
END $$;

COMMIT;
