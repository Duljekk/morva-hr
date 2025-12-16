# Quick Start: Add Employee Feature

## ✅ Feature is Ready!

The Add Employee feature is fully implemented. Follow these steps to start using it.

---

## 📝 Step 1: Configure Email Template (5 minutes)

### Via Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard
2. Select project: **HR Morva**
3. Navigate to: **Authentication → Email Templates → Invite user**
4. Set Subject:
   ```
   You have been invited to MorvaHR
   ```
5. Set Body (copy this HTML):
   ```html
   <h2>You've been invited!</h2>
   
   <p>You've been invited to join our HR system. Click the link below to complete your signup:</p>
   
   <p><a href="{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite">Complete Signup</a></p>
   
   <p>Or copy and paste this URL into your browser:</p>
   <p>{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite</p>
   
   <p>This link will expire in 24 hours.</p>
   ```
6. Click **Save**

**Done!** Email template is configured.

---

## 🧪 Step 2: Test the Feature (10 minutes)

### Test with Yourself

1. **Open HR Dashboard**
   - Log in as HR admin
   - Go to: http://localhost:3000/admin/employees

2. **Send Invitation**
   - Click "Add Employee" button
   - Fill in the form:
     - Email: your-personal-email@example.com
     - Full Name: Test User
     - Username: testuser
     - Role: Employee
   - Click "Send Invitation"
   - Wait for success message

3. **Check Your Email**
   - Open your email inbox
   - Look for: "You have been invited to MorvaHR"
   - Check spam folder if not found

4. **Complete Signup**
   - Click "Complete Signup" in the email
   - Browser opens: http://localhost:3000/signup?token_hash=...
   - Email should be pre-filled
   - Enter:
     - Username (e.g., testuser)
     - Full Name (e.g., Test User)
     - Password (min 8 chars, with uppercase, lowercase, number, symbol)
     - Confirm Password (watch for ✓ check mark when they match)
   - Click "Create Account"
   - Wait for success message

5. **Login**
   - You'll be redirected to: http://localhost:3000/login
   - Enter:
     - Email: your-personal-email@example.com
     - Password: (the password you just created)
   - Click "Sign In"
   - You should be redirected to the employee dashboard at: http://localhost:3000/

**Success!** Feature is working correctly.

---

## 🎉 Step 3: Start Using It!

### How to Invite Employees

1. Log in as HR admin
2. Go to: `/admin/employees`
3. Click "Add Employee"
4. Fill in employee details
5. Click "Send Invitation"
6. Employee receives email and completes signup

### What Employees Will Do

1. Receive invitation email
2. Click "Complete Signup" link
3. Set their password
4. Login with email + password
5. Access their dashboard

---

## ⚙️ Optional: Verify Configuration

### Check Site URL

1. Go to: **Authentication → URL Configuration** in Supabase Dashboard
2. Verify Site URL is set:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### Check Redirect URLs

1. Go to: **Authentication → URL Configuration → Redirect URLs**
2. Add if missing:
   ```
   http://localhost:3000/signup
   http://localhost:3000/*
   ```

---

## 📚 More Information

- **Full Documentation**: `docs/ADD_EMPLOYEE_FEATURE.md`
- **Email Configuration**: `docs/CONFIGURE_INVITATION_EMAIL.md`
- **Implementation Summary**: `docs/ADD_EMPLOYEE_IMPLEMENTATION_SUMMARY.md`

---

## 🐛 Troubleshooting

### Email Not Received?

- Check spam folder
- Verify email address is correct
- Check Supabase email logs in Dashboard
- Wait a few minutes (emails can be delayed)

### "Invalid Token" Error?

- Token expires after 24 hours
- Token can only be used once
- Try resending invitation

### Can't Login After Signup?

- Verify you're using the correct email
- Verify password meets requirements
- Check if account was created in Supabase Dashboard → Authentication → Users

### Form Validation Errors?

- Username: 3-50 chars, alphanumeric + underscores only
- Full Name: 2-100 chars
- Password: Min 8 chars with uppercase, lowercase, number, symbol
- Passwords must match

---

## 🎯 Summary

✅ Configure email template in Supabase Dashboard (5 min)  
✅ Test with yourself (10 min)  
✅ Start inviting employees!

**That's it!** You're ready to start inviting employees.

---

## 💡 Tips

1. **Test first**: Always invite yourself first to verify everything works
2. **Check email**: Make sure employees check their spam folder
3. **Password help**: Let employees know password requirements upfront
4. **Support**: Keep track of who you invited and follow up if they have issues

---

## 🚀 Ready to Go!

The feature is fully implemented and tested. Happy inviting! 🎉

