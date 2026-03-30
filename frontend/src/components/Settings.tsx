import React from 'react';
import { motion } from 'motion/react';
import { Moon, Bell, Globe, Shield, LogOut, ChevronRight, Sparkles } from 'lucide-react';

interface SettingsProps {
  isRamadanMode: boolean;
  setIsRamadanMode: (val: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isRamadanMode, setIsRamadanMode }) => {
  return (
    <div className="space-y-8 pb-20">
      <header className="px-2">
        <h2 className="text-4xl font-bold tracking-tight">Settings</h2>
        <p className="accent-font text-gold-400 text-xl">Personalize your journey</p>
      </header>

      <section className="space-y-4">
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-400">
                <Moon size={24} fill={isRamadanMode ? "currentColor" : "none"} />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Ramadan Mode</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Immersive experience</p>
              </div>
            </div>
            <button 
              onClick={() => setIsRamadanMode(!isRamadanMode)}
              className={`w-14 h-8 rounded-full transition-all relative ${isRamadanMode ? 'bg-gold-500' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: isRamadanMode ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {[
            { icon: Bell, label: 'Notifications', sub: 'Prayer times & Azkar' },
            { icon: Globe, label: 'Language', sub: 'English, Amharic, Arabic' },
            { icon: Shield, label: 'Privacy', sub: 'Data & Security' },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <button className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-gold-400 transition-colors">
                    <item.icon size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg tracking-tight">{item.label}</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-white/20 group-hover:text-gold-400 transition-colors" />
              </button>
              {i < 2 && <div className="h-px bg-white/5 w-full" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="bg-gold-500/5 rounded-[2.5rem] p-8 border border-gold-500/10 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Imanify Premium</h3>
          <p className="text-sm text-white/60 leading-relaxed">Unlock advanced analytics, high-quality recitations, and more.</p>
          <button className="w-full py-4 bg-gold-500 text-islamic-green-950 font-bold rounded-2xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
            Upgrade Now
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
          <Moon size={200} strokeWidth={1} />
        </div>
      </section>

      <button className="w-full flex items-center justify-center gap-3 py-6 text-rose-400/60 hover:text-rose-400 transition-colors font-bold text-sm uppercase tracking-widest">
        <LogOut size={20} />
        Sign Out
      </button>

      <div className="text-center space-y-2">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Imanify v1.0.0</p>
        <p className="accent-font text-gold-500/20 text-sm">Made with love for the Ummah 🤲</p>
      </div>
    </div>
  );
};
