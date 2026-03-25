import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sunrise, 
  Sun, 
  CloudSun, 
  Sunset, 
  Moon, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  Calendar,
  ChevronRight,
  Timer,
  CheckCircle2,
  Circle,
  TrendingUp,
  Volume2,
  Sparkles,
  Compass,
  MapPin,
  RefreshCw,
  ArrowRight,
  Zap,
  AlertCircle
} from 'lucide-react';
import { PRAYER_TIMES } from '../constants';
import { getTodayPrayerTimes, PrayerData, TimeUntil } from '../services/prayerService';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  isRamadanMode: boolean;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, isRamadanMode }) => {
  const [isFasted, setIsFasted] = useState(false);
  const [timeUntilPrayer, setTimeUntilPrayer] = useState<TimeUntil>({
    hours: 2,
    minutes: 45,
    seconds: 12,
    formatted: '02:45:12',
  });
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState({ text: 'Assalamu Alaikum', sub: 'Your Daily Deen Companion 🌙' });
  const [showReturnModal, setShowReturnModal] = useState(false);

  // Fetch prayer times on mount
  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTodayPrayerTimes('Addis Ababa', 'Ethiopia');
        setPrayerData(data);
        
        // Check if data is fallback (error occurred but handled gracefully)
        if (data.nextPrayer.reward === '⚠️') {
          setError('Prayer times unavailable - using default times');
        }
      } catch (err) {
        console.error('Unexpected error fetching prayer times:', err);
        setError('Unable to load prayer times');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, []);

  // Update countdown timer every second (only if Ramadan)
  useEffect(() => {
    if (!isRamadanMode) return;

    const interval = setInterval(() => {
      if (prayerData) {
        const now = new Date();
        const [maghribHour, maghribMin] = prayerData.maghrib.split(':').map(Number);
        const maghribTime = new Date();
        maghribTime.setHours(maghribHour, maghribMin, 0);

        let diff = maghribTime.getTime() - now.getTime();
        if (diff < 0) {
          diff += 24 * 60 * 60 * 1000; // Next day
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeUntilPrayer({
          hours,
          minutes,
          seconds,
          formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData, isRamadanMode]);

  // Update greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: 'Good Morning', sub: 'Start your day with remembrance 🌅' });
    } else if (hour >= 12 && hour < 18) {
      setGreeting({ text: 'Assalamu Alaikum', sub: 'May your afternoon be blessed 🤲' });
    } else {
      setGreeting({ text: 'Good Evening', sub: 'End your day in peace 🌙' });
    }
  }, []);

  const prayerIcons: Record<string, any> = {
    Sunrise, Sun, CloudSun, Sunset, Moon
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Greeting & Ramadan Status */}
      <section className="flex justify-between items-start px-2 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h2 className="text-5xl font-bold tracking-tighter leading-tight drop-shadow-2xl">{greeting.text}</h2>
          <p className="text-gold-400 text-sm font-medium tracking-widest accent-font text-2xl opacity-90">{greeting.sub}</p>
        </motion.div>
        <div className="flex flex-col items-end gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-all duration-1000 ${isRamadanMode ? 'bg-gold-500/10 border-gold-500/20 text-gold-400 shadow-gold-500/5' : 'bg-white/5 border-white/5 text-white/40 shadow-white/5'}`}
          >
            <Moon size={16} className={isRamadanMode ? 'text-gold-400' : 'text-white/40'} fill={isRamadanMode ? 'currentColor' : 'none'} />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{isRamadanMode ? 'Day 12 Ramadan' : '21 Ramadan 1447'}</span>
          </motion.div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Streak 🔥</span>
            <span className="text-xs font-black text-gold-500">7 Days</span>
          </div>
        </div>
      </section>

      {/* Continue Reading (Smart Feature) */}
      <section className="px-2">
        <motion.button 
          whileHover={{ y: -2 }}
          onClick={() => setActiveTab('quran')}
          className="w-full bg-islamic-green-900/40 border border-white/5 p-5 rounded-[2rem] flex items-center justify-between group hover:bg-islamic-green-800/40 transition-all shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400 group-hover:rotate-6 transition-transform">
              <BookOpen size={24} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">Continue Reading</p>
              <h3 className="font-bold text-base tracking-tight">Surah Al-Kahf, Ayah 45</h3>
              <p className="accent-font text-gold-400/50 text-sm">You stopped here yesterday 📖</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/20 group-hover:text-gold-400 transition-colors" />
        </motion.button>
      </section>

      {/* Return to Allah - Emotional Anchor */}
      <section>
        <button 
          onClick={() => setShowReturnModal(true)}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-islamic-green-800/40 to-islamic-green-900/40 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between transition-all hover:bg-islamic-green-800/60"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 group-hover:rotate-12 transition-transform">
              <RefreshCw size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg tracking-tight">Return to Allah</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">A moment of peace & dua</p>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl text-white/20 group-hover:text-gold-400 group-hover:translate-x-1 transition-all">
            <ArrowRight size={20} />
          </div>
          
          {/* Animated Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold-500/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
        </button>
      </section>

      {/* Iftar Timer Card (Ramadan Special) - Only show if Ramadan Mode is ON */}
      {isRamadanMode && (
        <section className="bg-gradient-to-br from-islamic-green-800 to-islamic-green-900 rounded-[2.8rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden group card-variation-1">
          <div className="relative z-10 flex flex-col gap-8">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="text-gold-400" size={32} />
                </motion.div>
                <p className="text-white/60 text-sm">Loading prayer times...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-6">
                <AlertCircle className="text-red-400 mx-auto mb-2" size={24} />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Success State - Display Prayer Data */}
            {!loading && prayerData && (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gold-500/20 rounded-2xl text-gold-400">
                      <Timer size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl tracking-tight">Iftar Countdown</h3>
                      <p className="accent-font text-gold-400/60 text-sm">Another chance to grow closer tonight ✨</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsFasted(!isFasted)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all shadow-lg ${isFasted ? 'bg-gold-500 border-gold-500 text-islamic-green-950' : 'bg-white/5 border-white/10 text-white/60'}`}
                  >
                    {isFasted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{isFasted ? 'Fasted' : 'Fast Today?'}</span>
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2 py-4">
                  <motion.span 
                    key={timeUntilPrayer.formatted}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40"
                  >
                    {timeUntilPrayer.formatted}
                  </motion.span>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Until Maghrib</span>
                </div>

                {/* Sunnah Quote Section */}
                {prayerData.nextPrayer && (
                  <div className="bg-black/20 rounded-lg p-4 border border-gold-500/20">
                    <p className="text-[10px] font-bold text-gold-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} /> Sunnah Reminder
                    </p>
                    <p className="text-white/80 text-sm italic mb-2">"{prayerData.nextPrayer.sunnahQuote}"</p>
                    <p className="text-gold-400/70 text-xs font-semibold">{prayerData.nextPrayer.reward}</p>
                  </div>
                )}

                <div className="flex justify-between items-center bg-white/5 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
                      <Sunset size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Maghrib Today (Iftar)</p>
                      <p className="font-bold text-lg">{prayerData.maghrib}</p>
                    </div>
                  </div>
                  <button className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-gold-400 transition-colors">
                    <Volume2 size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Subtle Background Pattern */}
          <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
            <Moon size={240} strokeWidth={1} />
          </div>
        </section>
      )}

      {/* Spiritual Analytics (Mini) */}
      <section className="grid grid-cols-2 gap-5">
        <div className="bg-white/5 rounded-[2.2rem] p-6 border border-white/5 flex flex-col gap-4 card-variation-2 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Your Quran journey</p>
            <p className="text-2xl font-bold tracking-tight">5 Days <span className="text-xs text-white/40 font-normal">🔥</span></p>
            <p className="accent-font text-emerald-400/60 text-sm mt-1">You stayed consistent. That matters 💚</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 flex flex-col gap-4 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-gold-500/10 rounded-xl text-gold-400">
              <Heart size={20} />
            </div>
            <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-1 rounded-lg">98%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Remembrance</p>
            <p className="text-2xl font-bold tracking-tight">12/12 <span className="text-xs text-white/40 font-normal">🤲</span></p>
            <p className="accent-font text-gold-400/60 text-sm mt-1">Your heart is remembering Allah today</p>
          </div>
        </div>
      </section>

      {/* Qibla & Prayer Awareness */}
      <section className="bg-white/5 rounded-[2.5rem] p-7 border border-white/5 flex items-center justify-between group">
        <div className="flex items-center gap-5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
            <Compass size={32} className="text-gold-400 group-hover:rotate-45 transition-transform duration-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={12} className="text-gold-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Addis Ababa, ET</span>
            </div>
            <h3 className="font-bold text-lg tracking-tight">Next: Dhuhr in 45m</h3>
            <p className="accent-font text-gold-400/60 text-sm">A moment to pause and reconnect</p>
          </div>
        </div>
        <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 hover:text-gold-400 hover:bg-white/10 transition-all">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Daily Ayah (Enhanced) */}
      <section className="bg-islamic-green-900/50 rounded-[2.8rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">A verse for your heart today 💚</h3>
            <p className="accent-font text-gold-400/40 text-sm">Surah Al-Fatiha, Ayah 5</p>
          </div>
        </div>
        <div className="space-y-8">
          <p className="arabic-text text-4xl leading-[2.2] text-right text-white/95 drop-shadow-lg">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</p>
          <div className="space-y-4 pt-6 border-t border-white/5">
            <p className="text-lg italic text-white/80 leading-relaxed font-light">"It is You we worship and You we ask for help."</p>
            <p className="amharic-text text-base text-gold-400/70 leading-relaxed">"አንተን ብቻ እንግዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን፡፡"</p>
          </div>
        </div>
      </section>

      {/* Mood-based Dua (Human Touch) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-4">
          <div>
            <h3 className="font-black text-2xl tracking-tight">How is your heart?</h3>
            <p className="accent-font text-gold-400/60 text-base">Select your mood for guidance</p>
          </div>
          <Sparkles size={20} className="text-gold-400/40" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
          {[
            { label: 'Anxious', icon: '😟', prompt: 'I feel anxious, suggest a dua' },
            { label: 'Grateful', icon: '🤲', prompt: 'I feel grateful, suggest a dua' },
            { label: 'Sad', icon: '😔', prompt: 'I feel sad, suggest a verse' },
            { label: 'Calm', icon: '😌', prompt: 'I feel calm, suggest a reflection' }
          ].map((mood) => (
            <button
              key={mood.label}
              onClick={() => setActiveTab('chat')}
              className="flex flex-col items-center gap-4 p-7 bg-white/5 border border-white/5 rounded-[2.5rem] min-w-[120px] hover:bg-white/10 transition-all hover:border-gold-500/20 group shadow-xl"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{mood.icon}</span>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Return to Allah Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReturnModal(false)}
              className="absolute inset-0 bg-islamic-green-950/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-islamic-green-900 w-full max-w-sm rounded-[3rem] p-10 border border-white/10 relative z-10 text-center space-y-8 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
            >
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-400 mx-auto animate-pulse">
                <Heart size={40} fill="currentColor" className="opacity-20" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold tracking-tight">Breathe. Reconnect.</h3>
                <p className="text-white/60 text-sm leading-relaxed">Take a deep breath. Allah is closer to you than your jugular vein.</p>
              </div>
              <div className="space-y-6 pt-4">
                <p className="arabic-text text-2xl text-gold-400 leading-relaxed">يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ</p>
                <p className="text-xs text-white/40 italic">"O Turner of the hearts, keep my heart firm upon Your religion."</p>
              </div>
              <button 
                onClick={() => setShowReturnModal(false)}
                className="w-full py-4 bg-gold-500 text-islamic-green-950 font-bold rounded-2xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
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
