# 🐛 Debug Logging Guide

## Overview

Comprehensive debug logging has been added to track file uploads, leave balance fetching, and leave request submissions.

---

## 📍 Where to View Logs

### **Browser Console (Client-Side)**
1. Open **Developer Tools** (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Look for logs prefixed with component names:
   - `[LeaveTypeBottomSheet]` - Leave balance loading
   - `[RequestLeave]` - Form submission

### **Terminal (Server-Side)**
1. Look at your terminal running `npm run dev`
2. Server action logs will appear there:
   - `[getAllLeaveBalances]` - Fetching all balances
   - `[getLeaveBalance]` - Fetching single balance
   - `[submitLeaveRequest]` - Submitting leave request
   - `[uploadLeaveAttachment]` - File upload (not yet logged)

---

## 🔍 Debug Logs by Feature

### **1. Leave Balance Fetching**

**When triggered:** Opening the Leave Type selector

**Client logs (Browser Console):**
```
[LeaveTypeBottomSheet] Fetching leave balances...
[LeaveTypeBottomSheet] Balances fetched: { data: [...], error: undefined }
```

**Server logs (Terminal):**
```
[getAllLeaveBalances] Fetching leave types for user: {uuid}
[getAllLeaveBalances] Leave types query result: { leaveTypes: [...], leaveTypesError: null }
[getAllLeaveBalances] Approved leaves: [...]
[getAllLeaveBalances] Calculated balances: [
  {
    leaveTypeId: 'sick',
    leaveTypeName: 'Sick Leave',
    totalQuota: 0,
    used: 0,
    remaining: 999
  },
  ...
]
```

**Error scenarios:**
- Auth error: `[getAllLeaveBalances] Auth error: ...`
- No leave types: `[getAllLeaveBalances] Failed to fetch leave types: ...`
- DB error: `[getAllLeaveBalances] Error fetching approved leaves: ...`

---

### **2. Leave Request Submission**

**When triggered:** Clicking "Send Request" button

**Client logs (Browser Console):**
```
[RequestLeave] Submitting leave request: {
  leaveTypeId: 'sick',
  startDate: '2025-11-10',
  endDate: '2025-11-10',
  dayType: 'full',
  totalDays: 1,
  reason: 'Medical appointment',
  fileUrls: ['user-uuid/timestamp-file.pdf']
}
[RequestLeave] Submit result: { data: {...}, error: undefined }
```

**Server logs (Terminal):**
```
[submitLeaveRequest] Request data: { leaveTypeId: 'sick', ... }
[submitLeaveRequest] User authenticated: {uuid}
[submitLeaveRequest] Checking leave balance for type: sick
[getLeaveBalance] Fetching leave type: sick for user: {uuid}
[getLeaveBalance] Leave type query result: { leaveType: {...}, leaveTypeError: null }
[getLeaveBalance] No quota limit for leave type: Sick Leave
[submitLeaveRequest] Balance check result: { data: {...} }
[submitLeaveRequest] Inserting leave request...
[submitLeaveRequest] Leave request created: {id: '...'}
```

**Error scenarios:**
- Not logged in: `[submitLeaveRequest] Auth error: ...`
- Invalid dates: `[submitLeaveRequest] Invalid dates: ...`
- Leave type not found: `[getLeaveBalance] Leave type not found: ...`
- Insufficient balance: Logged in balance check result

---

### **3. Individual Leave Balance Check**

**When triggered:** During form submission (internally)

**Server logs (Terminal):**
```
[getLeaveBalance] Fetching leave type: annual for user: {uuid}
[getLeaveBalance] Leave type query result: {
  leaveType: {
    id: 'annual',
    name: 'Annual Leave',
    max_days_per_year: 20
  },
  leaveTypeError: null
}
[getLeaveBalance] Calculated balance: {
  leaveType: 'Annual Leave',
  totalQuota: 20,
  usedDays: 5,
  remaining: 15
}
```

**Error scenarios:**
- Leave type not found: `[getLeaveBalance] Leave type not found: annual Error: {...}`
- DB error: `[getLeaveBalance] Error fetching approved leaves: ...`

---

## 🎯 Common Issues and What to Look For

### **Issue: "Leave type not found"**

**What to check:**
1. Browser console → Look for `[LeaveTypeBottomSheet]` or `[RequestLeave]`
2. Terminal → Look for `[getLeaveBalance]` logs
3. Check the leave type ID being sent

**Expected log pattern:**
```
[submitLeaveRequest] Checking leave balance for type: sick
[getLeaveBalance] Fetching leave type: sick for user: ...
[getLeaveBalance] Leave type query result: { leaveType: null, leaveTypeError: {...} }
[getLeaveBalance] Leave type not found: sick Error: {...}
```

**Possible causes:**
- Leave type doesn't exist in database
- RLS policy blocking access
- Database connection issue

---

### **Issue: File upload fails**

**What to check:**
1. Browser console → Network tab → Look for failed requests
2. Terminal → Look for storage errors

**Note:** File upload debug logs not yet implemented. To add:
```typescript
// In lib/actions/leaves.ts uploadLeaveAttachment()
console.log('[uploadLeaveAttachment] Uploading file:', file.name);
console.log('[uploadLeaveAttachment] File path:', filePath);
console.log('[uploadLeaveAttachment] Upload result:', { data, error });
```

---

### **Issue: Balance shows as 0 or incorrect**

**What to check:**
Terminal logs for balance calculation:
```
[getAllLeaveBalances] Approved leaves: [...]
[getAllLeaveBalances] Calculated balances: [...]
```

Compare:
- `totalQuota` - Should match database `max_days_per_year`
- `usedDays` - Sum of approved leaves for this year
- `remaining` - Should be `totalQuota - usedDays`

---

## 🔧 Adding More Debug Logs

### **Pattern to Follow:**

```typescript
// At function entry
console.log('[FunctionName] Description:', relevantData);

// Before important operations
console.log('[FunctionName] About to do X:', context);

// After operations (success)
console.log('[FunctionName] Result:', result);

// On errors
console.error('[FunctionName] Error message:', errorDetails);
```

### **Example - Add to file upload:**

```typescript
export async function uploadLeaveAttachment(formData: FormData): Promise<FileUploadResult> {
  console.log('[uploadLeaveAttachment] Starting file upload');
  
  try {
    const file = formData.get('file') as File;
    console.log('[uploadLeaveAttachment] File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });
    
    // ... validation ...
    
    const filePath = generateFilePath(user.id, file.name);
    console.log('[uploadLeaveAttachment] Generated file path:', filePath);
    
    const { data, error } = await supabase.storage
      .from('leave-attachments')
      .upload(filePath, file);
    
    console.log('[uploadLeaveAttachment] Upload result:', { 
      success: !!data, 
      error: error?.message 
    });
    
    // ... rest of function ...
  } catch (error) {
    console.error('[uploadLeaveAttachment] Unexpected error:', error);
  }
}
```

---

## 📊 Log Levels

### **console.log()** - Informational
- Function entry
- Successful operations
- Data flow tracking

### **console.error()** - Errors
- Auth failures
- Database errors
- Validation failures
- Unexpected errors

### **console.warn()** - Warnings (not currently used)
- Deprecated code
- Non-critical issues
- Performance warnings

---

## 🧹 Removing Debug Logs for Production

### **Option 1: Manual Removal**
Search for `console.log` and `console.error` in:
- `lib/actions/leaves.ts`
- `app/components/LeaveTypeBottomSheet.tsx`
- `app/request-leave/page.tsx`

### **Option 2: Use Environment Variables**

```typescript
// Create lib/utils/logger.ts
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) console.log(...args);
  },
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
  },
};

// Then replace:
console.log('[FunctionName]', data);
// With:
logger.log('[FunctionName]', data);
```

### **Option 3: Build-time Removal**
Add to `next.config.ts`:
```typescript
webpack(config, { dev }) {
  if (!dev) {
    // Remove console logs in production
    config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
  }
  return config;
}
```

---

## 🎯 Quick Reference

### **File Upload Issue?**
```
1. Check browser console for client-side errors
2. Check terminal for "Storage upload error"
3. Verify bucket exists and policies are applied
```

### **Balance Not Showing?**
```
1. Open leave type selector
2. Check browser console for [LeaveTypeBottomSheet]
3. Check terminal for [getAllLeaveBalances]
4. Verify leave_types exist in database
```

### **Submission Failing?**
```
1. Click "Send Request"
2. Check browser console for [RequestLeave]
3. Check terminal for [submitLeaveRequest]
4. Look for specific error in logs
```

---

## ✅ Current Debug Status

- ✅ **getAllLeaveBalances()** - Fully logged
- ✅ **getLeaveBalance()** - Fully logged
- ✅ **submitLeaveRequest()** - Fully logged
- ✅ **LeaveTypeBottomSheet** - Fully logged (client)
- ✅ **RequestLeave page** - Fully logged (client)
- ⚠️ **uploadLeaveAttachment()** - Basic error logging only
- ⚠️ **deleteLeaveAttachment()** - Basic error logging only

---

## 🚀 Next Steps

Now when you encounter the "Leave type not found" error:

1. **Open browser console** (F12)
2. **Look at terminal** running dev server
3. **Try the action again** (open leave type selector or submit)
4. **Copy the logs** and share them

The logs will show exactly where the error occurs and why! 🎉


