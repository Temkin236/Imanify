import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isDev = mode === 'development';
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: isDev ? 'injectManifest' : 'generateSW',
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Imanify - Your Islamic Companion',
          short_name: 'Imanify',
          description: 'A Progressive Islamic Companion App with Prayer Times, Quran Reader, and Spiritual Reminders',
          theme_color: '#0F3D2E',
          background_color: '#0F3D2E',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait-primary',
          icons: [
            {
              src: 'icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'icon-192x192-maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'icon-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Prayer Times',
              short_name: 'Prayers',
              description: 'View today prayer times',
              url: '/?tab=home',
              icons: [{src: 'icon-192x192.png', sizes: '192x192'}],
            },
            {
              name: 'Read Quran',
              short_name: 'Quran',
              description: 'Open the Quran reader',
              url: '/?tab=quran',
              icons: [{src: 'icon-192x192.png', sizes: '192x192'}],
            },
            {
              name: 'Daily Azkar',
              short_name: 'Azkar',
              description: 'View daily remembrances',
              url: '/?tab=azkar',
              icons: [{src: 'icon-192x192.png', sizes: '192x192'}],
            },
          ],
        },
        workbox: {
          globPatterns: isDev ? ['**/*.{js}'] : ['**/*.{js,css,html,ico,png,svg}'],
          globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'aladhan-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 3600, // 1 hour
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'weather-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 3600, // 1 hour
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'quran-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 86400, // 24 hours
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'google-api-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 3600,
                },
              },
            },
          ],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5000000,
        },
        devOptions: {
          enabled: true,
          type: 'module',
          navigateFallback: 'index.html',
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR can be disabled via DISABLE_HMR environment variable.
      // Keep this toggle to support environments where file watching must be limited.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
