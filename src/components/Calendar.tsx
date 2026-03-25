import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Star, Sparkles } from 'lucide-react';
import { IslamicCalendarCard } from './IslamicCalendarCard';
import { getHijriDate, HijriDateData } from '../services/hijriService';
import { getMonthlyIslamicEvents, IslamicEvent } from '../services/islamicEventsService';

// Multi-language day names
const DAY_NAMES = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  am: ['ሰኞ', 'ማክሮብ', 'ሮብ', 'ሐሙስ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'],
};

const DAY_ABBR = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: ['ح', 'ن', 'ث', 'ع', 'خ', 'ج', 'س'],
  am: ['ሰ', 'ማ', 'ሮ', 'ሐ', 'ሓ', 'ዓ', 'ቅ'],
};

const HIJRI_MONTHS = {
  en: ['Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani', 'Jumada al-awwal', 
       'Jumada al-thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'],
  ar: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 
       'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
  am: ['ሙharram', 'ሳፋር', 'ራቢዑ ኣልኣውዋል', 'ራቢዑ ኣልthani', 'ጁማዳ ኣልኣውላ', 'ጁማዳ ኣልthania',
       'ራጃብ', 'ሻዓባን', 'ራማዳን', 'ሻውዋል', 'ዱ ኣልቂዕዳህ', 'ዱ ኣልሂጃህ'],
};

