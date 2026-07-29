import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/** Semantic Tailwind bundles — keeps light mode polished without duplicating logic everywhere. */
export function useThemeClasses() {
  const { isDarkMode } = useTheme();

  return useMemo(() => {
    if (isDarkMode) {
      return {
        isDarkMode,
        page: 'text-white',
        heading: 'text-white',
        accent: 'text-gold-400',
        accentSoft: 'text-gold-400/70',
        accentBg: 'bg-gold-500/10 border-gold-500/30 text-gold-400',
        accentBadge: 'bg-gold-500/15 border-gold-500/30 text-gold-400',
        surface: 'bg-white/5 border-white/10',
        surfaceHover: 'hover:bg-white/10',
        surfaceMuted: 'bg-white/[0.03] border-white/[0.06]',
        surfaceStrong: 'bg-islamic-green-900/40 border-white/10',
        card: 'bg-linear-to-br from-islamic-green-800 to-islamic-green-900 border-white/10',
        cardSoft: 'bg-linear-to-br from-islamic-green-800/50 to-islamic-green-950/50 border-white/10',
        hero: 'bg-linear-to-br from-islamic-green-800 to-islamic-green-900 border-white/10',
        textMuted: 'text-white/50',
        textSubtle: 'text-white/40',
        textFaint: 'text-white/30',
        textBody: 'text-white/85',
        border: 'border-white/10',
        borderSubtle: 'border-white/5',
        iconBtn: 'bg-white/5 hover:bg-white/10 border-white/5 text-white/80',
        input: 'bg-white/[0.04] border-white/10 placeholder:text-white/30 focus:border-gold-500/40 focus:bg-white/[0.06]',
        pill: 'bg-white/10 border-white/20 text-white/70',
        pillActive: 'bg-gold-500 border-gold-500 text-islamic-green-950',
        countdown: 'text-transparent bg-clip-text bg-linear-to-b from-white to-white/50',
        inset: 'bg-black/20 border-gold-500/20',
        divider: 'bg-white/5',
        navInactive: 'text-white/40 hover:text-white',
        error: 'border-red-500/30 bg-red-500/10 text-red-200',
        botAvatar: 'bg-islamic-green-900 border-white/10',
        assistantBubble: 'bg-white/[0.03] border-white/[0.06]',
        actionBtn: 'bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80',
        searchInput: 'bg-white/5 border-white/10 placeholder:text-white/30 focus:border-gold-500/40',
        progressTrack: 'bg-white/5',
        categoryActive: 'bg-gold-500 text-islamic-green-950 shadow-lg shadow-gold-500/20',
        categoryIdle: 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
      };
    }

    return {
      isDarkMode,
      page: 'text-islamic-green-950',
      heading: 'text-islamic-green-950',
      accent: 'text-amber-700',
      accentSoft: 'text-amber-600/80',
      accentBg: 'bg-amber-50 border-amber-200/80 text-amber-800',
      accentBadge: 'bg-amber-100/90 border-amber-300/70 text-amber-800',
      surface: 'bg-white border-islamic-green-900/10 shadow-md shadow-islamic-green-900/[0.04]',
      surfaceHover: 'hover:bg-amber-50/60 hover:shadow-lg hover:shadow-amber-900/[0.06]',
      surfaceMuted: 'bg-[#FFFCF7] border-islamic-green-900/8 shadow-sm',
      surfaceStrong: 'bg-white border-islamic-green-900/12 shadow-lg shadow-islamic-green-900/[0.05]',
      card: 'bg-linear-to-br from-white via-[#FFFCF7] to-amber-50/40 border-islamic-green-900/10 shadow-xl shadow-islamic-green-900/[0.06]',
      cardSoft: 'bg-linear-to-br from-amber-50/80 to-white border-amber-200/50 shadow-lg shadow-amber-900/[0.05]',
      hero: 'bg-linear-to-br from-[#FFFCF7] via-white to-amber-50/60 border-amber-200/40 shadow-xl shadow-amber-900/[0.07]',
      textMuted: 'text-islamic-green-800/65',
      textSubtle: 'text-islamic-green-700/50',
      textFaint: 'text-islamic-green-700/40',
      textBody: 'text-islamic-green-900/85',
      border: 'border-islamic-green-900/10',
      borderSubtle: 'border-islamic-green-900/6',
      iconBtn: 'bg-amber-50 hover:bg-amber-100 border-amber-200/60 text-islamic-green-800',
      input: 'bg-white border-islamic-green-900/12 placeholder:text-islamic-green-800/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 shadow-inner shadow-islamic-green-900/[0.03]',
      pill: 'bg-amber-50/80 border-amber-200/70 text-islamic-green-800/80',
      pillActive: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25',
      countdown: 'text-transparent bg-clip-text bg-linear-to-b from-islamic-green-900 to-islamic-green-700/70',
      inset: 'bg-amber-50/70 border-amber-200/50',
      divider: 'bg-islamic-green-900/8',
      navInactive: 'text-islamic-green-800/45 hover:text-islamic-green-900',
      error: 'border-red-300 bg-red-50 text-red-700',
      botAvatar: 'bg-amber-50 border-amber-200/70 shadow-sm',
      assistantBubble: 'bg-white border-islamic-green-900/10 shadow-lg shadow-islamic-green-900/[0.05]',
      actionBtn: 'bg-amber-50 hover:bg-amber-100 text-islamic-green-800/60 hover:text-islamic-green-900 border border-transparent hover:border-amber-200/60',
      searchInput: 'bg-white border-islamic-green-900/10 placeholder:text-islamic-green-800/35 focus:border-amber-400 focus:ring-2 focus:ring-amber-100',
      progressTrack: 'bg-islamic-green-900/8',
      categoryActive: 'bg-amber-500 text-white shadow-lg shadow-amber-500/25',
      categoryIdle: 'bg-white text-islamic-green-800/70 border border-islamic-green-900/8 hover:bg-amber-50 hover:border-amber-200/60',
    };
  }, [isDarkMode]);
}
