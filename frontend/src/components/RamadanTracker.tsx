import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Circle, Quote, Star } from 'lucide-react';

export const RamadanTracker: React.FC = () => {
  const [checklist, setChecklist] = useState({
    fasted: true,
    prayed: false,
    quran: true,
    taraweeh: false,
    charity: false
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progress = (completedCount / Object.keys(checklist).length) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <section className="bg-islamic-green-800 rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Ramadan 1447</h2>
            <p className="text-white/60 text-sm">Day 12 of 30</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Calendar size={24} className="text-gold-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
            <span>Overall Progress</span>
            <span className="text-gold-400">40%</span>
          </div>
          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              className="bg-gold-500 h-full rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Daily Checklist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Daily Deeds</h3>
          <span className="text-xs text-white/40 font-bold uppercase tracking-widest">{completedCount}/5 Done</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(checklist).map(([key, checked]) => (
            <button
              key={key}
              onClick={() => toggleCheck(key as any)}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${checked ? 'bg-gold-500/10 border-gold-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${checked ? 'bg-gold-500 text-islamic-green-900' : 'bg-white/5 text-white/40'}`}>
                  {checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <span className={`font-medium capitalize ${checked ? 'text-white' : 'text-white/60'}`}>
                  {key === 'quran' ? 'Read Quran' : key}
                </span>
              </div>
              {checked && <Star size={16} className="text-gold-400 fill-gold-400" />}
            </button>
          ))}
        </div>
      </section>

      {/* Motivational Quote */}
      <section className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center relative">
        <Quote size={40} className="absolute top-4 left-4 text-white/5" />
        <p className="text-lg italic font-serif leading-relaxed text-white/90">
          "The best among you are those who learn the Quran and teach it."
        </p>
        <p className="text-xs text-gold-400 font-bold uppercase tracking-widest mt-4">— Prophet Muhammad (PBUH)</p>
      </section>

      {/* Fasting Calendar Grid (Mini) */}
      <section className="space-y-4">
        <h3 className="font-semibold text-lg">Fasting Calendar</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold border ${i < 12 ? 'bg-gold-500 border-gold-500 text-islamic-green-900' : 'bg-white/5 border-white/10 text-white/20'}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
