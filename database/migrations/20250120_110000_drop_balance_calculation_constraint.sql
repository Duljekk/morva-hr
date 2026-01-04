-- Drop the constraint that enforces balance = allocated - used
-- This is necessary to allow setting initial balance to 0 while keeping allocated at 12 (for accrual scenarios)
ALTER TABLE leave_balances DROP CONSTRAINT IF EXISTS valid_balance_calculation;
