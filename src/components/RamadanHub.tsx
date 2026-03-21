import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sunset, 
  Moon, 
  Star, 
  CheckCircle2, 
  Timer, 
  Volume2, 
  ChevronRight,
  Sparkles,
  Quote,
  X,
  BookOpen,
  Circle,
  Eye,
  EyeOff,
  Music,
  Heart
} from 'lucide-react';

export const RamadanHub: React.FC = () => {
  const [showIftarScreen, setShowIftarScreen] = useState(false);
  const [mode, setMode] = useState<'normal' | 'taraweeh' | 'laylatul'>('normal');

  const IftarScreen = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] sunset-gradient flex flex-col items-center justify-center p-8 text-center overflow-hidden"
    >
      {/* Sunset Glow Effect */}
      <div className="absolute inset-0 sunset-glow opacity-50" />
      
      {/* Lanterns (Subtle Decoration) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 animate-bounce duration-[3s]">
          <div className="w-1 h-20 bg-gold-500/30 mx-auto" />
          <div className="w-10 h-14 bg-gold-500 rounded-b-full rounded-t-lg border-2 border-islamic-green-950 shadow-2xl" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce duration-[4s]">
          <div className="w-1 h-32 bg-gold-500/30 mx-auto" />
          <div className="w-12 h-16 bg-gold-400 rounded-b-full rounded-t-lg border-2 border-islamic-green-950 shadow-2xl" />
        </div>
      </div>
      
      <button 
        onClick={() => setShowIftarScreen(false)}
        className="absolute top-12 right-8 p-3 bg-white/10 rounded-2xl text-white backdrop-blur-md border border-white/10 z-20"
      >
        <X size={24} />
      </button>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 relative z-10"
      >
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-48 h-48 bg-white/30 rounded-full blur-3xl absolute inset-0 -translate-x-4 -translate-y-4" 
          />
          <Sunset size={140} className="text-white relative z-10 mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white tracking-tighter">Iftar Moment</h2>
          <p className="text-white/80 font-medium accent-font text-2xl">The fast has ended. May it be accepted 🤲</p>
          <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <Music size={12} />
            <span>Soft Adhan Fading In...</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl rounded-[3.5rem] p-10 border border-white/20 space-y-8 max-w-sm shadow-2xl">
          <div className="flex items-center gap-3 justify-center text-white/60 mb-2">
            <Quote size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Dua for breaking fast</span>
          </div>
          <p className="arabic-text text-3xl text-white leading-relaxed drop-shadow-md">ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ</p>
          <div className="space-y-3">
            <p className="text-sm text-white/80 italic font-light">"The thirst has gone and the veins are quenched, and reward is confirmed, if Allah wills."</p>
            <p className="amharic-text text-xs text-white/60">"ጥማቱ ሄደ፤ የደም ስሮችም ረጠቡ፤ አላህ ከፈቀደ ምንዳውም ተረጋገጠ።"</p>
          </div>
        </div>

        <button 
          onClick={() => setShowIftarScreen(false)}
          className="px-16 py-6 bg-white text-islamic-green-950 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform active:scale-95"
        >
          Alhamdulillah
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className={`space-y-8 transition-all duration-1000 ${mode === 'taraweeh' ? 'fixed inset-0 z-[90] bg-islamic-green-950 p-8 overflow-y-auto no-scrollbar' : ''}`}>
      <AnimatePresence>
        {showIftarScreen && <IftarScreen />}
      </AnimatePresence>

      {/* Mode Selector - Hidden in Taraweeh Mode */}
      {mode !== 'taraweeh' && (
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-[2rem] border border-white/5">
          {[
            { id: 'normal', label: 'Standard', icon: Moon },
            { id: 'taraweeh', label: 'Taraweeh', icon: BookOpen },
            { id: 'laylatul', label: 'Laylatul Qadr', icon: Sparkles }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === m.id ? 'bg-gold-500 text-islamic-green-950 shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              <m.icon size={14} />
              {m.label}
            </button>
          ))}
        </div>
      )}

      {mode === 'taraweeh' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-12 pt-12"
        >
          <div className="flex items-center justify-between w-full max-w-2xl">
            <button onClick={() => setMode('normal')} className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
              <EyeOff size={24} />
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Taraweeh Mode</h2>
              <p className="accent-font text-gold-400 text-lg">Distraction-free focus 🕌</p>
            </div>
            <div className="w-14" />
          </div>

          <div className="w-full max-w-2xl space-y-12 pb-24">
            <div className="space-y-8 text-center">
              <p className="arabic-text text-5xl leading-[2.5] text-white/90 drop-shadow-lg">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="arabic-text text-4xl leading-[2.5] text-white/80">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</p>
              <p className="arabic-text text-4xl leading-[2.5] text-white/80">الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="arabic-text text-4xl leading-[2.5] text-white/80">مَالِكِ يَوْمِ الدِّينِ</p>
              <p className="arabic-text text-4xl leading-[2.5] text-white/80">إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</p>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="flex justify-center gap-6">
              <button className="p-6 bg-white/5 rounded-full text-white/20 hover:text-gold-400 transition-all">
                <Timer size={32} />
              </button>
              <button className="p-6 bg-white/5 rounded-full text-white/20 hover:text-gold-400 transition-all">
                <Volume2 size={32} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {mode === 'laylatul' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-900 to-islamic-green-950 rounded-[3rem] p-10 border border-indigo-500/30 text-center space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]"
        >
          {/* Floating Particles */}
          <div className="particles-container">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="particle" 
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  width: `${Math.random() * 4 + 2}px`, 
                  height: `${Math.random() * 4 + 2}px`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${Math.random() * 10 + 10}s`
                }} 
              />
            ))}
          </div>

          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-300 border border-indigo-500/30 shadow-inner">
              <Sparkles size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">Laylatul Qadr</h3>
              <p className="accent-font text-indigo-300 text-xl italic">"Search for it in the last nights..."</p>
            </div>
            <p className="text-sm text-indigo-200/60 leading-relaxed max-w-xs mx-auto">"The Night of Decree is better than a thousand months." (97:3)</p>
            
            <div className="grid grid-cols-1 gap-3 text-left pt-4">
              {[
                { label: 'Qiyam-ul-Layl', icon: Moon },
                { label: 'Special Dua', icon: Heart },
                { label: 'Quran Recitation', icon: BookOpen }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <item.icon size={18} className="text-indigo-400" />
                  <span className="text-sm font-bold text-white/80">{item.label}</span>
                  <CheckCircle2 size={16} className="ml-auto text-white/10" />
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-400 transition-colors">
              Open Laylatul Checklist
            </button>
          </div>
        </motion.div>
      )}

      {/* Ramadan Stats - Hidden in Taraweeh Mode */}
      {mode !== 'taraweeh' && (
        <section className="grid grid-cols-2 gap-5">
          <div className="bg-white/5 rounded-[2.5rem] p-7 border border-white/5 flex flex-col gap-4 relative overflow-hidden group card-variation-1">
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-gold-500/10 rounded-2xl text-gold-400">
                <Moon size={20} />
              </div>
              <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest">Day 12</span>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ramadan 1447</p>
              <p className="text-xl font-black">18 Days Left</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Moon size={100} strokeWidth={1} />
            </div>
          </div>

          <button 
            onClick={() => setShowIftarScreen(true)}
            className="bg-gradient-to-br from-sunset-orange/20 to-sunset-purple/20 rounded-[2.5rem] p-7 border border-sunset-orange/20 flex flex-col gap-4 relative overflow-hidden group text-left card-variation-2"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="p-3 bg-sunset-orange/20 rounded-2xl text-sunset-orange">
                <Sunset size={20} />
              </div>
              <span className="text-[10px] font-black text-sunset-orange uppercase tracking-widest">18:45</span>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Iftar Today</p>
              <p className="text-xl font-black text-sunset-orange">Break Fast</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sunset size={100} strokeWidth={1} />
            </div>
          </button>
        </section>
      )}

      {/* Daily Checklist - Hidden in Taraweeh Mode */}
      {mode !== 'taraweeh' && (
        <section className="bg-white/5 rounded-[2.8rem] p-8 border border-white/5 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="font-black text-2xl tracking-tight">Your Journey</h3>
              <p className="accent-font text-gold-400/60 text-base">Daily spiritual milestones</p>
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ramadan Hub</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Fasted Today', status: true },
              { label: '5 Prayers Completed', status: true },
              { label: 'Read 1 Juz of Quran', status: false },
              { label: 'Taraweeh Prayer', status: false },
              { label: 'Given Charity (Sadaqah)', status: false }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 5 }}
                className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all ${item.status ? 'bg-gold-500/10 border-gold-500/20 shadow-lg shadow-gold-500/5' : 'bg-white/5 border-white/5'}`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${item.status ? 'bg-gold-500 text-islamic-green-950' : 'bg-white/5 text-white/20'}`}>
                    {item.status ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <span className={`font-bold text-base tracking-tight ${item.status ? 'text-white' : 'text-white/40'}`}>{item.label}</span>
                </div>
                {item.status && <Star size={18} className="text-gold-400 fill-gold-400 animate-pulse" />}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Ramadan Motivation - Hidden in Taraweeh Mode */}
      {mode !== 'taraweeh' && (
        <section className="bg-islamic-green-900/40 rounded-[3rem] p-12 border border-white/5 text-center relative overflow-hidden shadow-2xl">
          <Quote size={80} className="absolute -top-6 -left-6 text-white/5" />
          <p className="text-2xl italic font-serif leading-relaxed text-white/90 relative z-10">
            "Ramadan is the month whose beginning is mercy, whose middle is forgiveness, and whose end is freedom from fire."
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 relative z-10">
            <div className="w-12 h-1 bg-gold-500/30 rounded-full" />
            <span className="text-[10px] font-black text-gold-400 uppercase tracking-[0.4em]">Prophetic Wisdom</span>
            <div className="w-12 h-1 bg-gold-500/30 rounded-full" />
          </div>
        </section>
      )}
    </div>
  );
};
