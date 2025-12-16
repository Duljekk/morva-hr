# Add Employee Feature Documentation

## Overview

The Add Employee feature allows HR admins to invite new employees to the system by sending them an invitation email. The invited user receives an email with a link to complete their signup.

## Feature Flow

### 1. HR Admin Invites Employee

**Location**: `/admin/employees` page

**Steps**:
1. HR admin clicks the "Add Employee" button in the Employees page header
2. A modal opens with an invitation form
3. HR admin fills in:
   - Email address
   - Full name
   - Username
   - Employee ID (optional)
   - Role (Employee or HR Admin)
4. HR admin clicks "Send Invitation"

**Backend**: 
- Server action: `lib/actions/hr/users.ts` → `inviteUserByEmail()`
- Uses Supabase Admin API: `supabase.auth.admin.inviteUserByEmail()`
- Creates user profile in `public.users` table
- Sends invitation email automatically

### 2. Email Invitation

**Email Template Configuration**:

The invitation email should be configured in the Supabase Dashboard under:
**Authentication → Email Templates → Invite user**

**Recommended Email Template**:

```html
<h2>You've been invited!</h2>

<p>You've been invited to join our HR system. Click the link below to complete your signup:</p>

<p><a href="{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite">Complete Signup</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite</p>

<p>This link will expire in 24 hours.</p>
```

**Email Subject**:
```
You have been invited to MorvaHR
```

**Template Variables**:
- `{{ .SiteURL }}` - Your application's site URL (e.g., `https://your-domain.com`)
- `{{ .TokenHash }}` - Secure token for invitation verification
- `{{ .Token }}` - 6-digit OTP (alternative to link)
- `{{ .Email }}` - Invited user's email address

### 3. User Clicks Invitation Link

**URL Format**:
```
https://your-domain.com/signup?token_hash=<hash>&type=invite
```

**Routing**:
- Middleware checks for `token_hash` in signup URL
- If present, allows access to signup page
- If missing, redirects to login (signup is invite-only)

**Security**:
- Token expires after 24 hours
- Token can only be used once
- Token is verified by Supabase Auth

### 4. User Completes Signup

**Location**: `/signup` page

**Steps**:
1. User lands on signup page with pre-filled email (from invitation)
2. User enters:
   - Password (min 6 characters)
   - Password confirmation
3. User clicks "Sign Up"

**Backend**:
- Server action: `lib/actions/auth/signup.ts` → `signup()`
- Verifies invitation token using `supabase.auth.verifyOtp()`
- Updates user with password
- User profile already exists (created during invitation)
- Database trigger (`handle_new_user`) ensures profile is complete

### 5. Automatic Login & Redirect

After successful signup:
1. User is automatically logged in
2. User is redirected to their dashboard:
   - Employee role → `/` (employee dashboard)
   - HR Admin role → `/admin` (HR dashboard)

## Technical Implementation

### Server Action: inviteUserByEmail

**File**: `lib/actions/hr/users.ts`

**Function**:
```typescript
export async function inviteUserByEmail(
  userData: InviteUserData
): Promise<{ success: boolean; error?: string; userId?: string }>
```

**Process**:
1. Verify caller is HR admin (`requireHRAdmin()`)
2. Validate email format
3. Check for duplicate users
4. Call Supabase Admin API to invite user
5. Create user profile in `public.users` table
6. Return success/error status

**Data Stored**:
- `auth.users` table: email, invitation status
- `public.users` table: full profile with role, employee_id, etc.

### Signup Flow

**File**: `lib/actions/auth/signup.ts`

**Function**:
```typescript
export async function signup(
  prevState: SignupFormState | undefined,
  formData: FormData
): Promise<SignupFormState>
```

**Process**:
1. Extract form data (email, password, token_hash, type)
2. Validate password strength
3. Verify invitation token using `supabase.auth.verifyOtp()`
4. Update user with password
5. Sign out (to clear invitation session)
6. Return success state

**Client-side Redirect**:
- After successful signup, client redirects to `/login`
- User can now log in with email + password

### Database Trigger

**File**: `database/migrations/20241212_fix_user_profile_trigger.sql`

**Function**: `handle_new_user()`

**Purpose**:
- Automatically creates/updates user profile when user is created in `auth.users`
- Extracts metadata from `raw_user_meta_data`
- Sets default values for missing fields

## UI Components

### InviteUserModal

**File**: `components/hr/users/InviteUserModal.tsx`

**Purpose**: Modal container for the invitation form

**Props**:
- `isOpen`: boolean - controls modal visibility
- `onClose`: () => void - callback when modal closes

### InviteUserForm

