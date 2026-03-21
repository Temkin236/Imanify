import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Star, Sparkles } from 'lucide-react';

export const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const hijriDate = {
    day: 21,
    month: 'Ramadan',
    year: 1447,
    label: '21 Ramadan 1447 AH'
  };

  const events = [
    { date: 27, label: 'Laylatul Qadr', icon: Sparkles, color: 'text-indigo-400 bg-indigo-500/10' },
    { date: 1, label: 'Eid al-Fitr', icon: Moon, color: 'text-gold-400 bg-gold-500/10' },
    { date: 10, label: 'Jumu\'ah', icon: Star, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="px-2 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Calendar</h2>
          <p className="accent-font text-gold-400 text-xl">{hijriDate.label}</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <CalendarIcon size={16} className="text-gold-400" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">March 2026</span>
        </div>
      </header>

      <section className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 space-y-8">
        <div className="flex items-center justify-between px-2">
          <button className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h3 className="font-bold text-xl tracking-tight">Ramadan</h3>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">1447 AH</p>
          </div>
          <button className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <span key={i} className="text-[10px] font-black text-white/20 uppercase tracking-widest">{day}</span>
          ))}
          {[...Array(30)].map((_, i) => {
            const day = i + 1;
            const isToday = day === 21;
            const event = events.find(e => e.date === day);
            
            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border ${isToday ? 'bg-gold-500 text-islamic-green-950 border-gold-500 shadow-lg shadow-gold-500/20' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
              >
                <span className="text-sm font-bold">{day}</span>
                {event && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${event.color} border border-white/10 shadow-lg`}>
                    <event.icon size={8} />
                  </div>
                )}
                {isToday && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-islamic-green-950 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between px-4">
          <h3 className="font-black text-2xl tracking-tight">Upcoming Events</h3>
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Islamic Calendar</span>
        </div>
        <div className="space-y-4 px-2">
          {events.map((event, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${event.color} border border-white/5 group-hover:rotate-6 transition-transform`}>
                  <event.icon size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg tracking-tight">{event.label}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ramadan {event.date}, 1447 AH</p>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-gold-400 transition-colors">
                <ChevronRight size={18} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-islamic-green-900/40 rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl tracking-tight">Jumu'ah Mubarak</h3>
              <p className="accent-font text-emerald-400/60 text-lg">Next Friday: Ramadan 24</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">"The best day on which the sun has risen is Friday; on it Adam was created, on it he was expelled (from Paradise), on it his repentance was accepted, on it he died, and on it the Last Hour will take place."</p>
          <button className="w-full py-4 bg-white/5 text-white/60 font-bold rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
            Set Jumu'ah Reminder
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
          <Star size={200} strokeWidth={1} />
        </div>
      </section>
    </div>
  );
};
