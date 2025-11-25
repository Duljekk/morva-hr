/**
 * Utility function to send push notifications
 * This requires the web-push package to be installed
 * 
 * Install with: npm install web-push
 * Generate VAPID keys with: npx web-push generate-vapid-keys
 */

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  notificationId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  tag?: string;
}

/**
 * Send push notification to a subscription
 * Requires web-push package and VAPID keys
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushNotificationPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Dynamic import to avoid errors if web-push is not installed
    const webpush = await import('web-push');
    
    // Set VAPID details
    webpush.default.setVapidDetails(
      vapidSubject,
      vapidPublicKey,
      vapidPrivateKey
    );

    // Prepare notification payload
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/badge.png',
      url: payload.url || '/notifications',
      notificationId: payload.notificationId,
      relatedEntityType: payload.relatedEntityType,
      relatedEntityId: payload.relatedEntityId,
      tag: payload.tag || 'notification',
    });

    // Send notification
    await webpush.default.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      notificationPayload
    );

    return { success: true };
  } catch (error: any) {
    console.error('[sendPushNotification] Error sending push notification:', error);
    
    // Handle specific error cases
    if (error.statusCode === 410) {
      // Subscription expired or no longer valid
      return { success: false, error: 'Subscription expired' };
    }
    
    return { success: false, error: error.message || 'Failed to send push notification' };
  }
}

/**
 * Send push notification to multiple subscriptions
 */
export async function sendPushNotificationsToSubscriptions(
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<{ success: number; failed: number; errors: string[] }> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  // Send to all subscriptions in parallel
  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendPushNotification(subscription, payload, vapidPublicKey, vapidPrivateKey, vapidSubject)
    )
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.success) {
      success++;
    } else {
      failed++;
      const subscription = subscriptions[index];
      if (result.status === 'rejected') {
        errors.push(`Subscription ${subscription.endpoint}: ${result.reason}`);
      } else if (result.value.error) {
        errors.push(`Subscription ${subscription.endpoint}: ${result.value.error}`);
      }
    }
  });

  return { success, failed, errors };
}












