'use client';

/**
 * Push Notification Manager Component
 * Handles subscription to web push notifications
 */

import { useEffect, useState, useCallback } from 'react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  getPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/utils/pushNotifications';
import { savePushSubscription, removePushSubscription } from '@/lib/actions/pushNotifications';

interface PushNotificationManagerProps {
  className?: string;
}

export default function PushNotificationManager({
  className = '',
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check support and current state
  useEffect(() => {
    async function checkState() {
      if (!isPushNotificationSupported()) {
        setIsSupported(false);
        setIsLoading(false);
        return;
      }

      setIsSupported(true);

      // Check permission
      const currentPermission = await getNotificationPermission();
      setPermission(currentPermission);

      // Check if already subscribed
      const subscription = await getPushSubscription();
      setIsSubscribed(!!subscription);

      setIsLoading(false);
    }

    checkState();
  }, []);

  // Subscribe to push notifications
  const handleSubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check permission
      let currentPermission = await getNotificationPermission();
      if (currentPermission === 'default') {
        currentPermission = await requestNotificationPermission();
        setPermission(currentPermission);
      }

      if (currentPermission !== 'granted') {
        setError('Notification permission was denied. Please enable it in your browser settings.');
        setIsLoading(false);
        return;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        setError('Failed to register service worker');
        setIsLoading(false);
        return;
      }

      // Get VAPID public key
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        setError('Push notifications are not configured. Please contact support.');
        setIsLoading(false);
        return;
      }

      // Subscribe to push
      const subscription = await subscribeToPush(vapidPublicKey);
      if (!subscription) {
        setError('Failed to subscribe to push notifications');
        setIsLoading(false);
        return;
      }

      // Save subscription to database
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(
            String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))
          ),
          auth: btoa(
            String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))
          ),
        },
      };

      const result = await savePushSubscription(subscriptionData);
      if (!result.success) {
        setError(result.error || 'Failed to save subscription');
        // Unsubscribe if save failed
        await subscription.unsubscribe();
        setIsLoading(false);
        return;
      }

      setIsSubscribed(true);
      setError(null);
    } catch (err: any) {
      console.error('[PushNotificationManager] Error subscribing:', err);
      setError(err.message || 'Failed to subscribe to push notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Unsubscribe from push notifications
  const handleUnsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const subscription = await getPushSubscription();
      if (!subscription) {
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      // Remove from database
      const result = await removePushSubscription(subscription.endpoint);
      if (!result.success) {
        console.warn('[PushNotificationManager] Failed to remove subscription from database:', result.error);
      }

      // Unsubscribe
      await unsubscribeFromPush();
      setIsSubscribed(false);
      setError(null);
    } catch (err: any) {
      console.error('[PushNotificationManager] Error unsubscribing:', err);
      setError(err.message || 'Failed to unsubscribe from push notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (!isSupported) {
    return (
      <div className={`text-sm text-neutral-500 ${className}`}>
        Push notifications are not supported in this browser.
      </div>
    );
  }

  if (isLoading && !isSubscribed) {
    return (
      <div className={`text-sm text-neutral-500 ${className}`}>
        Checking push notification status...
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {permission === 'denied' && (
        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
          Notification permission was denied. Please enable it in your browser settings to receive push notifications.
        </div>
      )}

      {isSubscribed ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600">Push notifications enabled</span>
          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="text-sm text-neutral-600 hover:text-neutral-800 underline disabled:opacity-50"
          >
            {isLoading ? 'Unsubscribing...' : 'Disable'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={isLoading || permission === 'denied'}
          className="text-sm text-teal-600 hover:text-teal-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Subscribing...' : 'Enable push notifications'}
        </button>
      )}
    </div>
  );
}




