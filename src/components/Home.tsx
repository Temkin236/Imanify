import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  Heart,
  MapPin,
  Moon,
  RefreshCw,
  Sparkles,
  Sunset,
  Timer,
  TrendingUp,
  Volume2,
  CloudSun,
} from 'lucide-react';
import { getHomeSnapshot, HomeSnapshot } from '../services/homeService';
import { TimeUntil } from '../services/prayerService';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  isRamadanMode: boolean;
}

const DEFAULT_COUNTDOWN: TimeUntil = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  formatted: '00:00:00',
};

function getGreeting(): { text: string; sub: string } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return { text: 'Good Morning', sub: 'Start your day with dhikr and clear intention.' };
  }
  if (hour >= 12 && hour < 18) {
    return { text: 'Assalamu Alaikum', sub: 'Pause, breathe, and renew your niyyah.' };
  }
  return { text: 'Good Evening', sub: 'Close the day with gratitude and dua.' };
}

function getTimeUntil(targetHHMM: string): TimeUntil {
  const now = new Date();
  const [hour, minute] = targetHHMM.split(':').map(Number);
  const target = new Date();
  target.setHours(hour || 0, minute || 0, 0, 0);

  let diff = target.getTime() - now.getTime();
  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, isRamadanMode }) => {
  const [snapshot, setSnapshot] = useState<HomeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFasted, setIsFasted] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [countdown, setCountdown] = useState<TimeUntil>(DEFAULT_COUNTDOWN);

  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHomeSnapshot('Addis Ababa', 'Ethiopia');
        setSnapshot(data);
      } catch {
        setError('Unable to load live data right now. Showing best available state.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const refresh = setInterval(fetchData, 15 * 60 * 1000);

    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    if (!snapshot?.prayerData) return;

    const targetTime = isRamadanMode ? snapshot.prayerData.maghrib : snapshot.prayerData.nextPrayer.time;

    const tick = () => setCountdown(getTimeUntil(targetTime));
    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [snapshot, isRamadanMode]);

  const hijriLabel = snapshot
    ? `${snapshot.hijri.hijriDay} ${snapshot.hijri.hijriMonthEn} ${snapshot.hijri.hijriYear}`
    : 'Loading Hijri date...';

  const nextPrayerName = snapshot?.prayerData.nextPrayer.name || 'Next prayer';
  const nextPrayerTime = snapshot?.prayerData.nextPrayer.time || '--:--';

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 sm:px-2 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">{greeting.text}</h2>
          <p className="text-gold-400 text-sm md:text-base font-medium tracking-wide">{greeting.sub}</p>
        </motion.div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-gold-500/20 bg-gold-500/10 text-gold-400">
            <Moon size={14} fill="currentColor" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em]">{hijriLabel}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Season</span>
            <span className="text-xs font-bold text-emerald-300">{snapshot?.weather.season || '...'}</span>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <section className="px-0 sm:px-2">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('quran')}
          className="w-full bg-islamic-green-900/40 border border-white/10 p-5 rounded-4xl flex items-center justify-between group hover:bg-islamic-green-800/40 transition-all shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Continue Reading</p>
              <h3 className="font-bold text-base tracking-tight">
                Surah {snapshot?.dailyAyah.surahName || '...'}, Ayah {snapshot?.dailyAyah.ayahNumber || '--'}
              </h3>
              <p className="text-gold-400/60 text-sm">Based on today&apos;s live Quran feed</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/30 group-hover:text-gold-400 transition-colors" />
        </motion.button>
      </section>

      <section>
        <button
          onClick={() => setShowReturnModal(true)}
          className="w-full group relative overflow-hidden bg-linear-to-r from-islamic-green-800/40 to-islamic-green-900/40 p-4 sm:p-6 rounded-4xl sm:rounded-[2.5rem] border border-white/10 flex items-center justify-between transition-all hover:bg-islamic-green-800/60"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 group-hover:rotate-12 transition-transform">
              <RefreshCw size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg tracking-tight">{snapshot?.reminder.title || 'Return to Allah'}</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                {snapshot?.reminder.action || 'A moment of peace and dua'}
              </p>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-white/40 group-hover:text-gold-400 group-hover:translate-x-1 transition-all">
            <ArrowRight size={20} />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gold-500/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
        </button>
      </section>

      <section className="bg-linear-to-br from-islamic-green-800 to-islamic-green-900 rounded-4xl sm:rounded-[2.8rem] p-5 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        {loading ? (
          <div className="text-center py-10 flex flex-col items-center gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw className="text-gold-400" size={32} />
            </motion.div>
            <p className="text-white/70 text-sm">Loading live prayer and seasonal data...</p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col gap-7">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-gold-500/20 rounded-2xl text-gold-400">
                  <Timer size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xl tracking-tight">{isRamadanMode ? 'Iftar Countdown' : `${nextPrayerName} Countdown`}</h3>
                  <p className="text-gold-400/70 text-sm truncate">{snapshot?.weather.weatherText || 'Calm weather'} in {snapshot?.weather.city || 'your city'}</p>
                </div>
              </div>

              <button
                onClick={() => setIsFasted(!isFasted)}
                className={`self-start sm:self-auto flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl border transition-all ${
                  isFasted ? 'bg-gold-500 border-gold-500 text-islamic-green-950' : 'bg-white/10 border-white/20 text-white/70'
                }`}
              >
                {isFasted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{isFasted ? 'Fasted' : 'Fast Today?'}</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 py-3">
              <motion.span key={countdown.formatted} initial={{ scale: 0.98 }} animate={{ scale: 1 }} className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/50">
                {countdown.formatted}
              </motion.span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.35em]">
                {isRamadanMode ? 'Until Maghrib' : `Until ${nextPrayerName}`}
              </span>
            </div>

            <div className="bg-black/20 rounded-2xl p-4 border border-gold-500/20">
              <p className="text-[10px] font-bold text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> Situational Hadith Reminder
              </p>
              <p className="text-white/85 text-sm italic mb-2">"{snapshot?.reminder.hadithOrAthar || 'Keep your heart connected with Allah throughout the day.'}"</p>
              <p className="text-gold-300/80 text-xs font-semibold">{snapshot?.reminder.source || 'Daily reminder'}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/10 p-4 sm:p-5 rounded-4xl border border-white/10">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
                  <Sunset size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Next Prayer Time</p>
                  <p className="font-bold text-lg">{nextPrayerName} • {nextPrayerTime}</p>
                </div>
              </div>
              <button className="self-start sm:self-auto p-4 bg-white/10 rounded-2xl text-white/50 hover:text-gold-400 transition-colors">
                <Volume2 size={24} />
              </button>
            </div>
          </div>
        )}

        <div className="absolute -top-10 -right-10 p-4 opacity-[0.04] rotate-12">
          <Moon size={240} strokeWidth={1} />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-white/5 rounded-[2.2rem] p-6 border border-white/10 flex flex-col gap-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              {snapshot ? `${snapshot.insights.completedPrayers}/${snapshot.insights.totalPrayers}` : '--/--'}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Prayer Progress</p>
            <p className="text-2xl font-bold tracking-tight">{snapshot?.insights.completedPrayers || 0} Done</p>
            <p className="text-emerald-300/70 text-sm mt-1">Live from today&apos;s prayer timeline</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10 flex flex-col gap-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-gold-500/10 rounded-xl text-gold-400">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-1 rounded-lg">{snapshot?.insights.remembranceScore || 0}%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Remembrance Score</p>
            <p className="text-2xl font-bold tracking-tight">{snapshot?.insights.remembranceScore || 0}%</p>
            <p className="text-gold-300/70 text-sm mt-1">Computed from prayer completion and day context</p>
          </div>
        </div>
      </section>

      <section className="bg-white/5 rounded-4xl sm:rounded-[2.5rem] p-5 sm:p-7 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-white/15 rounded-full animate-[spin_20s_linear_infinite]" />
            <Compass size={32} className="text-gold-400 group-hover:rotate-45 transition-transform duration-700" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={12} className="text-gold-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest truncate">
                {snapshot?.weather.city || 'Addis Ababa'}, {snapshot?.weather.country || 'ET'}
              </span>
            </div>
            <h3 className="font-bold text-lg tracking-tight truncate">{snapshot?.weather.temperatureC ?? '--'}°C • {snapshot?.weather.weatherText || 'Weather unavailable'}</h3>
            <p className="text-gold-400/70 text-sm truncate">{snapshot?.event?.label || 'No major event today'} {snapshot?.event ? `• ${snapshot.event.date} ${snapshot.hijri.hijriMonthEn}` : ''}</p>
          </div>
        </div>
        <button onClick={() => setActiveTab('calendar')} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-gold-400 hover:bg-white/15 transition-all self-start sm:self-auto">
          <Calendar size={20} />
        </button>
      </section>

      <section className="bg-islamic-green-900/50 rounded-4xl sm:rounded-[2.8rem] p-5 sm:p-8 md:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">Ayah of the Day (Live)</h3>
            <p className="text-gold-400/55 text-sm">
              Surah {snapshot?.dailyAyah.surahName || '...'}, Ayah {snapshot?.dailyAyah.ayahNumber || '--'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="arabic-text text-2xl sm:text-3xl md:text-4xl leading-loose text-right text-white/95 wrap-break-word">
            {snapshot?.dailyAyah.arabic || '...'}
          </p>

          <div className="space-y-3 pt-5 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-bold">English Translation</p>
            <p className="text-lg italic text-white/85 leading-relaxed">{snapshot?.dailyAyah.english || 'Loading translation...'}</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-gold-300/70 font-bold pt-2">Amharic Translation</p>
            <p className="amharic-text text-base text-gold-300/90 leading-relaxed">{snapshot?.dailyAyah.amharic || 'እባክዎን ይጠብቁ...'}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="font-black text-xl sm:text-2xl tracking-tight">How is your heart?</h3>
            <p className="text-gold-400/70 text-sm">Choose a mood and get a relevant Islamic response.</p>
          </div>
          <CloudSun size={20} className="text-gold-400/60" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Anxious', icon: '😟', prompt: 'I feel anxious, suggest a dua for calmness based on my current day.' },
            { label: 'Grateful', icon: '🤲', prompt: 'I feel grateful, give me a short shukr dua and one ayah to reflect on.' },
            { label: 'Sad', icon: '😔', prompt: 'I feel sad, give me a comforting hadith and practical reminder.' },
            { label: 'Focused', icon: '🎯', prompt: 'Help me stay focused on prayer and Quran today with a realistic plan.' },
          ].map((mood) => (
            <button
              key={mood.label}
              onClick={() => {
                localStorage.setItem('imanify_chat_prefill', mood.prompt);
                setActiveTab('chat');
              }}
              className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-white/5 border border-white/10 rounded-4xl hover:bg-white/10 transition-all hover:border-gold-500/30"
            >
              <span className="text-2xl sm:text-3xl">{mood.icon}</span>
              <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReturnModal(false)}
              className="absolute inset-0 bg-islamic-green-950/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-islamic-green-900 w-full max-w-md rounded-[2.4rem] p-8 border border-white/10 relative z-10 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-400 mx-auto">
                <Heart size={34} fill="currentColor" className="opacity-30" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">{snapshot?.reminder.title || 'Breathe. Reconnect.'}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{snapshot?.reminder.message || 'Allah is always near. Return with sincerity.'}</p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-gold-300 text-base leading-relaxed italic">"{snapshot?.reminder.hadithOrAthar || 'Remember Allah often and your heart will find peace.'}"</p>
                <p className="text-xs text-white/50">{snapshot?.reminder.source || 'Daily reminder'}</p>
              </div>

              <button
                onClick={() => setShowReturnModal(false)}
                className="w-full py-3.5 bg-gold-500 text-islamic-green-950 font-bold rounded-2xl hover:bg-gold-400 transition-colors"
              >
                Alhamdulillah
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