interface DayInfo {
  hijriDay?: number;
  hijriMonth?: string;
  hijriMonthAr?: string;
  isFriday?: boolean;
  isRamadan?: boolean;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 25)); // March 25, 2026
  const [hijriData, setHijriData] = useState<HijriDateData | null>(null);
  const [daysData, setDaysData] = useState<Map<number, DayInfo>>(new Map());
  const [language, setLanguage] = useState<'en' | 'ar' | 'am'>('en');

  // Fetch Hijri date when component mounts
  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const data = await getHijriDate(currentDate);
        setHijriData(data);
        loadMonthDaysHijri(data.hijriYear, data.hijriMonthEn === 'Ramadan' ? 9 : 0);
      } catch (error) {
        console.error('Error fetching Hijri date:', error);
      }
    };

    fetchHijri();
  }, [currentDate]);

  // Load Hijri dates for the month (simplified - shows 30 days)
  const loadMonthDaysHijri = async (year: number, month: number) => {
    const newDaysData = new Map<number, DayInfo>();
    
    // For this demo, we'll simulate Ramadan (29-30 days)
    const daysInMonth = 30;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const testDate = new Date(currentDate);
      testDate.setDate(testDate.getDate() + (day - currentDate.getDate()));
      
      try {
        const hijri = await getHijriDate(testDate);
        newDaysData.set(day, {
          hijriDay: hijri.hijriDay,
          hijriMonth: hijri.hijriMonthEn,
          hijriMonthAr: hijri.hijriMonthAr,
          isFriday: hijri.isFriday,
          isRamadan: hijri.isRamadan,
        });
      } catch (error) {
        // Skip on error
      }
    }
    
    setDaysData(newDaysData);
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get Islamic events for the current Hijri month - extract month number from hijriData
  const hijriMonthNumber = hijriData?.hijriMonthNumber || 1; // Default to Muharram if not loaded
  const events: IslamicEvent[] = getMonthlyIslamicEvents(hijriMonthNumber);
  
  // Sort events by date and show only upcoming ones
  const upcomingEvents = events
    .filter(e => e.date >= (hijriData?.hijriDay || 1))
    .sort((a, b) => a.date - b.date)
    .slice(0, 5); // Show top 5 upcoming events

  return (
    <div className="space-y-8 pb-20">
      <header className="px-2 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Islamic Calendar</h2>
          <p className="accent-font text-gold-400 text-xl">{hijriData?.hijriDay} {hijriData?.hijriMonthEn} {hijriData?.hijriYear} AH</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <CalendarIcon size={16} className="text-gold-400" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{monthName}</span>
        </div>
      </header>

      {/* Islamic Calendar Card - Live Hijri Date */}
      <section className="px-2">
        <IslamicCalendarCard showPrayerTime={true} />
      </section>

      {/* Language Toggle */}
      <section className="px-2 flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            language === 'en' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            language === 'ar' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          العربية
        </button>
        <button
          onClick={() => setLanguage('am')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            language === 'am' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          አማርኛ
        </button>
      </section>

      {/* Calendar Grid */}
      <section className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-[2.5rem] p-8 border border-white/5 space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <motion.button 
            whileHover={{ x: -4 }}
            onClick={goToPrevMonth}
            className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-gold-400 transition-colors border border-white/5"
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <div className="text-center">
            <h3 className="font-bold text-2xl tracking-tight">{hijriData?.hijriMonthAr || 'رمضان'}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">
              {hijriData?.hijriYear} AH
            </p>
            <p className="text-xs text-white/30 mt-2">{monthName}</p>
          </div>

          <motion.button 
            whileHover={{ x: 4 }}
            onClick={goToNextMonth}
            className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-gold-400 transition-colors border border-white/5"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Day names header - Multi-language */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                {DAY_ABBR[language][i]}
              </p>
              <p className="text-[10px] text-white/40 mt-1">{DAY_NAMES[language][i]}</p>
            </div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const dayInfo = daysData.get(day);
            const today = isToday(day);
            const friday = dayInfo?.isFriday;
            const ramadan = dayInfo?.isRamadan;
            const event = events.find(e => e.date === day);

            return (
              <motion.button
                key={day}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border p-2 group ${
                  today
                    ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-islamic-green-950 border-gold-400 shadow-lg shadow-gold-500/30'
                    : friday
                      ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-white hover:bg-emerald-500/30'
                      : ramadan
                        ? 'bg-gradient-to-br from-white/10 to-white/5 border-gold-500/20 text-white/90 hover:bg-white/15'
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {/* Day number */}
                <span className={`text-lg font-bold ${today ? 'text-islamic-green-950' : ''}`}>{day}</span>

                {/* Hijri day info */}
                {dayInfo?.hijriDay && (
                  <span className={`text-[10px] font-semibold mt-0.5 ${today ? 'text-islamic-green-900/70' : 'text-white/50 group-hover:text-white/70'}`}>
                    {dayInfo.hijriDay}
                  </span>
                )}

                {/* Event indicator */}
                {event && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${event.color} border border-white/20 shadow-lg`}>
                    <event.icon size={8} />
                  </div>
                )}

                {/* Friday indicator */}
                {friday && !today && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
                )}

                {/* Today indicator */}
                {today && (
                  <div className="absolute -bottom-1.5 w-1.5 h-1.5 bg-islamic-green-950 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-gold-500" />
            <span className="text-white/60">Today</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" />
            <span className="text-white/60">Friday</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star size={12} className="text-gold-400" />
            <span className="text-white/60">Events</span>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-4">
          <h3 className="font-black text-2xl tracking-tight">Upcoming Events</h3>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">This Month</span>
        </div>
        <div className="space-y-4 px-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 5 }}
                className={`p-6 rounded-[2rem] border group hover:bg-white/10 transition-all cursor-pointer ${event.color.replace('text-', 'border-').split(' ').join(' bg-opacity-5 ')}`}
              >
                <div className="flex items-start gap-5 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${event.color} border border-white/5 group-hover:rotate-6 transition-transform flex-shrink-0`}>
                    <event.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg tracking-tight">{event.label}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{hijriData?.hijriMonthEn} {event.date}, {hijriData?.hijriYear} AH</p>
                      </div>
                      <ChevronRight size={18} className="text-white/20 group-hover:text-gold-400 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Description & Sunnah Info */}
                <div className="space-y-3 ml-0">
                  <p className="text-sm text-white/70 leading-relaxed">{event.description}</p>
                  
                  {/* Sunnah Tip */}
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] font-bold text-gold-400 mb-1 uppercase tracking-wider">💡 Sunnah Tip</p>
                    <p className="text-xs text-white/60">{event.sunnah_tip}</p>
                  </div>

                  {/* Reward */}
                  {event.reward && (
                    <div className="flex items-center gap-2 text-xs pt-2">
                      <span className="text-lg">{event.reward.split(' ')[0]}</span>
                      <span className="text-white/70">{event.reward.substring(2)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-white/40">
              <p className="text-sm">No upcoming events this month</p>
            </div>
          )}
        </div>
      </section>

      {/* Ramadan Jumu'ah Info */}
      {hijriData?.isRamadan && (
        <section className="bg-gradient-to-br from-gold-500/10 via-islamic-green-900/40 to-islamic-green-950/40 rounded-[2.5rem] p-10 border border-gold-500/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-500/20 rounded-2xl flex items-center justify-center text-gold-400">
                <Moon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl tracking-tight">🌙 Ramadan Kareem</h3>
                <p className="accent-font text-gold-400/70 text-sm">The blessed month of fasting</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              May this Ramadan bring you closer to Allah's mercy. Observe the fast, recite the Quran, and spread kindness. 
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
            <Moon size={200} strokeWidth={1} />
          </div>
        </section>
      )}
    </div>
  );
};
