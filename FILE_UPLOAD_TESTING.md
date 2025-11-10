# 🧪 File Upload Testing Guide

## Overview

This guide covers all test scenarios for the leave request file upload feature, including happy paths, error cases, and edge cases.

---

## ✅ Prerequisites

Before testing, ensure:

1. ✅ Storage bucket `leave-attachments` is created (see `FILE_UPLOAD_SETUP_GUIDE.md`)
2. ✅ Storage policies are applied
3. ✅ Development server is running (`npm run dev`)
4. ✅ You're logged in as a test user
5. ✅ You have test files ready (PDF, JPG, PNG)

---

## 🎯 Test Scenarios

### 1. Valid File Upload - Happy Path

**Objective:** Test that valid files upload successfully

**Steps:**
1. Navigate to **Request Leave** page (`/request-leave`)
2. Click **"Upload Document"** or the upload area
3. Select a valid PDF file (<5MB)
4. Observe upload progress

**Expected Results:**
- ✅ File appears in the uploaded files list
- ✅ File name and size are displayed correctly
- ✅ Upload indicator shows during upload
- ✅ Upload indicator disappears after completion
- ✅ No error messages

**Test Files:**
- `test-document.pdf` (2MB)
- `medical-certificate.pdf` (1MB)

---

### 2. Multiple File Uploads

**Objective:** Test uploading multiple files

**Steps:**
1. Upload a PDF file
2. Wait for upload to complete
3. Upload a JPG image
4. Upload a PNG image
5. Upload 2 more files (total 5)

**Expected Results:**
- ✅ All 5 files appear in the list
- ✅ Each file uploads independently
- ✅ Can scroll horizontally if needed
- ✅ Upload button still works

**Try to upload 6th file:**
- ❌ Should show error: "Maximum 5 files allowed"

---

### 3. File Type Validation

**Objective:** Test that only PDF, JPG, PNG are accepted

**Valid file types:**
1. Upload `.pdf` file → ✅ Should work
2. Upload `.jpg` file → ✅ Should work
3. Upload `.jpeg` file → ✅ Should work
4. Upload `.png` file → ✅ Should work

**Invalid file types:**
1. Upload `.docx` file → ❌ Should show error: "Invalid file type. Please upload PDF, JPG, or PNG files only."
2. Upload `.txt` file → ❌ Should show error
3. Upload `.zip` file → ❌ Should show error
4. Upload `.gif` file → ❌ Should show error

---

### 4. File Size Validation

**Objective:** Test 5MB file size limit

**Steps:**
1. Create or find files of different sizes
2. Upload files under 5MB → ✅ Should work
3. Upload file exactly 5MB → ✅ Should work
4. Upload file over 5MB (e.g., 6MB) → ❌ Should show error

**Expected Error:**
- "File size exceeds 5MB limit. Please choose a smaller file."

**Test Files:**
- Small: 100KB file → ✅
- Medium: 2.5MB file → ✅
- Limit: 5MB file → ✅
- Over: 6MB file → ❌

---

### 5. File Removal

**Objective:** Test removing uploaded files

**Steps:**
1. Upload 3 files
2. Wait for all uploads to complete
3. Click the "×" button on the first file
4. Click the "×" button on the second file

**Expected Results:**
- ✅ File is removed from UI immediately
- ✅ File is deleted from Supabase Storage
- ✅ Remaining files stay intact
- ✅ Can upload more files after removal

**Verify in Supabase Dashboard:**
- Check Storage → leave-attachments → {your-user-id}/
- Removed files should not be there

---

### 6. Leave Balance Display

**Objective:** Test that leave balances show correctly

**Steps:**
1. Click on **Leave Type** dropdown
2. Observe balance info under each leave type

**Expected Results:**
- ✅ "X of Y days left" for types with quotas (Sick, Annual)
- ✅ "No quota limit" for unpaid leave
- ✅ Loading state shows briefly while fetching
- ✅ If balance is 0: "No days remaining" + option disabled

**Test with Different Balances:**
Create test data with:
- Full balance: 12 of 12 days
- Partial: 5 of 12 days
- Zero: 0 of 12 days (should disable option)

---

### 7. Form Submission - With Files

**Objective:** Test submitting leave request with attachments

**Steps:**
1. Select leave type: **Sick Leave**
2. Select dates: Today to Tomorrow (2 days)
3. Enter reason: "Medical appointment"
4. Upload 2 files (PDF and JPG)
5. Wait for uploads to complete
6. Click **"Send Request"**

