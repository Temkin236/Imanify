export async function initPWA() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

      setInterval(() => { registration.update(); }, 60000);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
    } catch (error) {
      // Service Worker registration failed
    }
  }

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('🟢 App is back online');
    document.body.classList.remove('offline');
  });

  window.addEventListener('offline', () => {
    console.log('🔴 App is now offline');
    document.body.classList.add('offline');
  });

  // Initial offline state check
  if (!navigator.onLine) {
    document.body.classList.add('offline');
    console.log('🔴 App started in offline mode');
  } else {
    console.log('🟢 App started with online connection');
  }

  // Log beforeinstallprompt listener status
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📲 beforeinstallprompt event fired!', e);
  });
}

export function isStandaloneMode(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export async function getCacheInfo() {
  if (!('caches' in window)) return { available: false };

  try {
    const cacheNames = await caches.keys();
    const caches_info: Record<string, number> = {};
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      caches_info[cacheName] = keys.length;
    }
    return { available: true, caches: caches_info };
  } catch {
    return { available: false };
  }
}

export async function clearAllCaches() {
  if (!('caches' in window)) return false;
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
}
