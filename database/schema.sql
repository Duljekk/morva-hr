-- MorvaHR Database Schema for Supabase (PostgreSQL)
-- This schema includes all tables, enums, constraints, and indexes for the HR application

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User role enumeration
CREATE TYPE user_role AS ENUM ('employee', 'hr_admin');

-- Check-in status enumeration
CREATE TYPE check_in_status AS ENUM ('ontime', 'late');

-- Check-out status enumeration
CREATE TYPE check_out_status AS ENUM ('ontime', 'overtime');

-- Day type for leave requests
CREATE TYPE day_type AS ENUM ('full', 'half');

-- Leave request status
CREATE TYPE leave_request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
-- Core user table that extends Supabase auth.users
-- Stores employee and HR admin information
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    employee_id TEXT UNIQUE,
    shift_start_hour INTEGER NOT NULL DEFAULT 11,
    shift_end_hour INTEGER NOT NULL DEFAULT 19,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Constraints
    CONSTRAINT valid_shift_hours CHECK (
        shift_start_hour >= 0 AND 
        shift_start_hour < 24 AND 
        shift_end_hour >= 0 AND 
        shift_end_hour < 24 AND
        shift_end_hour > shift_start_hour
    )
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ----------------------------------------------------------------------------
-- 2. ATTENDANCE RECORDS TABLE
-- ----------------------------------------------------------------------------
-- Tracks daily check-in and check-out records for employees
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    check_in_status check_in_status,
    check_out_status check_out_status,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_date UNIQUE(user_id, date),
    CONSTRAINT valid_checkout_time CHECK (
        check_out_time IS NULL OR 
        check_in_time IS NULL OR 
        check_out_time > check_in_time
    ),
    CONSTRAINT valid_total_hours CHECK (total_hours IS NULL OR total_hours >= 0),
    CONSTRAINT valid_overtime_hours CHECK (overtime_hours >= 0)
);

-- Indexes for attendance_records table
CREATE INDEX idx_attendance_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_user_date ON attendance_records(user_id, date);

-- ----------------------------------------------------------------------------
-- 3. LEAVE TYPES TABLE
-- ----------------------------------------------------------------------------
-- Predefined types of leave that employees can request
CREATE TABLE leave_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    requires_attachment BOOLEAN NOT NULL DEFAULT FALSE,
    max_days_per_year INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_max_days CHECK (max_days_per_year IS NULL OR max_days_per_year > 0)
);

-- Index for leave_types table
CREATE INDEX idx_leave_types_is_active ON leave_types(is_active);

-- ----------------------------------------------------------------------------
-- 4. LEAVE REQUESTS TABLE
-- ----------------------------------------------------------------------------
-- Employee leave requests with approval workflow
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id TEXT NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_type day_type NOT NULL DEFAULT 'full',
    total_days DECIMAL(4,2) NOT NULL,
    reason TEXT NOT NULL,
    status leave_request_status NOT NULL DEFAULT 'pending',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT valid_total_days CHECK (total_days > 0),
    CONSTRAINT valid_approval CHECK (
        (status = 'approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL) OR
        (status = 'rejected' AND approved_by IS NOT NULL AND approved_at IS NOT NULL AND rejection_reason IS NOT NULL) OR
        (status IN ('pending', 'cancelled'))
    )
);

-- Indexes for leave_requests table
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_start_date ON leave_requests(start_date);
CREATE INDEX idx_leave_requests_end_date ON leave_requests(end_date);
CREATE INDEX idx_leave_requests_user_status ON leave_requests(user_id, status);

