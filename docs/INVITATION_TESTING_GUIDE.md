# User Invitation System - Testing Guide

## Quick Start

### 1. Prerequisites

✅ Database migration run in Supabase SQL Editor  
✅ Environment variables configured in `.env.local`  
✅ Dev server running (`npm run dev`)

### 2. Test Flow

#### Step 1: Login as Admin
1. Go to `http://localhost:3000/login`
2. Login with your admin credentials

#### Step 2: Access Employees Page
1. Navigate to **Admin → Employees** (or `/admin/employees`)
2. You should see the employees list

#### Step 3: Click "Add Employee" Button
1. Click the **"Add Employee"** button in the top right
2. The invite modal should open

#### Step 4: Fill Invitation Form
Fill in these details:
- **Email**: `test@example.com` (use your real email for testing)
- **Full Name**: `Test User`
- **Username**: `testuser`
- **Employee ID**: `EMP-TEST-001` (optional)
- **Role**: Select `Employee` or `HR Admin`
- **Shift Start**: `9` (9 AM)
- **Shift End**: `18` (6 PM / 18:00)

#### Step 5: Send Invitation
1. Click **"Send Invitation"** button
2. Wait for success message (modal shows checkmark)
3. Modal should auto-close after 2 seconds

#### Step 6: Check Email
1. Open the email inbox for the test email
2. Look for email with subject: **"Confirm your signup"**
3. Email should contain:
   - Your name (from full_name field)
   - A button/link to complete signup
   - Your account details (email, username, employee ID, role)

#### Step 7: Click Invitation Link
1. Click the link in the email
2. You should be redirected to: `http://localhost:3000/signup?token_hash=...&type=invite`

#### Step 8: Complete Signup
1. Verify pre-filled fields:
   - ✅ **Email**: Pre-filled and disabled
   - ✅ **Username**: Pre-filled but editable
   - ✅ **Full Name**: Pre-filled but editable
2. Create a password (must meet requirements):
   - At least 8 characters
   - 1 uppercase letter
   - 1 lowercase letter
   - 1 number
   - 1 symbol
   - Example: `Test1234!`
3. Confirm password (type same password)
4. Watch password requirements turn green as you type
5. Click **"Create Account"**

#### Step 9: Verify Redirect to Login
1. Should redirect to `/login` with success message
2. Message: "Account created successfully. Please login."

#### Step 10: Login with New Account
1. Enter the test email and password you just created
2. Click **"Sign In"**
3. Should successfully login and redirect to employee dashboard

## Verification Checklist

### Database Verification
- [ ] Check Supabase → **Authentication** → **Users**
  - User should be listed with confirmed email
- [ ] Check Supabase → **Table Editor** → `users` table
  - User profile should exist with:
    - Correct email, username, full_name
    - Employee ID (if provided)
    - Role (employee or hr_admin)
    - Shift times (09:00:00 - 18:00:00)
    - `is_active` = true

### UI Verification
- [ ] Invite modal opens when clicking "Add Employee"
- [ ] Form validation works (required fields)
- [ ] Success message shows after sending invitation
- [ ] Modal closes automatically after success
- [ ] Signup page loads with pre-filled data
- [ ] Password requirements update in real-time
- [ ] Form submission works
- [ ] Redirects to login after successful signup

### Error Handling
- [ ] Duplicate email shows error message
- [ ] Invalid email format shows error
- [ ] Weak password shows validation errors
- [ ] Expired/invalid token redirects to login
- [ ] Username already taken shows error

## Common Issues and Solutions

### Issue: "SUPABASE_SERVICE_ROLE_KEY is not set"
**Solution**: 
1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key
3. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=your-key`
4. Restart dev server

### Issue: Email not received
**Solutions**:
1. Check spam folder
2. Use Gmail with `+test` trick: `youremail+test1@gmail.com`
3. Check Supabase Dashboard → Authentication → Logs
4. Verify email service is configured

### Issue: "Invalid or expired invitation token"
**Solutions**:
1. Tokens expire after 24 hours
2. Resend invitation via HR dashboard (not implemented yet)
3. Or send new invitation

### Issue: Can't access signup page directly
**Expected**: Middleware blocks access without invitation token
**Solution**: This is correct behavior - must use invitation link from email

### Issue: Password requirements not turning green
**Solution**: 
- Make sure password includes all requirements
- Try: `Test1234!` (uppercase T, lowercase rest, numbers, exclamation)

## Test with Multiple Users

Test with 3 different emails to verify:
1. **Employee role**: Can only access employee dashboard
2. **HR Admin role**: Can access HR dashboard and invite others
3. **Duplicate email**: Shows error message correctly

## Production Checklist

Before deploying to production:

- [ ] Environment variables set in production hosting (Vercel, etc.)
- [ ] Supabase redirect URLs updated with production domain
- [ ] Email template customized with company branding
- [ ] Password security settings configured in Supabase
- [ ] Test complete flow in production environment
- [ ] Monitor error logs for 24-48 hours after launch
- [ ] Document invitation process for HR team

## Support

If you encounter issues:
1. Check browser console for errors (F12 → Console)
2. Check server logs in terminal
3. Check Supabase logs: Dashboard → Logs
4. Verify all environment variables are set
5. Ensure database migration ran successfully

## Success Criteria

✅ HR admin can send invitations  
✅ Users receive email with invitation link  
✅ Signup page loads with pre-filled data  
✅ Users can complete signup with password  
✅ Users can login with new credentials  
✅ User profile created in database with correct data  
✅ Error handling works for edge cases  

## Next Steps

After successful testing:
1. Customize email template in Supabase Dashboard
2. Configure password security settings
3. Add "Resend Invitation" functionality (optional)
4. Deploy to production
5. Train HR team on invitation process
