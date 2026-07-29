const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const CACHE_KEY = 'imanify_qibla_location';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

export interface QiblaData {
  angle: number; // 0-360 degrees, 0=North, 90=East, 180=South, 270=West
  direction: string; // NE, NW, SW, SE, N, S, E, W
  distance: number; // kilometers to Kaaba
  userLat: number;
  userLng: number;
  lastUpdated: Date;
  fromCache?: boolean;
}

export interface GeolocationError {
  code: number;
  message: string;
  canRetry?: boolean;
}

/**
 * Calculate Qibla from coordinates
 */
function calculateQiblaFromCoords(lat: number, lng: number): QiblaData {
  const qibla = calculateQiblaAngle(lat, lng);
  const distance = calculateDistance(lat, lng, KAABA_LAT, KAABA_LNG);

  return {
    angle: qibla,
    direction: getDirectionName(qibla),
    distance,
    userLat: lat,
    userLng: lng,
    lastUpdated: new Date(),
  };
}

/**
 * Get cached location from localStorage with validation
 */
function getCachedLocation(): QiblaData | null {
  try {
    if (!localStorage) return null;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const now = Date.now();
    const lastUpdated = new Date(data.lastUpdated).getTime();
    const age = now - lastUpdated;

    // Check if cache is still valid
    if (age < CACHE_EXPIRY && data.userLat && data.userLng) {
      return {
        ...data,
        fromCache: true,
        lastUpdated: new Date(data.lastUpdated),
      };
    }

    // Clear expired cache
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (err) {
    console.warn('[QiblaService] Cache read error:', err);
    return null;
  }
}

/**
 * Cache location to localStorage safely
 */
function cacheLocation(data: QiblaData): void {
  try {
    if (!localStorage) return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('[QiblaService] Cache write error:', err);
  }
}

/**
 * Get Qibla direction with smart fallback
 * 1. If manual coords provided, use them
 * 2. Try to get current location
 * 3. Fall back to cached location if permission denied
 * 4. Ask user for manual location input if all else fails
 */
export async function getQiblaDirection(manualLat?: number, manualLng?: number): Promise<QiblaData> {
  console.log('[QiblaService] Request:', { manualLat, manualLng });

  // If manual location provided, use it
  if (manualLat !== undefined && manualLng !== undefined) {
    console.log('[QiblaService] Using manual location');
    const data = calculateQiblaFromCoords(manualLat, manualLng);
    cacheLocation(data);
    return data;
  }

  // Try to get geolocation
  if (!navigator.geolocation) {
    console.warn('[QiblaService] Geolocation not supported');
    const cached = getCachedLocation();
    if (cached) {
      console.log('[QiblaService] Using cached location');
      return cached;
    }

    throw {
      code: 0,
      message: 'Geolocation not supported by your browser. Please enter your location manually.',
      canRetry: false,
    } as GeolocationError;
  }

  // Wrap geolocation in promise with proper timeout
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.warn('[QiblaService] Geolocation timeout');
      const cached = getCachedLocation();
      if (cached) {
        console.log('[QiblaService] Using cached location after timeout');
        resolve(cached);
      } else {
        reject({
          code: -1,
          message: 'Location request timed out. Please try again or enter manually.',
          canRetry: true,
        } as GeolocationError);
      }
    }, 12000); // 12 second timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        console.log('[QiblaService] Location obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        try {
          const data = calculateQiblaFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          cacheLocation(data);
          resolve(data);
        } catch (err) {
          console.error('[QiblaService] Calculation error:', err);
          reject({
            code: -2,
            message: 'Error calculating Qibla direction.',
            canRetry: true,
          } as GeolocationError);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.warn('[QiblaService] Geolocation error:', error);

        // Try cached location first for any error
        const cached = getCachedLocation();
        if (cached) {
          console.log('[QiblaService] Using cached location after error');
          resolve(cached);
          return;
        }

        // Handle specific errors
        let errorMessage = 'Failed to get your location.';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            'Location permission denied. Please enable it in browser settings or enter your location manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage =
            'Location information is unavailable. Please enter your location manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Please try again or enter manually.';
        }

        reject({
          code: error.code,
          message: errorMessage,
          canRetry: true,
        } as GeolocationError);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000, // 5 minutes max age
      }
    );
  });
}

/**
 * Calculate Qibla angle using the great-circle formula
 * Returns angle in degrees (0-360) where 0 is North
 */
function calculateQiblaAngle(userLat: number, userLng: number): number {
  const userLatRad = degreesToRadians(userLat);
  const userLngRad = degreesToRadians(userLng);
  const kaabaLatRad = degreesToRadians(KAABA_LAT);
  const kaabaLngRad = degreesToRadians(KAABA_LNG);

  const y = Math.sin(kaabaLngRad - userLngRad) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
    Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(kaabaLngRad - userLngRad);

  const angle = radiansToDegrees(Math.atan2(y, x));
  return (angle + 360) % 360; // Normalize to 0-360
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);
  const deltaLat = degreesToRadians(lat2 - lat1);
  const deltaLng = degreesToRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Get cardinal direction name from angle
 */
function getDirectionName(angle: number): string {
  const directions = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  const index = Math.round(angle / 22.5) % 16;
  return directions[index];
}

/**
 * Get color based on direction
 */
export function getDirectionColor(direction: string): string {
  const colors: Record<string, string> = {
    N: 'from-blue-400 to-blue-600',
    NNE: 'from-blue-500 to-cyan-600',
    NE: 'from-cyan-400 to-cyan-600',
    ENE: 'from-cyan-500 to-emerald-600',
    E: 'from-emerald-400 to-emerald-600',
    ESE: 'from-emerald-500 to-lime-600',
    SE: 'from-lime-400 to-lime-600',
    SSE: 'from-lime-500 to-yellow-600',
    S: 'from-yellow-400 to-yellow-600',
    SSW: 'from-yellow-500 to-orange-600',
    SW: 'from-orange-400 to-orange-600',
    WSW: 'from-orange-500 to-red-600',
    W: 'from-red-400 to-red-600',
    WNW: 'from-red-500 to-pink-600',
    NW: 'from-pink-400 to-pink-600',
    NNW: 'from-pink-500 to-blue-600',
  };
  return colors[direction] || 'from-blue-400 to-blue-600';
}

/**
 * Get debug info for troubleshooting
 */
export function getDebugInfo(): Record<string, any> {
  return {
    geolocationSupported: !!navigator.geolocation,
    localStorageAvailable: !!localStorage,
    cacheData: getCachedLocation(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Clear cache manually
 */
export function clearLocationCache(): void {
  try {
    if (localStorage) {
      localStorage.removeItem(CACHE_KEY);
      console.log('[QiblaService] Cache cleared');
    }
  } catch (err) {
    console.warn('[QiblaService] Error clearing cache:', err);
  }
}
