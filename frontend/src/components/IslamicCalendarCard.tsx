'use client';

import { useState, useEffect } from 'react';
import { Moon, Calendar, AlertCircle, Loader } from 'lucide-react';
import { getHijriDate, formatHijriDate, HijriDateData } from '../services/hijriService';

interface IslamicCalendarCardProps {
  date?: Date;
  showPrayerTime?: boolean;
}

export function IslamicCalendarCard({ date = new Date(), showPrayerTime = false }: IslamicCalendarCardProps) {
  const [hijriData, setHijriData] = useState<HijriDateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHijriDate(date);
        setHijriData(data);
      } catch (err) {
        console.error('Failed to fetch Hijri date:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch Hijri date');
      } finally {
        setLoading(false);
      }
    };

    fetchHijriDate();
  }, [date]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-[2.5rem] border border-white/5 shadow-lg">
        <Loader className="animate-spin text-gold-500" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-[2.5rem] border border-white/5 shadow-lg">
        <div className="flex gap-3 items-start">
          <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
          <div>
            <p className="text-red-400 font-medium">Error Loading Calendar</p>
            <p className="text-red-300/70 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hijriData) {
    return null;
  }

  const hijriDateStr = formatHijriDate(hijriData);
  const gregorianDate = new Date(date);
  const gregorianStr = gregorianDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border shadow-xl transition-all duration-300 ${
        hijriData.isRamadan
          ? 'border-white/5 bg-gradient-to-br from-gold-500/10 via-islamic-green-800/40 to-islamic-green-900/40'
          : hijriData.isFriday
            ? 'border-white/5 bg-gradient-to-br from-islamic-green-800/40 via-islamic-green-900/40 to-islamic-green-900/40'
            : 'border-white/5 bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40'
      }`}
    >
      {/* Decorative corner accent */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        {/* Header with icons */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gold-500/10 rounded-2xl">
              <Moon className="text-gold-500" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Islamic Calendar</h3>
              <p className="text-gold-400/70 text-sm">Hijri Date</p>
            </div>
          </div>

          {hijriData.isRamadan && (
            <div className="px-3 py-1 bg-gold-500/20 border border-gold-500/40 rounded-full flex items-center gap-2">
              <span className="text-2xl">🌙</span>
              <span className="text-gold-400 text-sm font-medium">Ramadan</span>
            </div>
          )}

          {hijriData.isFriday && !hijriData.isRamadan && (
            <div className="px-3 py-1 bg-gold-500/15 border border-gold-500/30 rounded-full">
              <span className="text-gold-400 text-sm font-medium">Jumu\'ah</span>
            </div>
          )}
        </div>

        {/* Main Hijri Date Display */}
        <div className="mb-8">
          <p className="text-gold-500/60 text-sm mb-2 uppercase tracking-wider">Today\'s Hijri Date</p>
          <p className="text-3xl sm:text-4xl font-bold text-white mb-1 font-arabic">
            {hijriData.hijriDay}
          </p>
          <p className="text-xl sm:text-2xl text-gold-400 font-arabic">
            {hijriData.hijriMonthAr}
          </p>
          <p className="text-lg text-white/90 mt-3">
            {hijriDateStr}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent my-6" />

        {/* Gregorian Date */}
        <div className="flex items-center gap-3">
          <Calendar className="text-gold-500/70" size={18} />
          <div>
            <p className="text-gold-500/60 text-xs uppercase tracking-wider">Gregorian Date</p>
            <p className="text-white/90 text-sm sm:text-base">{gregorianStr}</p>
          </div>
        </div>

        {/* Prayer Time Placeholder (optional) */}
        {showPrayerTime && hijriData.nextPrayerName && (
          <div className="mt-6 p-4 bg-gold-500/5 border border-gold-500/10 rounded-xl">
            <p className="text-gold-500/70 text-xs uppercase tracking-wider mb-1">Next Special Prayer</p>
            <p className="text-white font-medium">{hijriData.nextPrayerName}</p>
          </div>
        )}

        {/* Ramadan Mode Active Message */}
        {hijriData.isRamadan && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-gold-500/5 border border-gold-500/20 rounded-xl">
            <p className="text-gold-300 text-sm font-medium">
              🌙 Welcome to the blessed month of Ramadan! May Allah accept from all of us.
            </p>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
    </div>
  );
}
