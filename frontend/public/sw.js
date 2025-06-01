const CACHE_NAME = 'speisplan-app-v1';
const urlsToCache = ['/', '/?source=pwa', '/static/js/bundle.js', '/static/css/main.css', '/manifest.json', '/icons/icon-192x192.png', '/icons/icon-512x512.png'];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for API calls - let them go to network
  if (url.pathname.startsWith('/api/') || url.pathname.includes('api') || request.method !== 'GET') {
    // For API calls, always go to network
    event.respondWith(fetch(request));
    return;
  }

  // For static assets, use cache-first strategy
  event.respondWith(
    caches
      .match(request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(request);
      })
      .catch(() => {
        // If both cache and network fail, you could return a fallback
        return fetch(request);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
