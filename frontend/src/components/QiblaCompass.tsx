import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, AlertCircle, RefreshCw, MapPin, Settings, ChevronLeft } from 'lucide-react';
import { getQiblaDirection, getDirectionColor, QiblaData, GeolocationError } from '../services/qiblaService';

// Common cities with coordinates for quick selection
const COMMON_CITIES = [
  { name: 'Addis Ababa, Ethiopia', lat: 9.0320, lng: 38.7469 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869 },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011 },
];

export const QiblaCompass: React.FC = () => {
  const [qibla, setQibla] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);
  const [hasOrientation, setHasOrientation] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showCitySelect, setShowCitySelect] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  useEffect(() => {
    fetchQibla();
    setupOrientation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchQibla();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchQibla = async (lat?: number, lng?: number) => {
    console.log('[QiblaCompass] Fetching qibla:', { lat, lng });
    try {
      setLoading(true);
      setError(null);
      setQibla(null);

      const data = await getQiblaDirection(lat, lng);
      console.log('[QiblaCompass] Qibla data received:', data);

      setQibla(data);
      setShowManualInput(false);
      setShowCitySelect(false);
      setManualLat('');
      setManualLng('');
    } catch (err: any) {
      console.error('[QiblaCompass] Qibla fetch error:', err);
      setError(err || { code: -1, message: 'Unknown error occurred', canRetry: true });
      setQibla(null);
    } finally {
      setLoading(false);
    }
  };

  const setupOrientation = () => {
    if ('DeviceOrientationEvent' in window && typeof DeviceOrientationEvent !== 'undefined') {
      // Request permission for iOS 13+
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any)
          .requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              setHasOrientation(true);
            }
          })
          .catch(() => {
            // Permission denied, use compass without device orientation
            setHasOrientation(false);
          });
      } else {
        // For Android and other browsers
        window.addEventListener('deviceorientation', handleOrientation);
        setHasOrientation(true);
      }
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      // Alpha is the rotation around z-axis (0-360)
      setDeviceOrientation(360 - (event.alpha || 0));
    }
  };

  const handleCitySelect = (city: typeof COMMON_CITIES[0]) => {
    console.log('[QiblaCompass] City selected:', city);
    fetchQibla(city.lat, city.lng);
  };

  const handleManualLocation = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    // Validation
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid numbers for latitude and longitude');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    console.log('[QiblaCompass] Manual location submitted:', { lat, lng });

    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay for UI update
      await fetchQibla(lat, lng);
    } catch (err: any) {
      console.error('[QiblaCompass] Manual location error:', err);
      setError(err || { code: -1, message: 'Failed to set location', canRetry: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5 flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[400px]"
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Compass size={40} className="text-gold-400 mb-4" />
        </motion.div>
        <p className="text-white/60">Locating your position...</p>
      </motion.div>
    );
  }

  if (showManualInput) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={24} className="text-gold-400" />
          <h3 className="font-bold text-white text-lg">Enter Your Location</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-white/70 text-sm font-semibold mb-2">
              Latitude
              <span className="text-gold-400 text-xs ml-2">(-90 to 90)</span>
            </label>
            <input
              type="number"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="e.g., 24.4539"
              step="0.0001"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-semibold mb-2">
              Longitude
              <span className="text-gold-400 text-xs ml-2">(-180 to 180)</span>
            </label>
            <input
              type="number"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              placeholder="e.g., 46.6753"
              step="0.0001"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-gold-400 focus:outline-none transition-all"
            />
          </div>

          <p className="text-white/50 text-xs">
            💡 Tip: Find coordinates on Google Maps (right-click &gt; coordinates) or use the city quick-select
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleManualLocation}
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
          >
            Confirm Location
          </button>
          <button
            onClick={() => setShowManualInput(false)}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    );
  }

  if (showCitySelect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5 space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={24} className="text-gold-400" />
          <h3 className="font-bold text-white text-lg">Select Your City</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
          {COMMON_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city)}
              className="bg-white/5 hover:bg-gold-500/20 border border-white/10 hover:border-gold-400 rounded-lg px-4 py-3 text-left transition-all active:scale-95 group"
            >
              <p className="font-semibold text-white group-hover:text-gold-400 text-sm">{city.name}</p>
              <p className="text-white/50 text-xs">{city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCitySelect(false)}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <p className="text-white/50 text-xs text-center">
          Don't see your city? Enter coordinates manually
        </p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/40 to-red-950/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-red-500/20"
      >
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-red-300 mb-2">Location Access Required</h3>
            <p className="text-white/60 text-sm mb-4">{error.message}</p>

            <div className="flex flex-col gap-2">
              {error.canRetry && (
                <button
                  onClick={() => fetchQibla()}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 w-full"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              )}

              <button
                onClick={() => setShowCitySelect(true)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 w-full"
              >
                <MapPin size={16} />
                Select Your City
              </button>

              <button
                onClick={() => setShowManualInput(true)}
                className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 w-full"
              >
                <Settings size={16} />
                Enter Coordinates
              </button>
            </div>

            <p className="text-white/40 text-xs mt-4">
              💡 You can use a quick city, enter coordinates, or enable location in browser settings
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!qibla) return null;

  // Calculate the arrow rotation (device orientation - qibla angle)
  const arrowRotation = hasOrientation ? (qibla.angle - deviceOrientation) % 360 : qibla.angle;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Compass Circle */}
      <div className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5">
        <div className="relative mx-auto aspect-square max-w-xs">
          {/* Outer circle background */}
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Compass background */}
            <circle cx="100" cy="100" r="95" fill="#0F3D2E" opacity="0.2" stroke="#D4AF37" strokeWidth="2" />

            {/* Cardinal directions */}
            <text x="100" y="20" textAnchor="middle" className="text-white font-bold text-lg fill-gold-400">
              N
            </text>
            <text x="180" y="105" textAnchor="start" className="text-white font-bold text-lg fill-gold-400">
              E
            </text>
            <text x="100" y="190" textAnchor="middle" className="text-white font-bold text-lg fill-gold-400">
              S
            </text>
            <text x="20" y="105" textAnchor="end" className="text-white font-bold text-lg fill-gold-400">
              W
            </text>

            {/* Intercardinal markers */}
            {[45, 135, 225, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = 100 + 85 * Math.cos(rad - Math.PI / 2);
              const y = 100 + 85 * Math.sin(rad - Math.PI / 2);
              return <circle key={angle} cx={x} cy={y} r="2" fill="#D4AF37" opacity="0.5" />;
            })}

            {/* Degree markers */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const x1 = 100 + 85 * Math.cos(angle - Math.PI / 2);
              const y1 = 100 + 85 * Math.sin(angle - Math.PI / 2);
              const x2 = 100 + 90 * Math.cos(angle - Math.PI / 2);
              const y2 = 100 + 90 * Math.sin(angle - Math.PI / 2);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="1" opacity="0.3" />;
            })}

            {/* Center circle */}
            <circle cx="100" cy="100" r="8" fill="#D4AF37" />
          </svg>

          {/* Rotating arrow (Qibla direction) */}
          <motion.div
            animate={{ rotate: arrowRotation }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Arrow pointing up */}
              <div className="absolute top-8 w-1 h-24 bg-gradient-to-t from-gold-500 to-gold-300 rounded-full shadow-lg shadow-gold-500/50" />

              {/* Arrowhead */}
              <div className="absolute top-5 w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gold-400" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Qibla Information */}
      <div className="grid grid-cols-2 gap-4">
        {/* Angle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-2xl p-4 border border-gold-500/30"
        >
          <p className="text-[10px] text-gold-300 uppercase tracking-widest font-bold mb-2">Qibla Angle</p>
          <p className="text-2xl font-bold text-gold-400">{Math.round(qibla.angle)}°</p>
          <p className="text-xs text-white/50 mt-1">{qibla.direction}</p>
        </motion.div>

        {/* Distance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl p-4 border border-emerald-500/30"
        >
          <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Distance to Kaaba</p>
          <p className="text-2xl font-bold text-emerald-400">{Math.round(qibla.distance)} km</p>
          <p className="text-xs text-white/50 mt-1">Straight line</p>
        </motion.div>
      </div>

      {/* Location Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2"
      >
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <MapPin size={16} className="text-gold-400" />
          <span>
            {qibla.userLat.toFixed(4)}°N, {qibla.userLng.toFixed(4)}°E
          </span>
        </div>
        {hasOrientation && (
          <p className="text-[10px] text-gold-400">
            💡 Tip: Rotate your device to align the arrow with Qibla direction
          </p>
        )}
        {!hasOrientation && (
          <p className="text-[10px] text-yellow-400">
            ℹ️ Device orientation not available. Compass shows static Qibla direction from North.
          </p>
        )}
      </motion.div>

      {/* Refresh Button */}
      <button
        onClick={() => fetchQibla()}
        className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
      >
        <RefreshCw size={16} />
        Refresh Location
      </button>
    </motion.div>
  );
};
