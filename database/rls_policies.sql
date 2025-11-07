-- MorvaHR Row Level Security (RLS) Policies for Supabase
-- These policies control data access based on user roles and ownership

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_request_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to check if current user is HR admin
CREATE OR REPLACE FUNCTION is_hr_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND role = 'hr_admin'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM users
        WHERE id = auth.uid()
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Employees can read their own user data
CREATE POLICY "users_select_own"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- HR admins can read all user data
CREATE POLICY "users_select_hr_admin"
    ON users FOR SELECT
    USING (is_hr_admin());

-- HR admins can insert new users
CREATE POLICY "users_insert_hr_admin"
    ON users FOR INSERT
    WITH CHECK (is_hr_admin());

-- Users can update their own data (except role)
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM users WHERE id = auth.uid())
    );

-- HR admins can update any user
CREATE POLICY "users_update_hr_admin"
    ON users FOR UPDATE
    USING (is_hr_admin());

-- ============================================================================
-- ATTENDANCE RECORDS POLICIES
-- ============================================================================

-- Employees can read their own attendance records
CREATE POLICY "attendance_select_own"
    ON attendance_records FOR SELECT
    USING (auth.uid() = user_id);

-- HR admins can read all attendance records
CREATE POLICY "attendance_select_hr_admin"
    ON attendance_records FOR SELECT
    USING (is_hr_admin());

-- Employees can insert their own attendance records
CREATE POLICY "attendance_insert_own"
    ON attendance_records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Employees can update their own attendance records
CREATE POLICY "attendance_update_own"
    ON attendance_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- HR admins can insert any attendance record
CREATE POLICY "attendance_insert_hr_admin"
    ON attendance_records FOR INSERT
    WITH CHECK (is_hr_admin());

-- HR admins can update any attendance record
CREATE POLICY "attendance_update_hr_admin"
    ON attendance_records FOR UPDATE
    USING (is_hr_admin());

-- HR admins can delete attendance records
CREATE POLICY "attendance_delete_hr_admin"
    ON attendance_records FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- LEAVE TYPES POLICIES
-- ============================================================================

-- All authenticated users can read active leave types
CREATE POLICY "leave_types_select_all"
    ON leave_types FOR SELECT
    USING (is_active = true);

-- HR admins can insert leave types
CREATE POLICY "leave_types_insert_hr_admin"
    ON leave_types FOR INSERT
    WITH CHECK (is_hr_admin());

-- HR admins can update leave types
CREATE POLICY "leave_types_update_hr_admin"
    ON leave_types FOR UPDATE
    USING (is_hr_admin());

-- HR admins can delete leave types
CREATE POLICY "leave_types_delete_hr_admin"
    ON leave_types FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- LEAVE REQUESTS POLICIES
-- ============================================================================

-- Employees can read their own leave requests
CREATE POLICY "leave_requests_select_own"
    ON leave_requests FOR SELECT
    USING (auth.uid() = user_id);

-- HR admins can read all leave requests
CREATE POLICY "leave_requests_select_hr_admin"
    ON leave_requests FOR SELECT
    USING (is_hr_admin());

-- Employees can create their own leave requests
CREATE POLICY "leave_requests_insert_own"
    ON leave_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Employees can update their own pending leave requests
CREATE POLICY "leave_requests_update_own"
    ON leave_requests FOR UPDATE
    USING (
        auth.uid() = user_id AND
        status = 'pending'
    )
    WITH CHECK (
        auth.uid() = user_id AND
        status IN ('pending', 'cancelled')
    );

-- HR admins can update any leave request (for approval/rejection)
CREATE POLICY "leave_requests_update_hr_admin"
    ON leave_requests FOR UPDATE
    USING (is_hr_admin());

-- Employees can delete their own pending leave requests
CREATE POLICY "leave_requests_delete_own"
    ON leave_requests FOR DELETE
    USING (
        auth.uid() = user_id AND
        status = 'pending'
    );

-- HR admins can delete any leave request
CREATE POLICY "leave_requests_delete_hr_admin"
    ON leave_requests FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- LEAVE BALANCES POLICIES
-- ============================================================================

-- Employees can read their own leave balances
CREATE POLICY "leave_balances_select_own"
    ON leave_balances FOR SELECT
    USING (auth.uid() = user_id);

-- HR admins can read all leave balances
CREATE POLICY "leave_balances_select_hr_admin"
    ON leave_balances FOR SELECT
    USING (is_hr_admin());

-- HR admins can insert leave balances
CREATE POLICY "leave_balances_insert_hr_admin"
    ON leave_balances FOR INSERT
    WITH CHECK (is_hr_admin());

-- HR admins can update leave balances
CREATE POLICY "leave_balances_update_hr_admin"
    ON leave_balances FOR UPDATE
    USING (is_hr_admin());

