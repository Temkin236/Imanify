/**
 * Resolves the backend API base URL for all environments.
 * Handles common Vercel misconfigurations (missing https:// or /api suffix).
 */
function resolveApiBaseUrl(): string {
  const fallback = 'http://localhost:3000/api';
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

  if (!raw) {
    if (import.meta.env.PROD) {
      console.warn(
        '[Imanify] VITE_API_BASE_URL is not set. Set it in Vercel to https://imanify-8.onrender.com/api'
      );
    }
    return fallback;
  }

  let url = raw.replace(/\/+$/, '');

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
}

export const API_BASE_URL = resolveApiBaseUrl();