**Expected Results:**
- ✅ Loading state shows: "Submitting..."
- ✅ Button is disabled during submission
- ✅ Success alert: "Leave request sent successfully!"
- ✅ Redirects to home page (`/`)

**Verify in Supabase Dashboard:**
1. Check `leave_requests` table → New record exists
2. Check `leave_attachments` table → 2 records linked to the request
3. Check Storage → Files still exist (not deleted after submission)

---

### 8. Form Submission - Without Files

**Objective:** Test submitting without attachments

**Steps:**
1. Fill out all required fields
2. Do NOT upload any files
3. Click **"Send Request"**

**Expected Results:**
- ✅ Form submits successfully
- ✅ No attachment records created
- ✅ Leave request record created

---

### 9. Form Validation

**Objective:** Test required field validation

**Test missing reason:**
1. Select dates
2. Leave reason empty
3. Click **"Send Request"**
4. Expected error: "Please provide a reason for your leave request"

**Test invalid date range:**
- Start date: Jan 10
- End date: Jan 5
- Form should auto-adjust end date to match start date

**Test submitting while files are uploading:**
1. Upload a large file (slow upload)
2. Quickly click **"Send Request"** before upload completes
3. Expected error: "Please wait for all files to finish uploading"

**Test failed upload:**
1. Upload a file
2. If upload fails, try to submit
3. Expected error: "Please remove failed uploads before submitting"

---

### 10. Insufficient Leave Balance

**Objective:** Test balance validation on submission

**Prerequisites:**
- Set up user with low leave balance (e.g., 2 days remaining)

**Steps:**
1. Select leave type with low balance
2. Request 5 days of leave (exceeds balance)
3. Click **"Send Request"**

**Expected Results:**
- ❌ Error: "Insufficient leave balance. You have 2 days remaining."
- ❌ Form does not submit
- ✅ Uploaded files remain (not deleted)

---

### 11. Network Error Handling

**Objective:** Test behavior when network fails

**Simulate network error:**
1. Open browser DevTools
2. Go to Network tab
3. Enable "Offline" mode or throttle to "Offline"
4. Try to upload a file

**Expected Results:**
- ❌ Upload fails gracefully
- ❌ Error message shown
- ✅ UI doesn't crash
- ✅ User can retry after reconnecting

---

### 12. Authentication Expiry

**Objective:** Test behavior when session expires

**Steps:**
1. Start uploading files
2. In another tab, log out of Supabase
3. Continue uploading in the original tab

**Expected Results:**
- ❌ Upload fails with auth error
- ❌ Error message: "You must be logged in to upload files"
- ✅ User is prompted to log in again

---

### 13. Half-Day Leave

**Objective:** Test half-day calculation

**Steps:**
1. Select same date for start and end (e.g., today)
2. Select **"Half Day"** chip
3. Upload file
4. Submit request

**Verify:**
- ✅ `total_days` in database = 0.5
- ✅ Balance decreases by 0.5 days

---

### 14. Full-Day Leave

**Objective:** Test full-day calculation

**Steps:**
1. Select same date for start and end
2. Select **"Full Day"** chip
3. Submit request

**Verify:**
- ✅ `total_days` in database = 1
- ✅ Balance decreases by 1 day

---

### 15. Multi-Day Leave

**Objective:** Test date range calculation

**Steps:**
1. Select start date: Jan 1
2. Select end date: Jan 5
3. Observe **"5 Days Off"** badge
4. Submit request

**Verify:**
- ✅ `total_days` in database = 5
- ✅ Balance decreases by 5 days

---

### 16. File Security - Access Control

**Objective:** Verify RLS policies prevent unauthorized access

**Prerequisites:**
- Two test users: User A and User B

**Steps:**
1. Log in as **User A**
2. Upload a file
3. Note the file path in Storage
4. Log out
5. Log in as **User B**
6. Try to access User A's file URL directly

**Expected Results:**
- ❌ User B **cannot** see or download User A's file
- ❌ 403 Forbidden or access denied
- ✅ RLS policies are working correctly

---

### 17. Concurrent Uploads

**Objective:** Test uploading multiple files simultaneously

**Steps:**
1. Select 3 files at once (multi-select in file picker)
2. Observe upload behavior

**Expected Results:**
- ✅ All 3 files upload in parallel
- ✅ Each file shows its own progress
- ✅ All complete successfully
- ✅ No race conditions or errors

---

### 18. File with Special Characters

