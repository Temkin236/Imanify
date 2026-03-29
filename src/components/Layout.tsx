import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  MessageSquare, 
  Heart, 
  Settings, 
  Moon, 
  Sun,
  ChevronLeft,
  Menu,
  X,
  Sparkles,
  Calendar,
  Compass
} from 'lucide-react';
import PWAInstallButton from './PWAInstallButton';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isRamadanMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isRamadanMode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const tabs = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'quran', icon: BookOpen, label: 'Quran' },
    { id: 'azkar', icon: Heart, label: 'Azkar' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'prayer', icon: Compass, label: 'Prayer' },
    { id: 'chat', icon: MessageSquare, label: 'Assistant' },
  ];

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-islamic-green-950 text-white' : 'bg-white text-islamic-green-950'}`}>
      {/* Dynamic Background */}
      {isDarkMode && (
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
                } as any} 
              />
            ))}
          </div>
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
            : 'bg-white/90 border-islamic-green-900/10 shadow-sm'
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
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-2xl transition-all border ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80'
                : 'bg-islamic-green-50 hover:bg-islamic-green-100 border-islamic-green-900/15 text-islamic-green-800'
            }`}
          >
            {isDarkMode ? <Sun size={20} className="text-gold-400" /> : <Moon size={20} className="text-amber-700" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-x-hidden relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-400 mx-auto px-3 sm:px-5 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mosque Silhouette (Subtle) - Removed old SVG in favor of CSS class */}

      {/* Floating Chatbot Button */}
      <motion.button
        onClick={() => setActiveTab('chat')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl border-4 group overflow-hidden glow-on-click ${
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

      {/* PWA Install Button */}
      <PWAInstallButton />

      {/* Bottom Navigation */}
      <nav
        className={`fixed bottom-4 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-50 backdrop-blur-2xl border rounded-4xl sm:rounded-[2.5rem] px-2 sm:px-4 py-2.5 sm:py-3 shadow-2xl ${
          isDarkMode
            ? 'bg-islamic-green-900/80 border-white/10'
            : 'bg-white/95 border-islamic-green-900/15 shadow-islamic-green-900/10'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 transition-all relative ${
                  isActive
                    ? (isDarkMode ? 'text-gold-500' : 'text-amber-700')
                    : (isDarkMode ? 'text-white/40 hover:text-white' : 'text-islamic-green-800/50 hover:text-islamic-green-900')
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className={`absolute -top-1 w-1 h-1 rounded-full ${isDarkMode ? 'bg-gold-500' : 'bg-amber-700'}`}
                  />
                )}
                <div
                  className={`p-2.5 rounded-2xl transition-all ${
                    isActive
                      ? (isDarkMode ? 'bg-gold-500/10 scale-110' : 'bg-amber-200/70 scale-110')
                      : ''
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
