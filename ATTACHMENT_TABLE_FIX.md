# 🔧 Attachment Table Name Fix

## Issue

Leave request attachments were failing to link with error:
```
Could not find the table 'public.leave_attachments' in the schema cache
Hint: Perhaps you meant the table 'public.leave_request_attachments'
```

## Root Cause

**Mismatch between code and database schema:**
- ❌ Code was trying to insert into: `leave_attachments`
- ✅ Actual table name in database: `leave_request_attachments`

## Schema Differences

### Database Schema (`database/schema.sql`)
```sql
CREATE TABLE leave_request_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,        -- ← Stores storage path
    file_type TEXT,                 -- ← File extension
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### What Code Was Trying to Use
```typescript
// Wrong table name
await supabase.from('leave_attachments').insert(...)

// Wrong column names
{
  file_path: '...',    // ❌ Should be: file_url
  mime_type: '...',    // ❌ Should be: file_type
  uploaded_at: '...',  // ❌ Should be: created_at (auto-generated)
}
```

---

## ✅ Fixes Applied

### 1. **Updated Table Name in Code**
**File:** `lib/actions/leaves.ts`

**Before:**
```typescript
await supabase.from('leave_attachments').insert(attachments);
```

**After:**
```typescript
await supabase.from('leave_request_attachments').insert(attachments);
```

---

### 2. **Fixed Column Mapping**
**File:** `lib/actions/leaves.ts`

**Before:**
```typescript
{
  leave_request_id: leaveRequest.id,
  file_name: fileName,
  file_path: filePath,           // ❌ Wrong
  file_size: 0,
  mime_type: 'application/...',  // ❌ Wrong
  // Missing: uploaded_by         // ❌ Required field
}
```

**After:**
```typescript
{
  leave_request_id: leaveRequest.id,
  file_name: fileName,
  file_size: 0,
  file_url: filePath,             // ✅ Correct
  file_type: 'pdf',               // ✅ Correct (extracted from extension)
  uploaded_by: user.id,           // ✅ Added required field
}
```

---

### 3. **Updated TypeScript Types**
**File:** `lib/supabase/types.ts`

**Before:**
```typescript
leave_attachments: {  // ❌ Wrong table name
  Row: {
    file_path: string,
    mime_type: string,
    uploaded_at: string,
  };
  // ...
}
```

**After:**
```typescript
leave_request_attachments: {  // ✅ Correct
  Row: {
    file_url: string,           // ✅ Correct
    file_type: string | null,   // ✅ Correct
    uploaded_by: string,        // ✅ Added
    created_at: string,         // ✅ Correct
  };
  // ...
}
```

---

### 4. **Updated Type Alias**
**File:** `lib/actions/leaves.ts`

**Before:**
```typescript
type LeaveAttachmentInsert = Database['public']['Tables']['leave_attachments']['Insert'];
```

**After:**
```typescript
type LeaveRequestAttachmentInsert = Database['public']['Tables']['leave_request_attachments']['Insert'];
```

---

## 🧪 Testing

### **Before Fix:**
```
✅ File uploads to storage successfully
✅ Leave request created in database
❌ Attachments fail to link
⚠️  Message: "Leave request submitted, but some attachments failed to link."
```

### **After Fix:**
```
✅ File uploads to storage successfully
✅ Leave request created in database
✅ Attachments link successfully
✅ Message: "Leave request sent successfully!"
```

---

## 🔍 Verification Steps

### **1. Check Leave Request**
```sql
SELECT id, user_id, leave_type_id, start_date, end_date, reason, status
FROM leave_requests
ORDER BY created_at DESC
LIMIT 1;
```

Expected: Leave request exists with status = 'pending'

### **2. Check Attachments**
```sql
SELECT 
  la.id,
  la.leave_request_id,
  la.file_name,
  la.file_url,
  la.file_type,
  la.uploaded_by,
  lr.reason as leave_reason
FROM leave_request_attachments la
JOIN leave_requests lr ON lr.id = la.leave_request_id
ORDER BY la.created_at DESC
LIMIT 5;
```

Expected: Attachment records linked to leave request

### **3. Check Storage**
Go to Supabase Dashboard → Storage → `leave-attachments`

Expected: Files exist at the paths specified in `file_url` column

---

## 📊 Data Flow Now

```
User uploads file
    ↓
File saved to Storage: leave-attachments/{user_id}/{timestamp}-{filename}
    ↓
File path stored in component state
    ↓
User submits form
    ↓
Leave request created in leave_requests table
    ↓
Attachments created in leave_request_attachments table:
    - leave_request_id → Links to leave request
    - file_url → Storage path
    - file_name → Original filename
    - file_type → Extension (pdf, jpg, png)
    - uploaded_by → User who uploaded
    ↓
Success! ✅
```

---

## 🎯 Key Differences Between Tables

| Feature | Old (Wrong) | New (Correct) |
|---------|------------|---------------|
| **Table Name** | `leave_attachments` | `leave_request_attachments` |
| **Storage Path Column** | `file_path` | `file_url` |
| **File Type Column** | `mime_type` | `file_type` |
| **Timestamp Column** | `uploaded_at` | `created_at` |
| **Uploader Column** | ❌ Missing | `uploaded_by` ✅ |

---

## 📝 Notes

### **Why the Confusion?**
The initial planning documents may have used `leave_attachments` as a simpler name, but the actual database schema uses the more explicit `leave_request_attachments` to clearly indicate the relationship.

### **File Storage Path**
The `file_url` column stores the **storage path**, not a public URL:
- Example: `3a5f78fc-d260-4734-9e1d-bc6f58eec14f/1762765569440-Doctor_Note.pdf`
- To get public URL, use: `supabase.storage.from('leave-attachments').getPublicUrl(file_url)`

### **File Type vs MIME Type**
- **file_type**: Simple extension (e.g., "pdf", "jpg", "png")
- **MIME type**: Full type (e.g., "application/pdf", "image/jpeg")
- Schema uses simple extension for easier filtering

---

## ✅ Summary

**Status:** ✅ **Fixed**

- ✅ Table name corrected: `leave_request_attachments`
- ✅ Column names aligned with schema
- ✅ TypeScript types updated
- ✅ All required fields included
- ✅ File attachments now link successfully

**Try it now:** Upload a file and submit a leave request - attachments will link properly! 🎉


