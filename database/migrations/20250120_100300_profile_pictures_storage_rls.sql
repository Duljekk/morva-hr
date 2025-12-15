-- Migration: Profile Pictures Storage RLS Policies
-- Description: Create RLS policies for profile-pictures storage bucket
-- Date: 2025-01-20

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile picture
CREATE POLICY "profile_pictures_select_own"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'profile-pictures' AND
        (auth.uid()::text = (storage.foldername(name))[1] OR is_hr_admin())
    );

-- Policy: HR admins can view all profile pictures
CREATE POLICY "profile_pictures_select_hr_admin"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'profile-pictures' AND
        is_hr_admin()
    );

-- Policy: Users can upload their own profile picture
CREATE POLICY "profile_pictures_insert_own"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-pictures' AND
        (auth.uid()::text = (storage.foldername(name))[1] OR is_hr_admin())
    );

-- Policy: HR admins can upload profile pictures for any user
CREATE POLICY "profile_pictures_insert_hr_admin"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-pictures' AND
        is_hr_admin()
    );

-- Policy: Users can update their own profile picture
CREATE POLICY "profile_pictures_update_own"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-pictures' AND
        (auth.uid()::text = (storage.foldername(name))[1] OR is_hr_admin())
    )
    WITH CHECK (
        bucket_id = 'profile-pictures' AND
        (auth.uid()::text = (storage.foldername(name))[1] OR is_hr_admin())
    );

-- Policy: HR admins can update any profile picture
CREATE POLICY "profile_pictures_update_hr_admin"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-pictures' AND
        is_hr_admin()
    )
    WITH CHECK (
        bucket_id = 'profile-pictures' AND
        is_hr_admin()
    );

-- Policy: Users can delete their own profile picture
CREATE POLICY "profile_pictures_delete_own"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-pictures' AND
        (auth.uid()::text = (storage.foldername(name))[1] OR is_hr_admin())
    );

-- Policy: HR admins can delete any profile picture
CREATE POLICY "profile_pictures_delete_hr_admin"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-pictures' AND
        is_hr_admin()
    );

