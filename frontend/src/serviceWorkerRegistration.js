export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;

  if (import.meta.env.DEV) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.startsWith('star-mousse'))
            .map((name) => caches.delete(name))
        );
      }

      if (navigator.serviceWorker.controller && !sessionStorage.getItem('sm-dev-sw-reset')) {
        sessionStorage.setItem('sm-dev-sw-reset', '1');
        window.location.reload();
      }
    } catch (error) {
      console.warn('[PWA] Dev cache reset failed:', error);
    }

    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      type: 'module',
    });

    const sendSkipWaiting = (worker) => {
      if (!worker) return;
      try {
        worker.postMessage({ type: 'SKIP_WAITING' });
      } catch (err) {
        console.warn('[PWA] Failed to send SKIP_WAITING to service worker:', err);
      }
    };

    if (registration.waiting) {
      sendSkipWaiting(registration.waiting);
    }

    const onInstallingStateChange = (worker) => {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
          sendSkipWaiting(registration.waiting || worker);
        }
      });
    };

    if (registration.installing) {
      onInstallingStateChange(registration.installing);
    }

    registration.addEventListener('updatefound', () => {
      if (registration.installing) {
        onInstallingStateChange(registration.installing);
      }
    });

    registration.update().catch(() => {
      // Ignore update failures; the service worker will refresh on next load.
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });

    return registration;
  } catch (error) {
    console.warn('[PWA] Service worker registration failed:', error);
    return null;
  }
};

export const requestBackgroundSync = async () => {
  if (!('serviceWorker' in navigator)) return false;

  const registration = await navigator.serviceWorker.ready.catch(() => null);
  if (!registration) return false;

  if ('SyncManager' in window && registration.sync) {
    try {
      await registration.sync.register('sync-orders');
      return true;
    } catch (error) {
      console.warn('[PWA] Background sync unavailable:', error);
    }
  }

  if (!registration.active) return false;

  registration.active.postMessage({ type: 'SYNC_NOW' });
  return false;
};
