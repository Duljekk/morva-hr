-- Migration: Seed Leave Balances for Existing Users
-- Created: 2025-12-18
-- Description: Initialize leave_balances rows for all active employees with 12 PTO, 5 Sick, 5 WFH for current year

BEGIN;

-- Seed annual leave (PTO) - 12 days allocated
INSERT INTO leave_balances (user_id, leave_type_id, allocated, used, balance, year)
SELECT u.id, 'annual', 12, 0, 12, EXTRACT(YEAR FROM NOW())::int
FROM users u
WHERE u.is_active = true AND u.role = 'employee'
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- Seed sick leave - 5 days allocated
INSERT INTO leave_balances (user_id, leave_type_id, allocated, used, balance, year)
SELECT u.id, 'sick', 5, 0, 5, EXTRACT(YEAR FROM NOW())::int
FROM users u
WHERE u.is_active = true AND u.role = 'employee'
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- Seed WFH leave - 5 days allocated
INSERT INTO leave_balances (user_id, leave_type_id, allocated, used, balance, year)
SELECT u.id, 'wfh', 5, 0, 5, EXTRACT(YEAR FROM NOW())::int
FROM users u
WHERE u.is_active = true AND u.role = 'employee'
ON CONFLICT (user_id, leave_type_id, year) DO NOTHING;

-- Verify migration
DO $$
DECLARE
    balance_count INTEGER;
    user_count INTEGER;
    current_year INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM NOW())::int;
    
    SELECT COUNT(*) INTO user_count 
    FROM users 
    WHERE is_active = true AND role = 'employee';
    
    SELECT COUNT(*) INTO balance_count 
    FROM leave_balances 
    WHERE year = current_year;
    
    -- Each user should have 3 leave types
    IF balance_count < user_count * 3 THEN
        RAISE NOTICE 'Warning: Expected % balance rows, found %', user_count * 3, balance_count;
    END IF;
    
    RAISE NOTICE 'Migration completed: % leave balance rows seeded for % users (year %)', 
        balance_count, user_count, current_year;
END $$;

COMMIT;
