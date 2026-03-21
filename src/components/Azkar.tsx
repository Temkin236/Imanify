import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sunrise, Moon, Heart, Sparkles, RotateCcw, Shield, Home as HomeIcon, TrendingUp, Volume2, CheckCircle2 } from 'lucide-react';
import { AZKAR } from '../constants';
import { AzkarItem } from '../types';

interface AzkarProps {
  isRamadanMode: boolean;
}

export const Azkar: React.FC<AzkarProps> = ({ isRamadanMode }) => {
  const [activeCategory, setActiveCategory] = useState<AzkarItem['category']>('morning');
  const [counts, setCounts] = useState<Record<number, number>>({});

  const allCategories = [
    { id: 'morning', icon: Sunrise, label: 'Morning' },
    { id: 'evening', icon: Moon, label: 'Evening' },
    { id: 'after_prayer', icon: Heart, label: 'After Prayer' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'ramadan', icon: Sparkles, label: 'Ramadan' },
    { id: 'daily', icon: HomeIcon, label: 'Daily Life' },
    { id: 'protection', icon: Shield, label: 'Protection' },
  ];

  const categories = allCategories.filter(c => c.id !== 'ramadan' || isRamadanMode);

  const filteredAzkar = AZKAR.filter(a => a.category === activeCategory);

  const increment = (id: number, max: number) => {
    setCounts(prev => {
      const current = prev[id] || 0;
      if (current >= max) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const reset = (id: number) => {
    setCounts(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="space-y-8">
      {/* Azkar Stats */}
      <section className="grid grid-cols-1 gap-5">
        <div className="bg-gradient-to-br from-islamic-green-800/40 to-islamic-green-900/40 rounded-[2.8rem] p-8 border border-white/5 flex items-center justify-between group transition-all hover:bg-islamic-green-800/60 shadow-xl card-variation-1">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gold-500/20 rounded-[1.8rem] flex items-center justify-center text-gold-400 group-hover:rotate-6 transition-transform">
              <TrendingUp size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-xl tracking-tight">Your Consistency</h3>
              <p className="accent-font text-gold-400/60 text-lg">You stayed consistent this week. That matters 💚</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">7 Day Streak</span>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < 5 ? 'bg-gold-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-[2.5rem] p-7 border border-white/5 flex flex-col items-center gap-3 card-variation-2">
            <div className="relative w-16 h-16 flex items-center justify-center">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                 <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={176} strokeDashoffset={176 - (176 * 12) / 30} className="text-gold-500" strokeLinecap="round" />
               </svg>
               <span className="text-sm font-black">12/30</span>
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Daily Progress</span>
          </div>
          <div className="bg-white/5 rounded-[2.5rem] p-7 border border-white/5 flex flex-col items-center gap-3 card-variation-1">
            <div className="w-16 h-16 bg-gold-500/10 rounded-[1.8rem] flex items-center justify-center text-gold-400 shadow-inner">
               <Heart size={28} className="animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Moments of Peace</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.8rem] whitespace-nowrap transition-all border ${isActive ? 'bg-gold-500 text-islamic-green-950 border-gold-500 shadow-lg shadow-gold-500/20' : 'bg-white/5 border-white/5 text-white/40'}`}
            >
              <Icon size={20} />
              <span className="text-sm font-bold">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Azkar List */}
      <div className="space-y-5">
        {filteredAzkar.length > 0 ? (
          filteredAzkar.map((item) => {
            const currentCount = counts[item.id] || 0;
            const isDone = currentCount >= item.count;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-[2.8rem] border transition-all relative overflow-hidden group ${isDone ? 'bg-gold-500/10 border-gold-500/30 shadow-2xl shadow-gold-500/5' : 'bg-white/5 border-white/5'} ${item.id % 2 === 0 ? 'card-variation-1' : 'card-variation-2'}`}
              >
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-left">
                      <h4 className="text-gold-400 font-black text-[10px] uppercase tracking-[0.3em]">{item.title_en}</h4>
                      <p className="amharic-text text-[10px] text-white/30 mt-1 font-bold">{item.title_am}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-3 text-white/20 hover:text-gold-400 transition-colors bg-white/5 rounded-xl"><Volume2 size={18} /></button>
                      {item.reference && (
                        <span className="text-[9px] text-white/20 italic font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{item.reference}</span>
                      )}
                    </div>
                  </div>

                  <p className="arabic-text text-4xl text-right leading-[2.2] text-white/95 drop-shadow-sm">{item.arabic}</p>
                  
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <p className="text-base text-white/70 leading-relaxed font-medium tracking-tight">{item.english}</p>
                    <p className="amharic-text text-base text-gold-400/40 leading-relaxed">{item.amharic}</p>
                  </div>

                  {isDone && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gold-500/20 border border-gold-500/30 rounded-2xl p-4 text-center"
                    >
                      <p className="accent-font text-gold-400 text-lg">Your heart is remembering Allah today 🤲</p>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-8">
                    <button 
                      onClick={() => reset(item.id)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/20 hover:text-rose-400 transition-all border border-white/5"
                    >
                      <RotateCcw size={20} />
                    </button>
                    
                    <button
                      onClick={() => increment(item.id, item.count)}
                      disabled={isDone}
                      className={`relative w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl ${isDone ? 'bg-gold-500 text-islamic-green-950 scale-105' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black">{currentCount}</span>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">/ {item.count}</span>
                      </div>
                      {!isDone && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={264} strokeDashoffset={264 - (264 * currentCount) / item.count} className="text-gold-500 transition-all duration-500 ease-out" strokeLinecap="round" />
                        </svg>
                      )}
                      {isDone && <CheckCircle2 size={28} className="absolute -top-3 -right-3 bg-islamic-green-950 rounded-full p-1 shadow-xl" />}
                    </button>
                  </div>
                </div>
                
                {/* Subtle Background Pattern */}
                <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none rotate-12">
                  <Heart size={160} strokeWidth={1} />
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 space-y-6 bg-white/5 rounded-[2.5rem] border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/5">
              <Sparkles size={40} className="text-white/10" />
            </div>
            <div className="space-y-2">
              <p className="text-white/40 font-bold uppercase tracking-widest">No Azkar Yet</p>
              <p className="text-xs text-white/20">Check back later for more spiritual content.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
