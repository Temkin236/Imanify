import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sunrise, Moon, Heart, Sparkles, RotateCcw, Shield, Home as HomeIcon,
  TrendingUp, Volume2, CheckCircle2, Search, X, BookOpen, Star, ChevronDown, ChevronUp
} from 'lucide-react';
import { AZKAR, AZKAR_CATEGORIES } from '../data/azkarData';
import { AzkarItem } from '../types';
import {
  getAzkarCounts,
  incrementAzkar,
  resetAzkar,
  resetCategory,
  getAzkarStats,
} from '../services/azkarProgressService';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface AzkarProps {
  isRamadanMode: boolean;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  morning: Sunrise,
  evening: Moon,
  after_prayer: Heart,
  sleep: Moon,
  ramadan: Sparkles,
  daily: HomeIcon,
  protection: Shield,
};

export const Azkar: React.FC<AzkarProps> = ({ isRamadanMode }) => {
  const tc = useThemeClasses();
  const [activeCategory, setActiveCategory] = useState<AzkarItem['category']>('morning');
  const [counts, setCounts] = useState<Record<number, number>>(() => getAzkarCounts());
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [justCompletedId, setJustCompletedId] = useState<number | null>(null);
  const [stats, setStats] = useState(() => getAzkarStats('morning'));

  const categories = useMemo(
    () => AZKAR_CATEGORIES.filter((c) => c.id !== 'ramadan' || isRamadanMode),
    [isRamadanMode]
  );

  const refreshStats = useCallback((cat?: string) => {
    setStats(getAzkarStats(cat || activeCategory));
  }, [activeCategory]);

  useEffect(() => {
    refreshStats(activeCategory);
  }, [activeCategory, counts, refreshStats]);

  const filteredAzkar = useMemo(() => {
    let items = AZKAR.filter((a) => a.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title_en.toLowerCase().includes(q) ||
          a.english.toLowerCase().includes(q) ||
          a.amharic.includes(q) ||
          a.arabic.includes(q)
      );
    }
    return items;
  }, [activeCategory, search]);

  const catProgress = stats.categoryProgress[activeCategory];

  const handleIncrement = (id: number, max: number) => {
    const { counts: updated, justCompleted } = incrementAzkar(id, max);
    setCounts(updated);
    if (justCompleted) {
      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 2500);
    }
  };

  const handleReset = (id: number) => {
    setCounts(resetAzkar(id));
  };

  const handleResetCategory = () => {
    setCounts(resetCategory(activeCategory));
  };

  const speakArabic = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\(\d+\)/g, '').replace(/—/g, ' ');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header stats */}
      <section className="space-y-4">
        <div className={`${tc.cardSoft} rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gold-400/70 uppercase tracking-[0.25em]">Daily Dhikr</p>
              <h3 className="font-bold text-2xl tracking-tight">Your Remembrance</h3>
              <p className="text-sm text-white/50">
                {stats.todayCompleted} of {stats.todayTotal} completed today
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl ${tc.accentBadge}`}>
              <TrendingUp size={16} className="text-gold-400" />
              <span className="text-sm font-bold text-gold-400">{stats.streak} day streak</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
              <span>Today's Progress</span>
              <span className="text-gold-400">{stats.todayPercent}%</span>
            </div>
            <div className={`h-2.5 ${tc.progressTrack} rounded-full overflow-hidden`}>
              <motion.div
                className="h-full bg-gradient-to-r from-gold-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.todayPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className={`${tc.surface} rounded-2xl p-4 text-center ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
            <p className="text-2xl font-black text-gold-400">{stats.todayCompleted}</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Done Today</p>
          </div>
          <div className={`${tc.surface} rounded-2xl p-4 text-center ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
            <p className="text-2xl font-black text-emerald-400">{AZKAR.length}</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Total Azkar</p>
          </div>
          <div className={`${tc.surface} rounded-2xl p-4 text-center ${tc.isDarkMode ? '' : 'light-card-shine'}`}>
            <p className="text-2xl font-black text-blue-400">{stats.totalCompleted}</p>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">All Time</p>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search azkar by title or meaning..."
          className={`w-full ${tc.searchInput} rounded-2xl py-3.5 pl-11 pr-10 text-sm focus:outline-none transition-all`}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
          const isActive = activeCategory === cat.id;
          const prog = stats.categoryProgress[cat.id];
          const badge = prog ? `${prog.done}/${prog.total}` : '';

          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
              className={`flex flex-col items-start gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl whitespace-nowrap transition-all border min-w-[88px] sm:min-w-[110px] ${
                isActive ? tc.categoryActive : tc.categoryIdle
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <span className="text-xs font-bold">{cat.label}</span>
              </div>
              <span className={`text-[9px] font-bold ${isActive ? 'text-islamic-green-950/60' : 'text-white/25'}`}>
                {badge} • {cat.label_am}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category header + reset */}
      {catProgress && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-white/40">
            {catProgress.done}/{catProgress.total} completed in this category
          </p>
          {catProgress.done > 0 && (
            <button
              onClick={handleResetCategory}
              className="text-xs text-rose-400/70 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} /> Reset category
            </button>
          )}
        </div>
      )}

      {/* Azkar list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAzkar.length > 0 ? (
            filteredAzkar.map((item) => {
              const currentCount = counts[item.id] || 0;
              const isDone = currentCount >= item.count;
              const isExpanded = expandedId === item.id;
              const progress = Math.min(100, (currentCount / item.count) * 100);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`rounded-3xl border transition-all overflow-hidden ${tc.isDarkMode ? '' : 'light-card-shine'} ${
                    isDone
                      ? (tc.isDarkMode ? 'bg-gold-500/8 border-gold-500/25 shadow-lg shadow-gold-500/5' : 'bg-amber-50 border-amber-300/60 shadow-lg shadow-amber-500/10')
                      : tc.surfaceMuted
                  }`}
                >
                  {/* Progress bar top */}
                  <div className="h-1 bg-white/5">
                    <div
                      className={`h-full transition-all duration-500 ${isDone ? 'bg-gold-500' : 'bg-emerald-500/60'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Title row */}
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {isDone && <CheckCircle2 size={14} className="text-gold-400" />}
                          <h4 className="text-gold-400 font-bold text-xs uppercase tracking-[0.2em]">{item.title_en}</h4>
                        </div>
                        <p className="amharic-text text-[11px] text-white/35 font-medium">{item.title_am}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => speakArabic(item.arabic)}
                          title="Listen"
                          className="p-2.5 text-white/30 hover:text-gold-400 bg-white/5 hover:bg-gold-500/10 rounded-xl transition-all"
                        >
                          <Volume2 size={16} />
                        </button>
                        {item.reference && (
                          <span className="text-[9px] text-white/25 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                            {item.reference}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arabic */}
                    <p className="arabic-text text-3xl sm:text-4xl text-right leading-[2.1] text-white/95 px-2">
                      {item.arabic}
                    </p>

                    {/* Transliteration */}
                    {item.transliteration && (
                      <p className="text-sm text-gold-400/50 italic leading-relaxed px-1">
                        {item.transliteration}
                      </p>
                    )}

                    {/* Translations - expandable for long content */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <p className={`text-sm text-white/75 leading-relaxed ${!isExpanded && item.english.length > 180 ? 'line-clamp-3' : ''}`}>
                        {item.english}
                      </p>
                      <p className={`amharic-text text-sm text-gold-400/45 leading-relaxed ${!isExpanded && item.amharic.length > 120 ? 'line-clamp-2' : ''}`}>
                        {item.amharic}
                      </p>
                      {(item.english.length > 180 || item.amharic.length > 120) && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="flex items-center gap-1 text-[10px] text-white/30 hover:text-gold-400 transition-colors"
                        >
                          {isExpanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
                        </button>
                      )}
                    </div>

                    {/* Reward */}
                    {item.reward && (
                      <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                        <Star size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-300/70 leading-relaxed">{item.reward}</p>
                      </div>
                    )}

                    {/* Completion message */}
                    <AnimatePresence>
                      {(isDone || justCompletedId === item.id) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-gold-500/15 border border-gold-500/25 rounded-xl p-3 text-center"
                        >
                          <p className="text-sm text-gold-400 font-medium">
                            {justCompletedId === item.id ? '✨ MashaAllah! Completed!' : '🤲 Your heart is remembering Allah'}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Counter controls */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleReset(item.id)}
                        disabled={currentCount === 0}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/25 hover:text-rose-400 transition-all border border-white/5 disabled:opacity-30"
                        title="Reset counter"
                      >
                        <RotateCcw size={18} />
                      </button>

                      <button
                        onClick={() => handleIncrement(item.id, item.count)}
                        disabled={isDone}
                        className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                          isDone
                            ? 'bg-gold-500 text-islamic-green-950'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black">{currentCount}</span>
                          <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">/ {item.count}</span>
                        </div>
                        {!isDone && (
                          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                            <circle
                              cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="3"
                              strokeDasharray={214}
                              strokeDashoffset={214 - (214 * currentCount) / item.count}
                              className="text-gold-500 transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="w-12 text-center">
                        <p className="text-[9px] text-white/25 uppercase tracking-widest">Tap to count</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 space-y-4 bg-white/5 rounded-3xl border border-white/5">
              <Search size={36} className="text-white/10 mx-auto" />
              <p className="text-white/40 font-medium">No azkar found</p>
              <p className="text-xs text-white/20">Try a different search or category</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
