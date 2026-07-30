export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      type: 'module',
    });

    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

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
