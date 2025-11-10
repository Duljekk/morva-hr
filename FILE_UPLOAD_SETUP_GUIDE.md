# 📁 File Upload Setup Guide

## Prerequisites

Before the file upload feature will work, you **must** create the Supabase Storage bucket manually.

---

## 🪣 Step 1: Create Storage Bucket

### Via Supabase Dashboard:

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** (in the left sidebar)
3. Click **"New Bucket"** or **"Create Bucket"**
4. Configure the bucket:
   - **Name:** `leave-attachments`
   - **Public:** ❌ **Unchecked** (Private bucket)
   - **Allowed MIME types:** Leave empty (controlled by application)
   - **File size limit:** Leave default or set to 5MB

5. Click **"Create Bucket"** or **"Save"**

### Via Supabase MCP (Alternative):

If you have the Supabase MCP tools available, you could create it programmatically, but the dashboard method is recommended for initial setup.

---

## 🔐 Step 2: Apply Storage Policies

The storage policies are already defined in `database/rls_policies.sql` (lines 369-391). You need to execute them in your Supabase database:

### Option A: SQL Editor (Recommended)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy and paste the following policies:

```sql
-- Storage policies for leave attachments

-- Allow users to upload files to their own folder
CREATE POLICY "leave_attachments_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own files
CREATE POLICY "leave_attachments_read_own"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files (optional, for cleanup)
CREATE POLICY "leave_attachments_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

4. Click **"Run"** to execute

### Option B: Via Migration

If you haven't already applied the RLS policies from `database/rls_policies.sql`, run the entire file in SQL Editor.

---

## ✅ Step 3: Verify Setup

After creating the bucket and applying policies, verify the setup:

### Test in Supabase Dashboard:

1. Go to **Storage** → **leave-attachments**
2. You should see an empty bucket
3. The bucket should show as **Private** (with a lock icon)

### Test File Upload:

1. Run your development server: `npm run dev`
2. Navigate to **Request Leave** page
3. Try uploading a test PDF or image file
4. Check the **Storage** bucket in Supabase Dashboard to see if the file appears

---

## 🗂️ File Organization

Files are automatically organized by user ID:

```
leave-attachments/
├── {user-id-1}/
│   ├── 1234567890-document.pdf
│   ├── 1234567891-medical-cert.jpg
│   └── ...
├── {user-id-2}/
│   ├── 1234567892-form.pdf
│   └── ...
└── ...
```

**Why this structure?**
- Each user can only access their own folder (enforced by RLS)
- Prevents name collisions between users
- Timestamp prefix prevents duplicate filenames

---

## 🔒 Security Features

The implementation includes multiple security layers:

### 1. Client-Side Validation
- File type checking (PDF, JPG, PNG only)
- File size limit (5MB max)
- File count limit (5 files max)

### 2. Server-Side Validation
- Re-validates file type and size
- Checks MIME type (not just extension)
- Authenticates user before upload

### 3. Database-Level Security (RLS)
- Users can only upload to their own folder
- Users can only read their own files
- Users can only delete their own files

---

## 🐛 Troubleshooting

### Issue: "Failed to upload file"

**Possible causes:**
1. Storage bucket not created
2. Storage policies not applied
3. Bucket name mismatch (must be exactly `leave-attachments`)
4. User not authenticated

**Solution:**
- Verify bucket exists in Supabase Dashboard
- Check bucket name spelling
- Ensure storage policies are applied
- Confirm user is logged in

### Issue: "403 Forbidden" or "RLS policy violation"

**Cause:** Storage policies not applied or incorrect

**Solution:**
- Go to SQL Editor and run the storage policies again
- Ensure the bucket is set to **Private** (not public)
- Check that `auth.uid()` matches the folder structure

### Issue: Files upload but can't be viewed

**Cause:** Read policy not applied

**Solution:**
- Apply the `leave_attachments_read_own` policy
- Check that you're logged in as the same user who uploaded

---

## 📊 Monitoring Uploads

### View Uploaded Files:

1. Go to **Supabase Dashboard** → **Storage**
2. Click on **leave-attachments** bucket
3. Navigate to a user's folder (by UUID)
4. You'll see all files uploaded by that user

### Check Storage Usage:

1. Go to **Supabase Dashboard** → **Settings** → **Usage**
2. Check **Storage** section for total usage

---

## 🧹 Cleanup Orphaned Files (Optional)

Files are uploaded immediately when selected, but if a user doesn't submit the form, files may be "orphaned" (uploaded but not linked to a leave request).

To clean up orphaned files, you could:

1. Create a scheduled job (cron) to find and delete old orphaned files
2. Check `leave_attachments` table for file paths
3. Delete files from storage that don't have matching database records

This is optional and not critical for MVP functionality.

---

## 🎉 Next Steps

Once setup is complete:

1. ✅ Bucket created
2. ✅ Policies applied
3. ✅ Bucket verified in dashboard

You're ready to test the file upload feature! See `FILE_UPLOAD_TESTING.md` for testing scenarios.


