import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, AlertCircle, RefreshCw, MapPin } from 'lucide-react';
import { getQiblaDirection, getDirectionColor, QiblaData, GeolocationError } from '../services/qiblaService';

export const QiblaCompass: React.FC = () => {
  const [qibla, setQibla] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [deviceOrientation, setDeviceOrientation] = useState(0);
  const [hasOrientation, setHasOrientation] = useState(false);

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

  const fetchQibla = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQiblaDirection();
      setQibla(data);
    } catch (err: any) {
      setError(err);
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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center min-h-[400px]"
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Compass size={40} className="text-gold-400 mb-4" />
        </motion.div>
        <p className="text-white/60">Locating your position...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-900/40 to-red-950/40 rounded-3xl p-8 border border-red-500/20"
      >
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-red-300 mb-2">Location Access Required</h3>
            <p className="text-white/60 text-sm mb-4">{error.message}</p>
            <button
              onClick={fetchQibla}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
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
      <div className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-3xl p-8 border border-white/5">
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
        onClick={fetchQibla}
        className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
      >
        <RefreshCw size={16} />
        Refresh Location
      </button>
    </motion.div>
  );
};
