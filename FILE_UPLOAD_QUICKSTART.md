# 🚀 File Upload Quick Start

## Get Started in 3 Steps

### Step 1: Create Storage Bucket (2 minutes)

1. Open **Supabase Dashboard** → **Storage**
2. Click **"New Bucket"**
3. Name: `leave-attachments`
4. Public: **Unchecked** (Private)
5. Click **"Create"**

### Step 2: Apply Storage Policies (1 minute)

1. Go to **SQL Editor**
2. Run this query:

```sql
-- Allow users to upload/read/delete their own files
CREATE POLICY "leave_attachments_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "leave_attachments_read_own"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "leave_attachments_delete_own"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'leave-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Test It (1 minute)

1. Run: `npm run dev`
2. Navigate to **Request Leave** (`/request-leave`)
3. Upload a PDF file
4. Check **Storage** in Supabase Dashboard → You should see your file!

---

## ✅ That's It!

Your file upload feature is now ready to use.

## 📚 More Information

- **Setup Details:** See `FILE_UPLOAD_SETUP_GUIDE.md`
- **Testing Guide:** See `FILE_UPLOAD_TESTING.md`
- **Technical Docs:** See `FILE_UPLOAD_IMPLEMENTATION_SUMMARY.md`

## 🐛 Troubleshooting

**Upload fails?**
- ✅ Check bucket name is exactly `leave-attachments`
- ✅ Check storage policies are applied
- ✅ Check you're logged in

**Need help?**
- Check browser console for errors
- Check server logs (terminal)
- See troubleshooting section in `FILE_UPLOAD_SETUP_GUIDE.md`

---

**Happy uploading!** 🎉