-- ----------------------------------------------------------------------------
-- 5. LEAVE BALANCES TABLE
-- ----------------------------------------------------------------------------
-- Tracks remaining leave balance per user per leave type per year
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id TEXT NOT NULL REFERENCES leave_types(id),
    balance DECIMAL(6,2) NOT NULL DEFAULT 0,
    allocated DECIMAL(6,2) NOT NULL DEFAULT 0,
    used DECIMAL(6,2) NOT NULL DEFAULT 0,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_leave_type_year UNIQUE(user_id, leave_type_id, year),
    CONSTRAINT valid_balance CHECK (balance >= 0),
    CONSTRAINT valid_allocated CHECK (allocated >= 0),
    CONSTRAINT valid_used CHECK (used >= 0),
    CONSTRAINT valid_balance_calculation CHECK (balance = allocated - used),
    CONSTRAINT valid_year CHECK (year >= 2000 AND year <= 2100)
);

-- Indexes for leave_balances table
CREATE INDEX idx_leave_balances_user_id ON leave_balances(user_id);
CREATE INDEX idx_leave_balances_user_leave_year ON leave_balances(user_id, leave_type_id, year);

-- ----------------------------------------------------------------------------
-- 6. LEAVE REQUEST ATTACHMENTS TABLE
-- ----------------------------------------------------------------------------
-- File attachments for leave requests (e.g., doctor's notes)
CREATE TABLE leave_request_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- Indexes for leave_request_attachments table
CREATE INDEX idx_leave_attachments_request_id ON leave_request_attachments(leave_request_id);
CREATE INDEX idx_leave_attachments_uploaded_by ON leave_request_attachments(uploaded_by);

-- ----------------------------------------------------------------------------
-- 7. ANNOUNCEMENTS TABLE
-- ----------------------------------------------------------------------------
-- Company-wide announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for announcements table
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_scheduled_time ON announcements(scheduled_time);
CREATE INDEX idx_announcements_created_by ON announcements(created_by);

-- ----------------------------------------------------------------------------
-- 8. ANNOUNCEMENT VIEWS TABLE
-- ----------------------------------------------------------------------------
-- Tracks which users have viewed which announcements
CREATE TABLE announcement_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_announcement_user UNIQUE(announcement_id, user_id)
);

-- Indexes for announcement_views table
CREATE INDEX idx_announcement_views_announcement_id ON announcement_views(announcement_id);
CREATE INDEX idx_announcement_views_user_id ON announcement_views(user_id);

-- ----------------------------------------------------------------------------
-- 9. PAYSLIPS TABLE
-- ----------------------------------------------------------------------------
-- Employee payslip records for download
CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    gross_salary DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    deductions JSONB,
    allowances JSONB,
    pdf_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_user_month_year UNIQUE(user_id, month, year),
    CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
    CONSTRAINT valid_year CHECK (year >= 2000 AND year <= 2100),
    CONSTRAINT valid_gross_salary CHECK (gross_salary >= 0),
    CONSTRAINT valid_net_salary CHECK (net_salary >= 0),
    CONSTRAINT valid_file_size CHECK (file_size IS NULL OR file_size > 0)
);

-- Indexes for payslips table
CREATE INDEX idx_payslips_user_id ON payslips(user_id);
CREATE INDEX idx_payslips_user_year_month ON payslips(user_id, year, month);
CREATE INDEX idx_payslips_year_month ON payslips(year, month);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
    BEFORE UPDATE ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_balances_updated_at
    BEFORE UPDATE ON leave_balances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payslips_updated_at
    BEFORE UPDATE ON payslips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'Core user table extending Supabase auth.users';
COMMENT ON TABLE attendance_records IS 'Daily check-in and check-out records';
COMMENT ON TABLE leave_types IS 'Predefined leave types (sick, annual, unpaid)';
COMMENT ON TABLE leave_requests IS 'Employee leave requests with approval workflow';
COMMENT ON TABLE leave_balances IS 'Leave balance tracking per user per year';
COMMENT ON TABLE leave_request_attachments IS 'File attachments for leave requests';
COMMENT ON TABLE announcements IS 'Company-wide announcements';
COMMENT ON TABLE announcement_views IS 'Tracks which users viewed which announcements';
COMMENT ON TABLE payslips IS 'Employee payslip records for download';


