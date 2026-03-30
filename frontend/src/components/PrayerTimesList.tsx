import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, AlertCircle, Zap } from 'lucide-react';
import { getTodayPrayerTimes, PrayerData } from '../services/prayerService';

interface PrayerTimeUpdate {
  name: string;
  time: string;
  isNext: boolean;
  isPassed: boolean;
  timeUntil?: string;
}

export const PrayerTimesList: React.FC = () => {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prayerUpdates, setPrayerUpdates] = useState<PrayerTimeUpdate[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prayerData) {
      updatePrayerStatus();
    }
  }, [prayerData, currentTime]);

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodayPrayerTimes();
      setPrayerData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch prayer times');
      setPrayerData(null);
    } finally {
      setLoading(false);
    }
  };

  const updatePrayerStatus = () => {
    if (!prayerData) return;

    const prayers = [
      { name: 'Fajr', time: prayerData.fajr },
      { name: 'Dhuhr', time: prayerData.dhuhr },
      { name: 'Asr', time: prayerData.asr },
      { name: 'Maghrib', time: prayerData.maghrib },
      { name: 'Isha', time: prayerData.isha },
    ];

    const now = currentTime;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const updates: PrayerTimeUpdate[] = prayers.map((prayer) => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      const isPassed = prayerMinutes < nowMinutes;
      const isNext = !isPassed && prayerMinutes > nowMinutes;

      let timeUntil = '';
      if (!isPassed) {
        const diff = prayerMinutes - nowMinutes;
        const diffHours = Math.floor(diff / 60);
        const diffMins = diff % 60;
        timeUntil = `${diffHours}h ${diffMins}m`;
      }

      return {
        name: prayer.name,
        time: prayer.time,
        isNext: isNext && prayers.every((p) => timeToMinutes(p.time) >= prayerMinutes || p.name === prayer.name),
        isPassed,
        timeUntil,
      };
    });

    setPrayerUpdates(updates);
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center min-h-[300px]"
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Clock size={40} className="text-gold-400 mb-4" />
        </motion.div>
        <p className="text-white/60">Loading prayer times...</p>
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
            <h3 className="font-bold text-red-300 mb-2">Prayer Times Error</h3>
            <p className="text-white/60 text-sm mb-4">{error}</p>
            <button
              onClick={fetchPrayerTimes}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
            >
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!prayerData) return null;

  const nextPrayer = prayerUpdates.find((p) => p.isNext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Next Prayer Highlight */}
      <AnimatePresence>
        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-2xl p-6 border border-gold-500/40 relative overflow-hidden"
          >
            {/* Animated background pulse */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 -z-10"
              style={{ opacity: 0 }}
            />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] text-gold-300 uppercase tracking-widest font-bold mb-1">Next Prayer</p>
                <h3 className="text-2xl font-bold text-gold-400 mb-2">{nextPrayer.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-white/80 font-semibold">{nextPrayer.time}</p>
                  <p className="text-sm text-gold-300">in {nextPrayer.timeUntil}</p>
                </div>
              </div>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Zap size={32} className="text-gold-400" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prayer Times Grid */}
      <div className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-3xl p-6 border border-white/5 space-y-3">
        <h3 className="text-sm font-bold text-gold-400 uppercase tracking-widest mb-4">Today's Prayer Times</h3>

        <div className="space-y-2">
          {prayerUpdates.map((prayer, idx) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl transition-all border ${
                prayer.isNext
                  ? 'bg-gold-500/20 border-gold-500/50 shadow-lg shadow-gold-500/20'
                  : prayer.isPassed
                    ? 'bg-white/5 border-white/5 opacity-60'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                {prayer.isNext && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0"
                  />
                )}
                {prayer.isPassed && <div className="w-2 h-2 rounded-full bg-white/30 flex-shrink-0" />}
                {!prayer.isNext && !prayer.isPassed && (
                  <div className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
                )}

                <span className="font-semibold text-white">{prayer.name}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gold-400 font-bold font-mono">{prayer.time}</span>
                {!prayer.isPassed && prayer.timeUntil && (
                  <span className={`text-xs font-semibold ${prayer.isNext ? 'text-gold-300' : 'text-white/50'}`}>
                    {prayer.timeUntil}
                  </span>
                )}
                {prayer.isPassed && <span className="text-xs text-white/30">Passed</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Prayer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2"
      >
        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">📍 Location-based times</p>
        <p className="text-xs text-white/60">Times calculated for Addis Ababa, Ethiopia</p>
        {prayerData.isRamadan && (
          <p className="text-xs text-emerald-300 font-semibold">🌙 Ramadan Mode Active</p>
        )}
      </motion.div>

      {/* Refresh Button */}
      <button
        onClick={fetchPrayerTimes}
        className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white py-2 rounded-lg font-semibold text-sm transition-all active:scale-95"
      >
        <Clock size={16} />
        Refresh Times
      </button>
    </motion.div>
  );
};
