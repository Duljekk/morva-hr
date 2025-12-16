# Web Push Notifications Setup Guide

This guide explains how to set up and configure web push notifications for MorvaHR.

## Prerequisites

1. **Install web-push package**
   ```bash
   npm install web-push
   ```

2. **Generate VAPID Keys**
   ```bash
   npx web-push generate-vapid-keys
   ```
   
   This will output:
   - Public Key: Use this as `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - Private Key: Use this as `VAPID_PRIVATE_KEY` (keep secret!)
   - Subject: Use your email or a mailto: URL as `VAPID_SUBJECT`

3. **Add Environment Variables**
   
   Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
   VAPID_PRIVATE_KEY=your_private_key_here
   VAPID_SUBJECT=mailto:notifications@yourdomain.com
   ```

## Database Setup

Run the following migrations:

1. `database/migrations/20250114_100300_create_push_subscriptions_table.sql`
2. `database/migrations/20250114_100400_push_subscriptions_rls.sql`

These create the `push_subscriptions` table and set up Row Level Security policies.

## Service Worker

The service worker is located at `public/sw.js` and is automatically registered when users subscribe to push notifications.

## Usage

### For Users

Users can enable push notifications by:
1. Opening the notifications page or settings
2. Clicking "Enable push notifications"
3. Granting browser permission when prompted

### For Developers

Push notifications are automatically sent when:
- A notification is created via `createNotification()` in `lib/actions/notifications.ts`
- The user has an active push subscription
- VAPID keys are configured

### Manual Testing

You can test push notifications using the `PushNotificationManager` component:

```tsx
import PushNotificationManager from '@/app/components/PushNotificationManager';

export default function SettingsPage() {
  return (
    <div>
      <h2>Push Notifications</h2>
      <PushNotificationManager />
    </div>
  );
}
```

## How It Works

1. **Subscription**: User subscribes via browser Push API
2. **Storage**: Subscription is saved to `push_subscriptions` table
3. **Notification Creation**: When a notification is created, the system:
   - Checks if user has push subscriptions
   - Sends push notification to all user's subscriptions
   - Handles errors gracefully (doesn't break main operation)
4. **Delivery**: Browser receives push notification even when app is closed
5. **Click Handling**: Service worker handles notification clicks and opens the app

## Browser Support

Web Push Notifications are supported in:
- Chrome/Edge (Windows, macOS, Android)
- Firefox (Windows, macOS, Android)
- Safari (macOS 16.4+, iOS 16.4+)
- Opera

## Troubleshooting

### Push notifications not working

1. **Check VAPID keys**: Ensure they're correctly set in environment variables
2. **Check service worker**: Verify `public/sw.js` is accessible
3. **Check permissions**: User must grant notification permission
4. **Check subscriptions**: Verify subscription exists in database
5. **Check logs**: Look for errors in browser console and server logs

### Service worker not registering

- Ensure `public/sw.js` exists and is accessible
- Check browser console for service worker errors
- Verify HTTPS (required for push notifications, except localhost)

### Notifications not appearing

- Check browser notification settings
- Verify VAPID keys are correct
- Check that `web-push` package is installed
- Verify subscription is saved in database

## Security Notes

- **VAPID Private Key**: Never commit to version control, keep in environment variables
- **VAPID Public Key**: Safe to expose in client-side code
- **RLS Policies**: Ensure push subscriptions are protected by RLS
- **HTTPS Required**: Push notifications require HTTPS (except localhost for development)

## Next Steps

- Add notification preferences (users can choose which types to receive)
- Add notification scheduling
- Add notification templates
- Add analytics for notification delivery