**Objective:** Test file name sanitization

**Steps:**
1. Upload file named: `Leave Form (v2.1) - Final [Updated].pdf`
2. Observe stored file name

**Expected Results:**
- ✅ File uploads successfully
- ✅ File name is sanitized (special chars replaced with `_`)
- ✅ Timestamp is prepended
- ✅ File is accessible

---

### 19. Browser Refresh During Upload

**Objective:** Test orphaned file handling

**Steps:**
1. Start uploading a large file
2. Refresh the page before upload completes
3. Check Storage bucket in Supabase

**Expected Results:**
- ⚠️ File may be partially uploaded (orphaned)
- ✅ No database record exists
- ⚠️ File will need manual cleanup or scheduled cleanup job

**Note:** This is acceptable behavior. Orphaned file cleanup can be implemented later if needed.

---

### 20. Leave Type with Zero Balance

**Objective:** Test UI when leave type has no remaining days

**Prerequisites:**
- User has 0 days remaining for "Sick Leave"

**Steps:**
1. Open Leave Type selector
2. Observe "Sick Leave" option

**Expected Results:**
- ✅ Option shows "No days remaining"
- ✅ Option is disabled (grayed out, can't select)
- ✅ Radio button is disabled
- ✅ Other types are still selectable

---

## 🔍 Manual Testing Checklist

Use this checklist to track your testing progress:

### File Upload
- [ ] Upload PDF file
- [ ] Upload JPG file
- [ ] Upload PNG file
- [ ] Upload invalid file type
- [ ] Upload file >5MB
- [ ] Upload 5 files (max limit)
- [ ] Try uploading 6th file
- [ ] Remove uploaded file

### Form Submission
- [ ] Submit with attachments
- [ ] Submit without attachments
- [ ] Submit with missing reason
- [ ] Submit while file is uploading
- [ ] Submit with failed upload
- [ ] Submit with insufficient balance

### Leave Balance
- [ ] View leave balances in dropdown
- [ ] Balance displays correctly
- [ ] Zero balance disables option
- [ ] Unlimited leave shows "No quota limit"

### Edge Cases
- [ ] Network error during upload
- [ ] Authentication expiry
- [ ] Concurrent uploads
- [ ] Special characters in filename
- [ ] Browser refresh during upload
- [ ] Half-day vs full-day calculation
- [ ] Multi-day date range

### Security
- [ ] User A can't access User B's files
- [ ] Files are stored in user-specific folders
- [ ] RLS policies enforced

---

## 📊 Expected Database State After Tests

After running all tests, your database should have:

### `leave_requests` table:
- Multiple test leave requests
- Various statuses: mostly "pending"
- Different leave types
- Different date ranges
- Some with attachments, some without

### `leave_attachments` table:
- Multiple file records
- Each linked to a `leave_request_id`
- File paths pointing to Storage
- Correct file metadata (name, size, mime type)

### Storage (`leave-attachments` bucket):
- Folders for each test user (by UUID)
- Multiple files in each folder
- Files with timestamp prefixes
- Possibly some orphaned files (from interrupted uploads)

---

## 🐛 Common Issues and Solutions

### Issue: Upload fails immediately

**Possible causes:**
- Storage bucket not created
- Storage policies not applied
- Not logged in

**Solution:**
- Follow `FILE_UPLOAD_SETUP_GUIDE.md`
- Check browser console for errors
- Verify authentication

### Issue: Files upload but form submission fails

**Possible causes:**
- Database connection issue
- Missing required fields
- Insufficient balance
- Invalid date range

**Solution:**
- Check browser console for error details
- Check server logs (terminal running `npm run dev`)
- Verify all form fields are filled

### Issue: Balance not showing

**Possible causes:**
- No leave balance records in database
- Database query failing
- User not authenticated

**Solution:**
- Check `leave_balances` table in Supabase
- Check browser console for errors
- Ensure user has balance records for current year

---

## 🎉 Testing Complete!

Once you've completed all test scenarios and verified the results, you can mark the implementation as production-ready!

### Final Verification:

✅ All file types validated correctly
✅ File size limits enforced
✅ Multiple files upload successfully
✅ Files can be removed
✅ Leave balances display correctly
✅ Form submission works with/without files
✅ Form validation prevents invalid submissions
✅ Security policies prevent unauthorized access
✅ Error messages are user-friendly
✅ UI provides clear feedback during operations

**Congratulations! The file upload feature is ready for production.** 🚀


