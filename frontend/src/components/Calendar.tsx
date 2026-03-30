import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BookOpen, Save, Check } from 'lucide-react';
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

interface DayNote {
  date: string;
  note: string;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 25)); // March 25, 2026
  const [hijriData, setHijriData] = useState<HijriDateData | null>(null);
  const [daysData, setDaysData] = useState<Map<number, DayInfo>>(new Map());
  const [language, setLanguage] = useState<'en' | 'ar' | 'am'>('en');
  const [selectedDay, setSelectedDay] = useState<number | null>(25);
  const [dayNotes, setDayNotes] = useState<Map<string, DayNote>>(new Map());
  const [noteSaved, setNoteSaved] = useState(false);
  const [showAzkarToast, setShowAzkarToast] = useState(false);
  const [showDuaToast, setShowDuaToast] = useState(false);

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
    .slice(0, 5);

  // Get selected day info
  const selectedDayDate = selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null;
  const dayDateKey = selectedDayDate ? selectedDayDate.toISOString().split('T')[0] : '';
  const dayNote = dayNotes.get(dayDateKey) || { date: dayDateKey, note: '' };

  const handleNoteChange = (text: string) => {
    const updated = { date: dayDateKey, note: text };
    setDayNotes(prev => new Map(prev).set(dayDateKey, updated));
  };

  const getGregorianDate = (day: number) => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Save note handler
  const handleSaveNote = () => {
    if (dayNote.note.trim()) {
      // Save to localStorage
      const allNotes = JSON.parse(localStorage.getItem('calendarNotes') || '{}');
      allNotes[dayDateKey] = dayNote.note;
      localStorage.setItem('calendarNotes', JSON.stringify(allNotes));
      
      // Show success feedback
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    }
  };

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('calendarNotes') || '{}');
    const notesMap = new Map<string, DayNote>();
    Object.entries(savedNotes).forEach(([date, note]) => {
      notesMap.set(date, { date, note: note as string });
    });
    setDayNotes(notesMap);
  }, []);

  // Azkar handler
  const handleAzkar = () => {
    setShowAzkarToast(true);
    setTimeout(() => setShowAzkarToast(false), 3000);
  };

  // Dua handler
  const handleDua = () => {
    setShowDuaToast(true);
    setTimeout(() => setShowDuaToast(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <header className="px-2 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Hijri Calendar</h2>
          <p className="text-xs text-gold-400">{hijriData?.hijriDay} {hijriData?.hijriMonthEn} {hijriData?.hijriYear} AH</p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${language === 'en' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5'}`}>EN</button>
          <button onClick={() => setLanguage('ar')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${language === 'ar' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5'}`}>AR</button>
          <button onClick={() => setLanguage('am')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${language === 'am' ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5'}`}>AM</button>
        </div>
      </header>

      {/* Islamic Calendar Card */}
      <section className="px-2">
        <IslamicCalendarCard showPrayerTime={true} />
      </section>

      {/* Two-Pane Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
        {/* LEFT: Compact Calendar Grid */}
        <section className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl p-4 border border-white/5 space-y-3 h-fit">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <motion.button whileHover={{ x: -2 }} onClick={goToPrevMonth} className="p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
              <ChevronLeft size={16} />
            </motion.button>
            <div className="text-center">
              <h3 className="font-bold text-sm text-gold-400">{hijriData?.hijriMonthAr}</h3>
              <p className="text-[9px] text-white/40">{hijriData?.hijriYear} AH</p>
            </div>
            <motion.button whileHover={{ x: 2 }} onClick={goToNextMonth} className="p-2 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10">
              <ChevronRight size={16} />
            </motion.button>
          </div>

          {/* Day abbreviations */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="text-center text-xs font-bold text-gold-400 uppercase tracking-widest">
                {DAY_ABBR[language][i]}
              </div>
            ))}
          </div>

          {/* Compact Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="h-9" />;

              const today = isToday(day);
              const isSelected = selectedDay === day;
              const dayInfo = daysData.get(day);
              const friday = dayInfo?.isFriday;
              const event = events.find(e => e.date === day);

              return (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setSelectedDay(day)}
                  className={`h-9 w-9 text-sm font-bold rounded transition-all border relative flex items-center justify-center ${
                    isSelected
                      ? 'bg-gold-500 text-islamic-green-950 border-gold-400 shadow-lg'
                      : today
                        ? 'bg-gold-500/60 text-white border-gold-400/60'
                        : friday
                          ? 'bg-emerald-500/20 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {day}
                  {event && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-gold-400 rounded-full" />}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-xs text-white/40 pt-3 border-t border-white/5">
            <div>● Today</div>
            <div>◆ Friday</div>
            <div>● Event</div>
          </div>
        </section>

        {/* RIGHT: Day Details & Notes */}
        {selectedDay && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-islamic-green-900/40 to-islamic-green-950/40 rounded-2xl p-4 border border-white/5 space-y-4 h-fit"
          >
            {/* Day Header */}
            <div className="space-y-2 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-gold-400" />
                <div>
                  <p className="text-sm font-bold text-gold-400">Day Details</p>
                  <p className="text-xs text-white/60">{getGregorianDate(selectedDay)}</p>
                </div>
              </div>
            </div>

            {/* Hijri Information */}
            {daysData.get(selectedDay) && (
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Hijri Date</p>
                <p className="text-lg font-bold text-gold-400">{daysData.get(selectedDay)?.hijriDay} {daysData.get(selectedDay)?.hijriMonthAr}</p>
                {daysData.get(selectedDay)?.isFriday && <p className="text-sm text-emerald-400">🕌 Jumu'ah (Friday)</p>}
              </div>
            )}

            {/* Events for Day */}
            {events.find(e => e.date === selectedDay) && (
              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">📅 Events</p>
                {events.filter(e => e.date === selectedDay).map((event, idx) => (
                  <p key={idx} className="text-sm text-white/80">{event.label}</p>
                ))}
              </div>
            )}

            {/* Notes Section */}
            <div className="space-y-2">
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">📝 Daily Notes</p>
              <textarea
                value={dayNote.note}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Add notes for this day..."
                className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 focus:bg-white/8 resize-none"
              />
              <button 
                onClick={handleSaveNote}
                className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-islamic-green-950 py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {noteSaved ? (
                  <>
                    <Check size={16} />
                    Note Saved!
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Note
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <motion.button 
                onClick={handleAzkar}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="bg-emerald-600/40 hover:bg-emerald-600/60 text-white text-sm py-3 rounded-lg font-semibold transition-all border border-emerald-500/30 flex items-center justify-center gap-2"
              >
                📿 Azkar
              </motion.button>
              <motion.button 
                onClick={handleDua}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="bg-blue-600/40 hover:bg-blue-600/60 text-white text-sm py-3 rounded-lg font-semibold transition-all border border-blue-500/30 flex items-center justify-center gap-2"
              >
                🤲 Dua
              </motion.button>
            </div>
          </motion.section>
        )}
      </div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showAzkarToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <span>📿 Azkar section available in sidebar</span>
          </motion.div>
        )}
        {showDuaToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
          >
            <span>🤲 Recite Dua for this day</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