-- HR admins can delete leave balances
CREATE POLICY "leave_balances_delete_hr_admin"
    ON leave_balances FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- LEAVE REQUEST ATTACHMENTS POLICIES
-- ============================================================================

-- Users can read attachments for their own leave requests
CREATE POLICY "leave_attachments_select_own"
    ON leave_request_attachments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM leave_requests
            WHERE leave_requests.id = leave_request_attachments.leave_request_id
            AND leave_requests.user_id = auth.uid()
        )
    );

-- HR admins can read all attachments
CREATE POLICY "leave_attachments_select_hr_admin"
    ON leave_request_attachments FOR SELECT
    USING (is_hr_admin());

-- Users can insert attachments for their own leave requests
CREATE POLICY "leave_attachments_insert_own"
    ON leave_request_attachments FOR INSERT
    WITH CHECK (
        auth.uid() = uploaded_by AND
        EXISTS (
            SELECT 1 FROM leave_requests
            WHERE leave_requests.id = leave_request_attachments.leave_request_id
            AND leave_requests.user_id = auth.uid()
        )
    );

-- Users can delete their own attachments for pending leave requests
CREATE POLICY "leave_attachments_delete_own"
    ON leave_request_attachments FOR DELETE
    USING (
        auth.uid() = uploaded_by AND
        EXISTS (
            SELECT 1 FROM leave_requests
            WHERE leave_requests.id = leave_request_attachments.leave_request_id
            AND leave_requests.user_id = auth.uid()
            AND leave_requests.status = 'pending'
        )
    );

-- HR admins can delete any attachment
CREATE POLICY "leave_attachments_delete_hr_admin"
    ON leave_request_attachments FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================

-- All authenticated users can read active announcements
CREATE POLICY "announcements_select_all"
    ON announcements FOR SELECT
    USING (
        is_active = true AND
        (scheduled_time IS NULL OR scheduled_time <= NOW())
    );

-- HR admins can read all announcements (including inactive)
CREATE POLICY "announcements_select_hr_admin"
    ON announcements FOR SELECT
    USING (is_hr_admin());

-- HR admins can insert announcements
CREATE POLICY "announcements_insert_hr_admin"
    ON announcements FOR INSERT
    WITH CHECK (is_hr_admin() AND auth.uid() = created_by);

-- HR admins can update announcements
CREATE POLICY "announcements_update_hr_admin"
    ON announcements FOR UPDATE
    USING (is_hr_admin());

-- HR admins can delete announcements
CREATE POLICY "announcements_delete_hr_admin"
    ON announcements FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- ANNOUNCEMENT VIEWS POLICIES
-- ============================================================================

-- Users can read their own announcement views
CREATE POLICY "announcement_views_select_own"
    ON announcement_views FOR SELECT
    USING (auth.uid() = user_id);

-- HR admins can read all announcement views
CREATE POLICY "announcement_views_select_hr_admin"
    ON announcement_views FOR SELECT
    USING (is_hr_admin());

-- Users can insert their own announcement views
CREATE POLICY "announcement_views_insert_own"
    ON announcement_views FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PAYSLIPS POLICIES
-- ============================================================================

-- Employees can read their own payslips
CREATE POLICY "payslips_select_own"
    ON payslips FOR SELECT
    USING (auth.uid() = user_id);

-- HR admins can read all payslips
CREATE POLICY "payslips_select_hr_admin"
    ON payslips FOR SELECT
    USING (is_hr_admin());

-- HR admins can insert payslips
CREATE POLICY "payslips_insert_hr_admin"
    ON payslips FOR INSERT
    WITH CHECK (is_hr_admin());

-- HR admins can update payslips
CREATE POLICY "payslips_update_hr_admin"
    ON payslips FOR UPDATE
    USING (is_hr_admin());

-- HR admins can delete payslips
CREATE POLICY "payslips_delete_hr_admin"
    ON payslips FOR DELETE
    USING (is_hr_admin());

-- ============================================================================
-- STORAGE POLICIES (for Supabase Storage)
-- ============================================================================

-- Note: These should be applied in the Supabase dashboard or via SQL commands
-- Storage bucket: 'leave-attachments'
-- Policy: Authenticated users can upload files
-- Policy: Users can read files they uploaded or files from their leave requests
-- Policy: HR admins can read all files

-- Storage bucket: 'payslips'
-- Policy: Only HR admins can upload payslip PDFs
-- Policy: Users can read their own payslips
-- Policy: HR admins can read all payslips

-- Example storage policy (to be applied to storage.objects):
/*
CREATE POLICY "leave_attachments_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "leave_attachments_read_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "payslips_read_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'payslips' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
*/


