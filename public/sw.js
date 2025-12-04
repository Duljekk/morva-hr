// Service Worker for Web Push Notifications and Caching
// Handles push events, notification clicks, and intelligent caching

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `morva-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `morva-dynamic-${CACHE_VERSION}`;
const API_CACHE = `morva-api-${CACHE_VERSION}`;

// Static assets to pre-cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/notifications',
  '/request-leave',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Routes to cache with stale-while-revalidate strategy
const SWR_ROUTES = [
  '/',
  '/notifications',
  '/request-leave',
  '/leaves',
];

// API endpoints to cache (network-first with fallback)
const CACHEABLE_API_PATTERNS = [
  /\/api\/attendance/,
  /\/api\/announcements/,
  /\/api\/notifications/,
];

// =============================================================================
// PUSH NOTIFICATIONS
// =============================================================================

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

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

// Handle service worker installation - pre-cache static assets
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function (cache) {
        console.log('[Service Worker] Pre-caching static assets');
        // Use addAll with error handling for each asset
        return Promise.allSettled(
          STATIC_ASSETS.map(function (asset) {
            return cache.add(asset).catch(function (error) {
              console.warn('[Service Worker] Failed to cache:', asset, error);
            });
          })
        );
      })
      .then(function () {
        console.log('[Service Worker] Static assets cached');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Handle service worker activation - clean up old caches
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating...');
  
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              // Delete caches that aren't in our current list
              return cacheName.startsWith('morva-') && !currentCaches.includes(cacheName);
            })
            .map(function (cacheName) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(function () {
        console.log('[Service Worker] Old caches cleaned');
        return clients.claim(); // Take control of all pages immediately
      })
  );
});

// =============================================================================
// FETCH STRATEGIES
// =============================================================================

// Helper: Check if URL matches any pattern
function matchesPattern(url, patterns) {
  return patterns.some(function (pattern) {
    return pattern.test(url);
  });
}

// Helper: Check if request is for a page navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
    (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// Helper: Check if URL is a SWR route
function isSWRRoute(url) {
  const pathname = new URL(url).pathname;
  return SWR_ROUTES.includes(pathname);
}

// Stale-While-Revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const fetchPromise = fetch(request)
    .then(function (networkResponse) {
      // Only cache successful responses
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(function (error) {
      console.warn('[Service Worker] Network fetch failed:', error);
      return null;
    });
  
  // Return cached response immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Network-first strategy with cache fallback
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful GET responses
    if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[Service Worker] Network failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for navigation requests
    if (isNavigationRequest(request)) {
      const offlinePage = await cache.match('/');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const cache = await caches.open(cacheName);
  const networkResponse = await fetch(request);
  
  if (networkResponse && networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Main fetch event handler
self.addEventListener('fetch', function (event) {
  const request = event.request;
  const url = request.url;
  
  // Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for specific CDNs if needed)
  if (!url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip Supabase requests - these should always go to network
  if (url.includes('supabase')) {
    return;
  }
  
  // Skip _next/webpack-hmr (hot module replacement in dev)
  if (url.includes('_next/webpack-hmr') || url.includes('__nextjs')) {
    return;
  }
  
  // Strategy selection based on request type
  event.respondWith(
    (async function () {
      // API requests: Network-first
      if (matchesPattern(url, CACHEABLE_API_PATTERNS)) {
        return networkFirst(request, API_CACHE);
      }
      
      // Navigation to SWR routes: Stale-while-revalidate
      if (isNavigationRequest(request) && isSWRRoute(url)) {
        return staleWhileRevalidate(request, DYNAMIC_CACHE);
      }
      
      // Static assets (JS, CSS, images): Cache-first
      if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
        return cacheFirst(request, STATIC_CACHE);
      }
      
      // Default: Network-first
      return networkFirst(request, DYNAMIC_CACHE);
    })()
  );
});












