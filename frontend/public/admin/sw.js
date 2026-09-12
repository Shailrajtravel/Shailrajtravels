const ADMIN_CACHE_NAME = 'shailraj-admin-v5';
const ADMIN_PRECACHE = [
  '/admin',
  '/login',
  '/admin/manifest.webmanifest?v=5',
  '/admin/icons/admin-logo-192x192.png?v=5',
  '/admin/icons/admin-logo-512x512.png?v=5'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ADMIN_CACHE_NAME).then((cache) => {
      return cache.addAll(ADMIN_PRECACHE).catch((err) => {
        console.warn('Admin precache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('shailraj-admin-') && key !== ADMIN_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests within /admin or /login or admin icons
  if (event.request.method !== 'GET') {
    return;
  }

  // Network-first for admin page navigation so live dashboard data is always fresh
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        return caches.match('/admin') || caches.match('/login');
      })
    );
    return;
  }

  // Stale-while-revalidate for admin icons & assets
  if (
    url.pathname.startsWith('/admin/icons/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.open(ADMIN_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
