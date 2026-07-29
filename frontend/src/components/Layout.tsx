import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Settings, 
  Moon, 
  Sun,
  Sparkles,
  Calendar,
  Compass,
  UserCircle2
} from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRamadanMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isRamadanMode }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'quran', icon: BookOpen, label: 'Quran' },
    { id: 'azkar', icon: Heart, label: 'Azkar' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'prayer', icon: Compass, label: 'Prayer' },
    { id: 'chat', icon: MessageSquare, label: 'Assistant' },
    { id: 'profile', icon: UserCircle2, label: 'Profile' },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-islamic-green-950 text-white' : 'light-sky-gradient text-islamic-green-950'}`}>
      {/* Dynamic Background */}
      {isDarkMode ? (
        <>
          <div className={`fixed inset-0 transition-colors duration-1000 ${isRamadanMode ? 'bg-linear-to-b from-[#0F3D2E] to-[#071A13]' : 'bg-islamic-green-950'}`} />
          <div className="stars-layer">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="star" 
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`, 
                  width: `${Math.random() * 3}px`, 
                  height: `${Math.random() * 3}px`,
                  '--duration': `${2 + Math.random() * 4}s` 
                } as React.CSSProperties} 
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="fixed inset-0 light-sky-gradient pointer-events-none" />
          <div className="fixed inset-0 light-pattern pointer-events-none opacity-80" />
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.035]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8860b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}

      {/* Mosque Silhouette Overlay */}
      <div
        className={`mosque-silhouette transition-opacity duration-1000 ${
          isDarkMode ? (isRamadanMode ? 'opacity-10' : 'opacity-05') : 'opacity-[0.03]'
        }`}
      />

      {/* Header */}
      <header
        className={`sticky top-0 z-50 px-3 sm:px-6 lg:px-10 py-3 sm:py-4 flex items-center justify-between backdrop-blur-xl border-b ${
          isDarkMode
            ? 'bg-islamic-green-950/40 border-white/5'
            : 'bg-white/75 border-amber-200/50 shadow-sm shadow-amber-900/[0.04]'
        }`}
      >
        <div className="flex items-center gap-3" onClick={() => setActiveTab('home')}>
          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full border shadow-sm cursor-pointer transition-colors ${
              isDarkMode
                ? 'bg-islamic-green-900 border-gold-500/40'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M22.5 7.5A9.5 9.5 0 1 0 22.5 24A8 8 0 1 1 22.5 7.5Z" fill="#D4A017" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className={`text-2xl font-bold leading-none tracking-tight ${isDarkMode ? 'text-gold-400' : 'text-amber-700'}`}>
              Imanify
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-2.5 rounded-2xl transition-all border ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80'
                : 'bg-islamic-green-50 hover:bg-islamic-green-100 border-islamic-green-900/15 text-islamic-green-800'
            } ${activeTab === 'settings' ? (isDarkMode ? 'text-gold-400' : 'text-amber-700') : ''}`}
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl transition-all border ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200/70 text-amber-800 shadow-sm'
            }`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} className="text-gold-400" /> : <Moon size={20} className="text-amber-700" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 pb-app-nav overflow-x-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-6 min-w-0 flex-1 flex flex-col ${activeTab === 'chat' ? 'min-h-0' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mosque Silhouette (Subtle) - Removed old SVG in favor of CSS class */}

      {/* Floating Chatbot Button — hidden on chat tab */}
      {activeTab !== 'chat' && (
      <motion.button
        onClick={() => setActiveTab('chat')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-fab right-3 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl border-4 group overflow-hidden glow-on-click ${
          isDarkMode
            ? 'bg-gold-500 shadow-gold-500/40 border-islamic-green-950'
            : 'bg-amber-400 shadow-amber-500/35 border-white'
        }`}
      >
        <div
          className={`absolute inset-0 transition-colors ${
            isDarkMode
              ? 'bg-islamic-green-950/10 group-hover:bg-islamic-green-950/0'
              : 'bg-amber-700/10 group-hover:bg-amber-700/0'
          }`}
        />
        <div className="relative flex items-center justify-center">
          <MessageSquare
            size={28}
            className={isDarkMode ? 'text-islamic-green-950' : 'text-amber-900'}
            fill="currentColor"
          />
          <Sparkles
            size={14}
            className={`absolute -top-1 -right-1 animate-pulse ${isDarkMode ? 'text-islamic-green-950' : 'text-amber-900'}`}
          />
        </div>
      </motion.button>
      )}

      {/* PWA Install Button */}
      <PWAInstallButton />

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 z-50 backdrop-blur-2xl border rounded-3xl sm:rounded-[2.5rem] px-1 sm:px-3 py-2 sm:py-2.5 shadow-2xl safe-area-bottom ${
          isDarkMode
            ? 'bg-islamic-green-900/80 border-white/10'
            : 'bg-white/90 border-amber-200/60 shadow-amber-900/10 light-card-shine'
        }`}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-0.5 sm:gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all relative flex-1 min-w-0 py-0.5 ${
                  isActive
                    ? (isDarkMode ? 'text-gold-500' : 'text-amber-700')
                    : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-islamic-green-800/50 hover:text-islamic-green-900')
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className={`absolute -top-0.5 w-1 h-1 rounded-full ${isDarkMode ? 'bg-gold-500' : 'bg-amber-600'}`}
                  />
                )}
                <div
                  className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl sm:rounded-2xl transition-all ${
                    isActive
                      ? (isDarkMode ? 'bg-gold-500/10 scale-110' : 'bg-amber-100 scale-110 shadow-sm')
                      : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="hidden min-[420px]:block text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] truncate max-w-full px-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