**File**: `components/hr/users/InviteUserForm.tsx`

**Purpose**: Form for inviting new employees

**Props**:
- `onSuccess`: () => void - callback on successful invitation
- `onCancel`: () => void - callback when user cancels

**Fields**:
- Email (required)
- Full Name (required)
- Username (required)
- Employee ID (optional)
- Role (required, default: employee)

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=<your-site-url>
```

### Supabase Dashboard Configuration

1. **Email Templates** (`Authentication → Email Templates → Invite user`):
   - Configure the HTML template
   - Set the subject line
   - Test with team members first

2. **Site URL** (`Authentication → URL Configuration`):
   - Set to your production domain
   - This is used in email links

3. **Redirect URLs** (`Authentication → URL Configuration → Redirect URLs`):
   - Add: `https://your-domain.com/signup`
   - Add: `https://your-domain.com/*` (for wildcard matching)

### RLS Policies

**Table**: `public.users`

**Policies**:
- `users_insert_hr_admin`: HR admins can create user profiles
- `users_select_own`: Users can view their own profile
- `users_select_hr_admin`: HR admins can view all profiles

## Testing

### Test Checklist

- [ ] HR admin can access `/admin/employees` page
- [ ] "Add Employee" button opens invitation modal
- [ ] Form validation works (required fields)
- [ ] Invitation email is sent successfully
- [ ] Email contains correct invite link with token
- [ ] Clicking invite link opens signup page
- [ ] Signup page pre-fills email address
- [ ] Password validation works
- [ ] Password confirmation matches
- [ ] Successful signup creates user profile
- [ ] User can log in with new credentials
- [ ] User is redirected to correct dashboard based on role
- [ ] Duplicate email prevention works
- [ ] Token expiration works (24 hours)
- [ ] Token can only be used once

### Manual Testing Steps

1. **As HR Admin**:
   ```
   1. Log in as HR admin
   2. Navigate to /admin/employees
   3. Click "Add Employee"
   4. Fill in the form:
      - Email: test@example.com
      - Full Name: Test User
      - Username: testuser
      - Role: Employee
   5. Click "Send Invitation"
   6. Verify success message
   ```

2. **As Invited User**:
   ```
   1. Check email inbox for invitation
   2. Click "Complete Signup" link
   3. Verify redirect to /signup with token_hash
   4. Enter password (min 6 chars)
   5. Confirm password
   6. Click "Sign Up"
   7. Verify success message
   8. Verify redirect to login page
   9. Log in with email + password
   10. Verify redirect to correct dashboard
   ```

3. **Edge Cases**:
   ```
   - Try to invite same email twice
   - Try to signup without invitation token
   - Try to use expired token (after 24 hours)
   - Try to use token twice
   - Try weak password
   - Try mismatched password confirmation
   ```

## Troubleshooting

### Common Issues

**1. "User already exists" error**:
- Check if user exists in `auth.users` or `public.users`
- Use Supabase dashboard to view users
- Delete test users if needed

**2. Email not received**:
- Check Supabase email settings
- Verify SMTP configuration (if custom)
- Check spam folder
- Verify email address is correct

**3. "Invalid token" error on signup**:
- Token may have expired (24 hour limit)
- Token may have been used already
- Check token_hash in URL is complete

**4. Profile not created**:
- Check database trigger `handle_new_user()` is enabled
- Check RLS policies allow profile creation
- Check logs for trigger errors

**5. Redirect issues**:
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Check middleware permissions configuration
- Verify redirect URLs in Supabase dashboard

## Security Considerations

1. **Authorization**:
   - Only HR admins can invite users
   - Enforced by `requireHRAdmin()` in server action
   - RLS policies prevent unauthorized access

2. **Token Security**:
   - Tokens are hashed and stored securely
   - Tokens expire after 24 hours
   - Tokens are single-use only

3. **Password Requirements**:
   - Minimum 6 characters
   - Validated on both client and server
   - Hashed by Supabase Auth

4. **Email Verification**:
   - Invitation ensures email ownership
   - No additional verification needed
   - Prevents spam signups

5. **Rate Limiting**:
   - Supabase Auth has built-in rate limiting
   - Prevents invitation spam
   - Configurable in Supabase dashboard

## Future Enhancements

- [ ] Add bulk invitation (CSV upload)
- [ ] Add invitation expiry customization
- [ ] Add invitation tracking (sent, opened, completed)
- [ ] Add resend invitation option
- [ ] Add custom email templates per role
- [ ] Add invitation cancellation
- [ ] Add more profile fields during invitation
- [ ] Add email preview before sending
- [ ] Add invitation history/audit log

