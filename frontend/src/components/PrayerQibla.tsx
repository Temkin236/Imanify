import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Clock, ChevronDown } from 'lucide-react';
import { QiblaCompass } from './QiblaCompass';
import { PrayerTimesList } from './PrayerTimesList';

export const PrayerQibla: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<'qibla' | 'prayer' | 'both'>('both');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="px-2">
        <h2 className="text-3xl font-bold tracking-tight mb-1">Prayer & Qibla</h2>
        <p className="text-white/50 text-sm">Find your spiritual direction</p>
      </header>

      {/* Layout Toggle (for mobile) */}
      <div className="px-2 flex gap-2 md:hidden">
        <button
          onClick={() => setExpandedSection('qibla')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all ${
            expandedSection === 'qibla' || expandedSection === 'both'
              ? 'bg-gold-500 text-islamic-green-950'
              : 'bg-white/5 text-white/60'
          }`}
        >
          <Compass size={16} />
          Qibla
        </button>
        <button
          onClick={() => setExpandedSection('prayer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition-all ${
            expandedSection === 'prayer' || expandedSection === 'both'
              ? 'bg-gold-500 text-islamic-green-950'
              : 'bg-white/5 text-white/60'
          }`}
        >
          <Clock size={16} />
          Prayer
        </button>
      </div>

      {/* Two-Section Layout */}
      <div className="px-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Qibla Compass */}
        <AnimatePresence mode="wait">
          {(expandedSection === 'qibla' || expandedSection === 'both') && (
            <motion.div
              key="qibla"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="md:col-span-1"
            >
              <div className="sticky top-20">
                <div className="flex items-center gap-2 mb-4 md:hidden">
                  <Compass size={20} className="text-gold-400" />
                  <h3 className="text-lg font-bold">Qibla Direction</h3>
                </div>
                <QiblaCompass />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Prayer Times */}
        <AnimatePresence mode="wait">
          {(expandedSection === 'prayer' || expandedSection === 'both') && (
            <motion.div
              key="prayer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="md:col-span-1"
            >
              <div className="sticky top-20">
                <div className="flex items-center gap-2 mb-4 md:hidden">
                  <Clock size={20} className="text-gold-400" />
                  <h3 className="text-lg font-bold">Prayer Times</h3>
                </div>
                <PrayerTimesList />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Hidden Headers */}
      <div className="hidden md:block px-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gold-500/20">
            <Compass size={20} className="text-gold-400" />
            <h3 className="text-lg font-bold">Qibla Direction</h3>
          </div>
          <div className="flex items-center gap-2 pb-4 border-b border-gold-500/20">
            <Clock size={20} className="text-gold-400" />
            <h3 className="text-lg font-bold">Prayer Times</h3>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-2 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Qibla Info */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl p-4 border border-emerald-500/30">
          <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold mb-2">Qibla Information</p>
          <p className="text-xs text-white/70 leading-relaxed">
            The Qibla is the direction towards the Sacred Kaaba in Mecca. Face this direction to perform your prayers
            correctly.
          </p>
        </div>

        {/* Prayer Info */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-4 border border-blue-500/30">
          <p className="text-[10px] text-blue-300 uppercase tracking-widest font-bold mb-2">Prayer Times</p>
          <p className="text-xs text-white/70 leading-relaxed">
            Prayer times are calculated based on your current location. Pray at the designated times to maintain your
            daily routine.
          </p>
        </div>

        {/* Sunnah Info */}
        <div className="bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-2xl p-4 border border-gold-500/30">
          <p className="text-[10px] text-gold-300 uppercase tracking-widest font-bold mb-2">Sunnah Reminder</p>
          <p className="text-xs text-white/70 leading-relaxed">
            "The best prayer is Fajr prayer in congregation." - Maintain consistency and seek reward in every prayer.
          </p>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="px-2 bg-white/5 rounded-2xl p-6 border border-white/5 space-y-3"
      >
        <h4 className="font-bold text-gold-400 text-sm uppercase tracking-widest mb-4">💡 Quick Tips</h4>
        <ul className="space-y-2 text-xs text-white/70">
          <li className="flex items-start gap-3">
            <span className="text-gold-400 mt-1">✓</span>
            <span>Enable device orientation for live compass tracking on mobile devices</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold-400 mt-1">✓</span>
            <span>Ensure location permissions are granted for accurate prayer times</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold-400 mt-1">✓</span>
            <span>Prayer times are based on Islamic calculation methods (Method 2: Egyptian General Authority)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold-400 mt-1">✓</span>
            <span>Set reminders 5-10 minutes before prayer time to prepare</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
