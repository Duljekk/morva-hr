-- MorvaHR Seed Data
-- Initial data for leave types and other reference tables

-- ============================================================================
-- LEAVE TYPES
-- ============================================================================

-- Insert predefined leave types
INSERT INTO leave_types (id, name, requires_approval, requires_attachment, max_days_per_year, is_active) VALUES
    ('sick', 'Sick Leave', true, true, NULL, true),
    ('annual', 'Annual Leave', true, false, 20, true),
    ('unpaid', 'Unpaid Leave', true, false, NULL, true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

-- Sick Leave: Requires approval and medical documentation (doctor's note)
-- Annual Leave: Requires approval, limited to 20 days per year
-- Unpaid Leave: Requires approval, no limits






