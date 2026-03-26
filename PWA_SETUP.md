# Imanify PWA Setup Guide

This document explains how the Progressive Web App (PWA) features have been implemented in Imanify and how to use and customize them.

## Overview

Imanify is now a full PWA with:
- ✅ Service Worker for offline support
- ✅ Web App Manifest for installability
- ✅ Install prompt with `beforeinstallprompt` event
- ✅ Smart caching strategies for APIs and static assets
- ✅ Offline fallback support
- ✅ Full-screen standalone mode
- ✅ Apple iOS support

---

## Implementation Details

### 1. **vite-plugin-pwa Configuration** (`vite.config.ts`)

The PWA plugin is configured with:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
  manifest: { /* ... */ },
  workbox: { /* ... */ },
  devOptions: { enabled: true, type: 'module' }
})
```

**Key Features:**
- **Auto-update**: Service workers automatically update in the background
- **Workbox configuration**: Handles caching strategies for different APIs
- **Dev mode enabled**: You can test PWA features locally

### 2. **Caching Strategies**

Three different caching strategies are implemented via Workbox:

#### **Prayer Times API (Aladhan)**
- **Strategy**: `CacheFirst`
- **Cache Duration**: 1 hour
- **Rationale**: Prayer times rarely change within an hour
- **Max entries**: 50

#### **Weather API (Open-Meteo)**
- **Strategy**: `CacheFirst`
- **Cache Duration**: 1 hour
- **Rationale**: Weather updates hourly
- **Max entries**: 50

#### **Quran API (AlQuran Cloud)**
- **Strategy**: `CacheFirst`
- **Cache Duration**: 24 hours
- **Rationale**: Quranic verses are immutable
- **Max entries**: 100

#### **Google APIs (Gemini, etc.)**
- **Strategy**: `NetworkFirst`
- **Network timeout**: 5 seconds
- **Cache fallback**: If network fails, serve from cache
- **Cache Duration**: 1 hour
- **Rationale**: Always try to get fresh responses for AI features

### 3. **Web App Manifest** (`public/manifest.json`)

Defines app metadata:

```json
{
  "name": "Imanify - Your Islamic Companion",
  "short_name": "Imanify",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0F3D2E",
  "background_color": "#0F3D2E",
  "icons": [...]
}
```

**Custom Shortcuts:**
- Quick access to Prayer Times
- Quick access to Quran Reader
- Quick access to Daily Azkar

### 4. **Install Button Component** (`src/components/PWAInstallButton.tsx`)

Intelligent install button that:
- Listens to `beforeinstallprompt` event
- Shows install prompt to users
- Automatically hides after installation
- Works on mobile and desktop
- Respects user preferences

**Features:**
- Shows after 3 seconds if not yet installed
- Only appears on installable devices
- Animated with pulsing effect
- Positioned above chat button

### 5. **Offline Support**

Files included:
- **PWA Service Registration**: `src/services/pwaService.ts`
- **Offline Fallback**: `src/components/OfflineFallback.tsx`

**PWA Service Utilities:**

```typescript
initPWA()                    // Initialize PWA on app startup
isStandaloneMode()          // Check if running as installed app
getCacheInfo()              // Get cache statistics
clearAllCaches()            // Clear all caches (dev only)
```

### 6. **HTML Meta Tags** (`index.html`)

Added for full PWA support:

```html
<!-- Theme color for address bar -->
<meta name="theme-color" content="#0F3D2E" />

<!-- Apple iOS specific tags -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="Imanify" />

<!-- Manifest and icons -->
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

---

## Required Assets

To complete the PWA setup, you need to add these images to the `public/` folder:

### **Image Files Needed:**

