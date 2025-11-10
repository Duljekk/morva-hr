-- Storage policies for leave attachments
-- Run this after creating the 'leave-attachments' bucket

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "leave_attachments_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to read their own files
CREATE POLICY "leave_attachments_read_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
CREATE POLICY "leave_attachments_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);


