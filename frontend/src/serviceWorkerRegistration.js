export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;

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

    if ('SyncManager' in window && registration.sync) {
      await registration.sync.register('sync-orders');
    }

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
    await registration.sync.register('sync-orders');
    return true;
  }

  registration.active?.postMessage({ type: 'SYNC_NOW' });
  return true;
};
