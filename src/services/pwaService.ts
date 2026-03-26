/**
 * PWA Service Worker Registration Utility
 * Handles service worker registration and offline detection
 */

export async function initPWA() {
  console.log('🔧 Initializing PWA...');

  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      console.log('📱 Registering service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully:', registration);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('🔄 New service worker version available');
            }
          });
        }
      });

      // Log controller info
      if (navigator.serviceWorker.controller) {
        console.log('✅ Service Worker is controlling the page');
      } else {
        console.log('⏳ Service Worker registered, will take control on next reload');
      }
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.warn('⚠️ Service Workers not supported in this browser');
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

  console.log('✅ PWA initialization complete');
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isStandaloneMode(): boolean {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) {
    console.log('📲 App running in standalone mode (installed PWA)');
  }
  return isStandalone;
}

/**
 * Get cache status information
 */
export async function getCacheInfo() {
  if (!('caches' in window)) {
    return { available: false };
  }

  try {
    const cacheNames = await caches.keys();
    const caches_info = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      (caches_info as any)[cacheName] = keys.length;
    }

    console.log('💾 Cache info:', caches_info);
    return { available: true, caches: caches_info };
  } catch (error) {
    console.error('Error getting cache info:', error);
    return { available: false };
  }
}

/**
 * Clear all caches (useful for development)
 */
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('🗑️ All caches cleared');
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
}