1. **`icon-192x192.png`** (192×192 pixels)
   - Square logo for home screens
   - Use Islamic Green (#0F3D2E) and Gold (#D4AF37)

2. **`icon-512x512.png`** (512×512 pixels)
   - Large logo for splash screens
   - Same design as 192x192, just larger

3. **`icon-192x192-maskable.png`** (192×192 pixels)
   - Icon with safe zone for adaptive icons
   - Must have center content in safe zone (80% of image)

4. **`icon-512x512-maskable.png`** (512×512 pixels)
   - Large maskable icon

5. **`apple-touch-icon.png`** (180×180 pixels)
   - Used for iOS home screen
   - Should be square without rounded corners (iOS handles those)

6. **`favicon.ico`** (32×32 pixels minimum)
   - Traditional browser favicon
   - Optional if favicon.svg works

7. **`/screenshots/narrow.png`** (540×720 pixels)
   - Optional: For Install prompt on mobile

8. **`/screenshots/wide.png`** (1280×720 pixels)
   - Optional: For Install prompt on desktop

### **Quick Icons Creation:**

You can use online tools:
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io)
- [App Icon Maker](https://www.appicon.co/)

Or use ImageMagick/GraphicsMagick:

```bash
# Convert SVG to PNG
convert -background none -density 150 logo.svg -resize 192x192 icon-192x192.png
convert -background none -density 150 logo.svg -resize 512x512 icon-512x512.png
```

---

## Testing the PWA

### **1. Test in Development**

```bash
npm run dev
```

Then open browser DevTools:
- **Chrome**: DevTools → Application → Manifest/Service Workers
- **Firefox**: about:debugging → This Firefox → Service Workers
- **Safari**: Develop → Experimental Features → Web Push

### **2. Build and Test Production Build**

```bash
npm run build
npm run preview
```

### **3. Test Install Prompt**

On Android or PWA simulator:
- Look for "Install app" button in bottom-right
- Click to trigger install
- Confirm in browser dialog

### **4. Test Offline**

DevTools → Network tab:

1. Load app normally
2. Go offline (set throttle to "Offline")
3. Reload page - should load from cache
4. Try accessing cached resources

### **5. Check Cache**

In browser console:

```javascript
// Get cache info
import { getCacheInfo } from './services/pwaService.ts';
const info = await getCacheInfo();
console.log(info);

// Clear all caches
import { clearAllCaches } from './services/pwaService.ts';
await clearAllCaches();
```

---

## Customization

### **Change Theme Colors**

Edit `public/manifest.json`:
```json
{
  "theme_color": "#YOUR_COLOR",
  "background_color": "#YOUR_COLOR"
}
```

Also update `index.html`:
```html
<meta name="theme-color" content="#YOUR_COLOR" />
```

### **Modify Caching Strategy**

Edit `vite.config.ts` → `workbox.runtimeCaching`:

```typescript
{
  urlPattern: /^https:\/\/your-api\.com\/.*/i,
  handler: 'CacheFirst',    // or 'NetworkFirst', 'StaleWhileRevalidate'
  options: {
    cacheName: 'your-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 3600,  // 1 hour
    },
  },
}
```

**Available Strategies:**
- `CacheFirst`: Try cache first, fall back to network
- `NetworkFirst`: Try network first, fall back to cache
- `StaleWhileRevalidate`: Return cache, update in background
- `NetworkOnly`: Network requests only
- `CacheOnly`: Cache only

### **Add App Shortcuts**

Edit `public/manifest.json` → `shortcuts` array:

```json
{
  "name": "Feature Name",
  "short_name": "Short",
  "description": "Description",
  "url": "/?feature=name",
  "icons": [{ "src": "icon-192x192.png", "sizes": "192x192" }]
}
```

---

## Deployment

### **Vercel**

PWA works automatically. Ensure:
1. `vite.config.ts` has PWA plugin
2. `public/manifest.json` exists
3. All icon files in `public/` folder
4. `index.html` has meta tags

No additional configuration needed.

### **Docker**

```dockerfile
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### **GitHub Pages**

Update `vite.config.ts`:
```typescript
export default {
  base: '/imanify/',  // Your repo name
  // ... rest of config
}
```

---

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | >= v40 |
| Firefox | ✅ Full | >= v44 |
| Safari | ⚠️ Partial | iOS 11.3+, macOS 11.1+ |
| Edge | ✅ Full | >= v79 |
| Opera | ✅ Full | >= v27 |
| Samsung Internet | ✅ Full | >= v4 |

**Safari Limitations:**
- No service worker (iOS)
- Uses app-specific storage
- Install via share → Add to Home Screen

---

## Troubleshooting

### **Service Worker not registering**

```typescript
// Check in console
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('SW Registrations:', regs);
});
```

**Solutions:**
- Clear browser cache
- Rebuild project: `npm run build`
- Check browser console for errors
- Ensure HTTPS in production (PWA requires HTTPS)

### **Icons not loading**

1. Check `public/` folder for image files
2. Run `npm run build` to include in build
3. Verify image formats (PNG recommended)
4. Check manifest paths are correct

### **Install button not showing**

1. PWA install requires HTTPS (production only)
2. Clear browser service workers
3. Try different browser/device
4. Check `beforeinstallprompt` event firing:

```javascript
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('Install prompt ready!');
});
```

### **Offline not working**

1. Service worker must be registered
2. Check DevTools → Application → Service Workers
3. Ensure API URLs match caching patterns
4. Wait for service worker to complete installation

---

## Performance Tips

1. **Lazy load images**: Use intersection observer
2. **Code splitting**: Dynamic imports for routes
3. **Compress assets**: Gzip, Brotli for production
4. **Cache assets effectively**: Long-lived cache for static files
5. **Monitor cache size**: Limit to prevent storage issues

---

## Security

- **HTTPS Required**: PWA only works on HTTPS (except localhost)
- **Manifest validation**: Browser validates manifest.json
- **API security**: Cache strategy respects CORS
- **Content Security Policy**: Add CSP headers if needed

```typescript
// Example CSP header (server-side)
'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

---

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)

---

## Next Steps

1. **Add icon files** to `public/` folder
2. **Test locally**: `npm run dev` + DevTools
3. **Build and test**: `npm run build && npm run preview`
4. **Deploy** to your hosting
5. **Monitor**: Check Service Worker updates and cache hits

---

**Happy developing with Imanify PWA! 🚀**
