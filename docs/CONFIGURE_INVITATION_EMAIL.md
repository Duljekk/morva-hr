# Configure Invitation Email Template

## Quick Setup Guide

Follow these steps to configure the custom invitation email template in your Supabase project.

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in to your account
3. Select your project: **HR Morva**

### Step 2: Navigate to Email Templates

1. In the left sidebar, click on **Authentication**
2. Click on **Email Templates**
3. Select **Invite user** template

### Step 3: Configure Subject Line

In the "Subject" field, enter:
```
You have been invited to MorvaHR
```

### Step 4: Configure Email Body (HTML)

Replace the default template with:

```html
<h2>You've been invited!</h2>

<p>You've been invited to join our HR system. Click the link below to complete your signup:</p>

<p><a href="{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite">Complete Signup</a></p>

<p>Or copy and paste this URL into your browser:</p>
<p>{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite</p>

<p>This link will expire in 24 hours.</p>
```

**Important Variables**:
- `{{ .SiteURL }}` - Automatically replaced with your site URL
- `{{ .TokenHash }}` - Automatically replaced with the invitation token
- `{{ .Token }}` - (Optional) 6-digit OTP code

### Step 5: Verify Site URL Configuration

1. In Authentication settings, click on **URL Configuration**
2. Verify **Site URL** is set correctly:
   - For development: `http://localhost:3000`
   - For production: `https://your-domain.com`

### Step 6: Add Redirect URLs

In the **Redirect URLs** section, add:
```
http://localhost:3000/signup
http://localhost:3000/*
https://your-domain.com/signup
https://your-domain.com/*
```

### Step 7: Save Changes

1. Click **Save** button at the bottom
2. Test by inviting a user from the HR dashboard

## Alternative: Configure via Management API

If you prefer to configure via API:

```bash
# Set your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="kvwmlhalbsiywjjzvoje"

# Update invitation email template
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mailer_subjects_invite": "You have been invited to MorvaHR",
    "mailer_templates_invite_content": "<h2>You'\''ve been invited!</h2><p>You'\''ve been invited to join our HR system. Click the link below to complete your signup:</p><p><a href=\"{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite\">Complete Signup</a></p><p>Or copy and paste this URL into your browser:</p><p>{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite</p><p>This link will expire in 24 hours.</p>"
  }'
```

## Email Template Best Practices

### 1. Keep it Simple
- Use clear, concise language
- Avoid jargon or technical terms
- Focus on the action (complete signup)

### 2. Provide Multiple Options
- Include clickable link
- Include copy-paste URL
- (Optional) Include OTP code

### 3. Set Expectations
- Mention expiration time (24 hours)
- Explain what happens after signup
- Include support contact if needed

### 4. Brand Consistency
- Use your company colors
- Include logo (optional)
- Match your website's tone

### 5. Mobile-Friendly
- Keep layout simple
- Use large, tappable buttons
- Test on mobile devices

## Enhanced Template (Optional)

For a more branded experience, use this template:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to MorvaHR</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
    <h1 style="color: #6C5DD3; margin-bottom: 20px;">Welcome to MorvaHR! 🎉</h1>
    
    <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">You've been invited!</h2>
    
    <p style="margin-bottom: 20px;">You've been invited to join our HR management system. Get started by completing your account setup.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite" 
         style="background-color: #6C5DD3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
        Complete Signup
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 20px;">Or copy and paste this URL into your browser:</p>
    <p style="background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; word-break: break-all; font-size: 12px;">
      {{ .SiteURL }}/signup?token_hash={{ .TokenHash }}&type=invite
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        ⏰ This invitation link will expire in 24 hours.
      </p>
      <p style="font-size: 12px; color: #999; margin: 5px 0;">
        📧 If you didn't expect this invitation, you can safely ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
```

## Testing the Email

After configuration:

1. **Test with Team Members First**:
   ```
   - Invite yourself or a colleague
   - Check email delivery
   - Verify link works correctly
   - Test on different email clients (Gmail, Outlook, etc.)
   - Test on mobile devices
   ```

2. **Check Spam Folder**:
   ```
   - If email not received, check spam
   - Add sender to safe senders list
   - Consider using custom SMTP (Resend, SendGrid, etc.)
   ```

3. **Verify Token Works**:
   ```
   - Click the link in the email
   - Should land on /signup page
   - Email should be pre-filled
   - Complete signup process
   - Verify login works
   ```

## Troubleshooting

### Email Not Received

**Check**:
1. Email address is correct
2. Supabase email settings are configured
3. Not in spam folder
4. Rate limits not exceeded

**Solutions**:
- Use custom SMTP provider (recommended for production)
- Check Supabase dashboard for email logs
- Verify sender email is not blacklisted

### Link Doesn't Work

**Check**:
1. Site URL is configured correctly
2. Token hash is complete in URL
3. Token hasn't expired (24 hours)
4. Token hasn't been used already

**Solutions**:
- Resend invitation
- Check middleware configuration
- Verify redirect URLs in Supabase

### Styling Issues

**Check**:
1. Email client support (some don't support CSS)
2. HTML is valid
3. Inline styles are used (not external CSS)

**Solutions**:
- Use table-based layouts for better compatibility
- Test with [Email on Acid](https://www.emailonacid.com/) or [Litmus](https://www.litmus.com/)
- Keep styling simple

## Next Steps

After configuring the email template:

1. ✅ Test the invitation flow
2. ✅ Invite yourself to verify
3. ✅ Complete signup process
4. ✅ Test login
5. ✅ Configure custom SMTP (optional, for production)
6. ✅ Set up email monitoring/analytics

## Support

If you encounter issues:

1. Check Supabase documentation: [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
2. Review logs in Supabase Dashboard
3. Test with different email providers
4. Consider using Send Email Hook for advanced customization

## Production Checklist

Before going live:

- [ ] Email template tested with multiple email clients
- [ ] Site URL configured for production domain
- [ ] Redirect URLs added for production domain
- [ ] Custom SMTP configured (recommended)
- [ ] Email deliverability tested
- [ ] Spam score checked
- [ ] Mobile responsiveness verified
- [ ] Brand guidelines followed
- [ ] Legal/compliance requirements met
- [ ] Backup email provider configured (optional)

