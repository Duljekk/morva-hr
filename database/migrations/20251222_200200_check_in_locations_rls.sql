-- Enable RLS on check_in_locations table
ALTER TABLE check_in_locations ENABLE ROW LEVEL SECURITY;

-- Policy: HR admins can manage all locations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "HR admins can manage all locations"
ON check_in_locations
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'hr_admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'hr_admin'
    )
);

-- Policy: All authenticated users can view active locations
CREATE POLICY "All users can view active locations"
ON check_in_locations
FOR SELECT
TO authenticated
USING (is_active = TRUE);
