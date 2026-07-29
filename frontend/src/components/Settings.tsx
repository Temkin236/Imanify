import React from 'react';
import { motion } from 'motion/react';
import { Moon, Bell, Globe, Shield, LogOut, ChevronRight, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface SettingsProps {
  isRamadanMode: boolean;
  setIsRamadanMode: (val: boolean) => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isRamadanMode, setIsRamadanMode, onLogout }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const tc = useThemeClasses();

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <header className="px-1 sm:px-2">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Settings</h2>
        <p className={`accent-font ${tc.accent} text-xl`}>Personalize your journey</p>
      </header>

      <section className="space-y-4">
        <div className={`${tc.surface} rounded-[2.5rem] p-6 space-y-6 ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${tc.isDarkMode ? 'bg-white/5' : 'bg-amber-50'} rounded-2xl flex items-center justify-center ${tc.accent}`}>
                {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Appearance</h3>
                <p className={`text-[10px] ${tc.textSubtle} uppercase tracking-widest font-bold`}>
                  {isDarkMode ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full transition-all relative ${isDarkMode ? 'bg-gold-500' : 'bg-amber-400'}`}
              aria-label="Toggle light/dark mode"
            >
              <motion.div
                animate={{ x: isDarkMode ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          <div className={`h-px ${tc.divider} w-full`} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${tc.accentBg} rounded-2xl flex items-center justify-center`}>
                <Moon size={24} fill={isRamadanMode ? 'currentColor' : 'none'} />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">Ramadan Mode</h3>
                <p className={`text-[10px] ${tc.textSubtle} uppercase tracking-widest font-bold`}>Immersive experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsRamadanMode(!isRamadanMode)}
              className={`w-14 h-8 rounded-full transition-all relative ${isRamadanMode ? 'bg-gold-500' : tc.isDarkMode ? 'bg-white/10' : 'bg-islamic-green-900/10'}`}
            >
              <motion.div
                animate={{ x: isRamadanMode ? 24 : 4 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          <div className={`h-px ${tc.divider} w-full`} />

          {[
            { icon: Bell, label: 'Notifications', sub: 'Prayer times & Azkar' },
            { icon: Globe, label: 'Language', sub: 'English, Amharic, Arabic' },
            { icon: Shield, label: 'Privacy', sub: 'Data & Security' },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <button className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${tc.isDarkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-amber-50 group-hover:bg-amber-100'} rounded-2xl flex items-center justify-center ${tc.textSubtle} group-hover:text-amber-700 transition-colors`}>
                    <item.icon size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg tracking-tight">{item.label}</h3>
                    <p className={`text-[10px] ${tc.textSubtle} uppercase tracking-widest font-bold`}>{item.sub}</p>
                  </div>
                </div>
                <ChevronRight size={20} className={`${tc.textFaint} ${tc.isDarkMode ? 'group-hover:text-gold-400' : 'group-hover:text-amber-700'} transition-colors`} />
              </button>
              {i < 2 && <div className={`h-px ${tc.divider} w-full`} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className={`${tc.isDarkMode ? 'bg-gold-500/5 border-gold-500/10' : 'bg-amber-50/80 border-amber-200/50'} rounded-[2.5rem] p-8 border relative overflow-hidden group ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400">
            <Sparkles size={32} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Imanify Premium</h3>
          <p className={`text-sm ${tc.textMuted} leading-relaxed`}>Unlock advanced analytics, high-quality recitations, and more.</p>
          <button className="w-full py-4 bg-gold-500 text-islamic-green-950 font-bold rounded-2xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20">
            Upgrade Now
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12">
          <Moon size={200} strokeWidth={1} />
        </div>
      </section>

      <button
        onClick={onLogout}
        className={`w-full flex items-center justify-center gap-3 py-6 transition-colors font-bold text-sm uppercase tracking-widest ${tc.isDarkMode ? 'text-rose-400/60 hover:text-rose-400' : 'text-rose-500/70 hover:text-rose-600'}`}
      >
        <LogOut size={20} />
        Sign Out
      </button>

      <div className="text-center space-y-2">
        <p className={`text-[10px] ${tc.textFaint} uppercase tracking-[0.3em] font-bold`}>Imanify v1.0.0</p>
        <p className={`accent-font ${tc.isDarkMode ? 'text-gold-500/20' : 'text-amber-600/30'} text-sm`}>Made with love for the Ummah 🤲</p>
      </div>
    </div>
  );
};
