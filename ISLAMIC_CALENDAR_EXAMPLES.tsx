/**
 * Islamic Calendar Component - Implementation Examples
 * 
 * This file showcases various ways to use the IslamicCalendarCard component
 * and the hijri service in your Imanify app.
 */

// ============================================================================
// EXAMPLE 1: Basic Usage - Show Today's Hijri Date
// ============================================================================

import { IslamicCalendarCard } from './components/IslamicCalendarCard';

export function BasicCalendarExample() {
  return (
    <div className="p-6">
      <h1>Today's Islamic Date</h1>
      <IslamicCalendarCard />
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Date Picker - Show Hijri Date for Selected Date
// ============================================================================

import { useState } from 'react';

export function DatePickerExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6 p-6">
      <div>
        <label className="block mb-2">Select a date:</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="p-3 bg-white text-black rounded-lg"
        />
      </div>

      <IslamicCalendarCard date={selectedDate} showPrayerTime={true} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Multiple Dates - Show Hijri Dates for Multiple Days
// ============================================================================

export function MultipleDatesExample() {
  const dates = [
    new Date(2026, 2, 24), // yesterday
    new Date(2026, 2, 25), // today
    new Date(2026, 2, 26), // tomorrow
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">This Week in Hijri Calendar</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dates.map((date, idx) => (
          <div key={idx}>
            <p className="text-sm text-gray-500 mb-2">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <IslamicCalendarCard date={date} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Using the Service Directly - Custom Implementation
// ============================================================================

import { useEffect, useState } from 'react';
import { getTodayHijriDate, HijriDateData } from './services/hijriService';

export function CustomHijriDisplay() {
  const [hijri, setHijri] = useState<HijriDateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        setLoading(true);
        const data = await getTodayHijriDate();
        setHijri(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHijri();
  }, []);

  if (loading) return <div>Loading Hijri date...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!hijri) return null;

  return (
    <div className="p-6 bg-blue-50 rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Custom Hijri Display</h3>

      <div className="space-y-3">
        <p>
          <strong>Hijri Date:</strong> {hijri.hijriDay} {hijri.hijriMonthEn}{' '}
          {hijri.hijriYear} AH
        </p>
        <p>
          <strong>Arabic Month:</strong> <span className="text-2xl">{hijri.hijriMonthAr}</span>
        </p>
        <p>
          <strong>Gregorian:</strong> {hijri.gregorianDate}
        </p>

        {hijri.isRamadan && (
          <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500">
            <p className="font-bold">🌙 It's Ramadan! The blessed month of fasting.</p>
          </div>
        )}

        {hijri.isFriday && (
          <div className="p-3 bg-green-100 border-l-4 border-green-500">
            <p className="font-bold">🕌 Today is Friday (Jumu'ah) - day of gathering!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Integrated Home Screen
// ============================================================================

export function HomeScreenIntegration() {
  const [isRamadanMode, setIsRamadanMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-950 p-6 text-white">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Imanify</h1>
        <p className="text-green-300">Your Daily Deen Companion 🌙</p>
      </header>

      <div className="max-w-xl mx-auto space-y-8">
        {/* Hijri Calendar Card */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Today's Date</h2>
          <IslamicCalendarCard showPrayerTime={true} />
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-3 gap-4">
          <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition">
            📖 Quran
          </button>
          <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition">
            🤲 Azkar
          </button>
          <button className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition">
            🕌 Prayers
          </button>
        </section>

        {/* Ramadan Info */}
        {isRamadanMode && (
          <section className="p-6 bg-white/10 rounded-lg border border-white/20">
            <p className="text-center text-xl">
              🌙 We're in the blessed month of Ramadan! 🌙
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Responsive Hijri Calendar Layout
// ============================================================================

export function ResponsiveCalendarLayout() {
  return (
    <div className="min-h-screen bg-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Islamic Calendar
          </h1>
          <p className="text-gray-400">Current date in Hijri calendar</p>
        </section>

        {/* Main Calendar Card - Full Width on Mobile, Narrow on Desktop */}
        <div className="mb-8">
          <IslamicCalendarCard showPrayerTime={true} />
        </div>

        {/* Quick Info Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <QuickInfoCard
            title="Month"
            value="Ramadan"
            description="The month of fasting"
          />
          <QuickInfoCard
            title="Day"
            value="15"
            description="Of the month"
          />
          <QuickInfoCard
            title="Year"
            value="1447"
            description="Hijri year"
          />
        </div>
      </div>
    </div>
  );
}

function QuickInfoCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-white">
      <p className="text-sm text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Using Hijri Service with Error Boundary
// ============================================================================

import { getHijriDate, HijriDateData } from './services/hijriService';

export function HijriWithErrorHandling() {
  const [hijri, setHijri] = useState<HijriDateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHijriDate = async (dateStr: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getHijriDate(dateStr);
      setHijri(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch Hijri date';
      setError(errorMsg);
      console.error('Hijri fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Enter date (DD-MM-YYYY):
        </label>
        <input
          type="text"
          placeholder="25-03-2026"
          onChange={(e) => {
            if (e.target.value.length === 10) {
              fetchHijriDate(e.target.value);
            }
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading && <p className="text-blue-500">Loading...</p>}

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {hijri && (
        <div className="p-4 bg-green-100 rounded">
          <p className="font-bold">
            {hijri.hijriDay} {hijri.hijriMonthEn} {hijri.hijriYear} AH
          </p>
          <p className="text-sm text-gray-600">{hijri.gregorianDate}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Export all examples for Storybook or testing
// ============================================================================

export const examples = {
  BasicCalendarExample,
  DatePickerExample,
  MultipleDatesExample,
  CustomHijriDisplay,
  HomeScreenIntegration,
  ResponsiveCalendarLayout,
  HijriWithErrorHandling,
};
