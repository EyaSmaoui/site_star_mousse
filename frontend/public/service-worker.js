/* eslint-disable no-restricted-globals */
// Cache name will include the build version to force cache-busting when a new build is deployed.
const CACHE_NAME_BASE = 'star-mousse-';
let CACHE_NAME = CACHE_NAME_BASE + 'unknown';
const RUNTIME_CACHE = 'star-mousse-runtime-v4';
const MAX_CACHE_ENTRIES = 120;
const MAX_CACHE_BYTES = 50 * 1024 * 1024;

// Helper to load version from public/version.json (written at build time by scripts/write-version.js)
async function loadBuildVersion() {
  try {
    const resp = await fetch('/version.json', { cache: 'no-store' });
    if (!resp.ok) return null;
    const json = await resp.json();
    const version = json.version || 'unknown';
    const buildTime = json.buildTime || '';
    return `${version}-${buildTime}`.replace(/[^a-z0-9_-]/gi, '-');
  } catch (e) {
    return null;
  }
}

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

const STATIC_ASSET = /\.(?:js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // Try to read build version and set CACHE_NAME accordingly before precaching
    const version = await loadBuildVersion();
    if (version) CACHE_NAME = `${CACHE_NAME_BASE}${version}`;

    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(PRECACHE_ASSETS.map((asset) => cache.add(asset)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // On activate, recompute current cache name (in case install couldn't fetch version earlier)
    const version = await loadBuildVersion();
    if (version) CACHE_NAME = `${CACHE_NAME_BASE}${version}`;

    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => ![CACHE_NAME, RUNTIME_CACHE].includes(name))
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/index.html'));
    return;
  }

  if (STATIC_ASSET.test(url.pathname) || url.pathname.startsWith('/assets/')) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'SYNC_NOW') {
    event.waitUntil(
      self.registration.sync
        ? self.registration.sync.register('sync-orders')
        : syncOrders()
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nouvelle notification Star Mousse',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: data.url || '/',
    tag: data.tag || 'star-mousse-notification',
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'close', title: 'Fermer' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Star Mousse', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data || '/'));
  }
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then(async (response) => {
      if (isCacheableResponse(response)) {
        const clone = response.clone();
        await cache.put(request, clone);
        await trimCache(RUNTIME_CACHE);
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}

async function networkFirst(request, fallbackUrl = null) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (isCacheableResponse(response)) {
      await cache.put(request, response.clone());
      await trimCache(RUNTIME_CACHE);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }

    return new Response(JSON.stringify({ error: 'Network error, please try again' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function isCacheableResponse(response) {
  return response && response.status === 200 && response.type === 'basic';
}

async function trimCache(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    if (requests.length > MAX_CACHE_ENTRIES) {
      await Promise.all(requests.slice(0, requests.length - MAX_CACHE_ENTRIES).map((request) => cache.delete(request)));
    }

    const estimate = await caches.estimate();
    if (estimate.usage <= MAX_CACHE_BYTES) return;

    for (const request of requests) {
      if (estimate.usage <= MAX_CACHE_BYTES) break;
      const deleted = await cache.delete(request);
      if (deleted) estimate.usage -= 256 * 1024;
    }
  } catch (error) {
    console.warn('[SW] Cache trim failed:', error);
  }
}

async function syncOrders() {
  try {
    const db = await openDB();
    const orders = await db.getAll('pending-orders');

    for (const order of orders) {
      try {
        const token = await getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = 'Bearer ' + token;

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(order.data),
        });

        if (response.ok) {
          await db.delete('pending-orders', order.id);
          console.log('[SW] Order synced:', order.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync order:', error);
      }
    }

    await db.close();
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('star-mousse-db', 2);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      let store;

      if (db.objectStoreNames.contains('pending-orders')) {
        store = event.target.transaction.objectStore('pending-orders');
      } else {
        store = db.createObjectStore('pending-orders', { keyPath: 'id', autoIncrement: true });
      }

      if (!store.indexNames.contains('createdAt')) {
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!store.indexNames.contains('status')) {
        store.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth', { keyPath: 'key' });
      }
    };
  });
}

function getToken() {
  return new Promise((resolve) => {
    openDB()
      .then((db) => {
        const request = db.transaction('auth').objectStore('auth').get('token');
        request.onsuccess = () => {
          db.close();
          resolve(request.result?.value || null);
        };
        request.onerror = () => {
          db.close();
          resolve(null);
        };
      })
      .catch(() => resolve(null));
  });
}
