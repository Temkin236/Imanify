const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export interface QiblaData {
  angle: number; // 0-360 degrees, 0=North, 90=East, 180=South, 270=West
  direction: string; // NE, NW, SW, SE, N, S, E, W
  distance: number; // kilometers to Kaaba
  userLat: number;
  userLng: number;
  lastUpdated: Date;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export async function getQiblaDirection(): Promise<QiblaData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const qibla = calculateQiblaAngle(latitude, longitude);
        const distance = calculateDistance(latitude, longitude, KAABA_LAT, KAABA_LNG);

        resolve({
          angle: qibla,
          direction: getDirectionName(qibla),
          distance,
          userLat: latitude,
          userLng: longitude,
          lastUpdated: new Date(),
        });
      },
      (error) => {
        const errorMessage =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission denied. Please enable location access.'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'Location information is unavailable.'
              : 'Failed to get your location. Please try again.';

        reject({
          code: error.code,
          message: errorMessage,
        });
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
