// Service Worker for Web Push Notifications
// Handles push events and notification clicks

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || data.description || '',
        icon: data.icon || '/icon-192x192.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          url: data.url || '/notifications',
          notificationId: data.notificationId || null,
          relatedEntityType: data.relatedEntityType || null,
          relatedEntityId: data.relatedEntityId || null,
        },
        tag: data.tag || 'notification',
        requireInteraction: false,
        silent: false,
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
      );
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('New Notification', {
          body: 'You have a new notification',
          icon: '/icon-192x192.png',
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received:', event);
  
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', function (event) {
  console.log('[Service Worker] Notification closed:', event);
  // Could track notification dismissal here if needed
});

// Handle service worker installation
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Activate immediately
});

// Handle service worker activation
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    clients.claim() // Take control of all pages immediately
  );
});










