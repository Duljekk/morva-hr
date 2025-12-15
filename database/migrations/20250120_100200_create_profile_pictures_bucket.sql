-- Migration: Create Profile Pictures Storage Bucket
-- Description: Create private storage bucket for employee profile pictures with size and MIME type restrictions
-- Date: 2025-01-20

-- Create profile-pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  false, -- Private bucket
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'] -- Allowed MIME types
)
ON CONFLICT (id) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE storage.buckets IS 'Storage bucket for employee profile pictures. Private bucket with 5MB size limit and image MIME type restrictions.';

