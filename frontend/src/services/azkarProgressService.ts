import { AZKAR } from '../data/azkarData';

const STORAGE_KEY = 'imanify_azkar_progress';
const STREAK_KEY = 'imanify_azkar_streak';

export interface AzkarProgress {
  counts: Record<number, number>;
  completedIds: number[];
  lastActiveDate: string;
  dailyCompleted: number;
}

export interface AzkarStats {
  todayCompleted: number;
  todayTotal: number;
  todayPercent: number;
  streak: number;
  totalCompleted: number;
  categoryProgress: Record<string, { done: number; total: number }>;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress(): AzkarProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { counts: {}, completedIds: [], lastActiveDate: todayKey(), dailyCompleted: 0 };
    }
    const data = JSON.parse(raw) as AzkarProgress;

    if (data.lastActiveDate !== todayKey()) {
      return { counts: {}, completedIds: [], lastActiveDate: todayKey(), dailyCompleted: 0 };
    }

    return data;
  } catch {
    return { counts: {}, completedIds: [], lastActiveDate: todayKey(), dailyCompleted: 0 };
  }
}

function saveProgress(progress: AzkarProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadStreak(): { dates: string[]; streak: number } {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { dates: [], streak: 0 };
    return JSON.parse(raw);
  } catch {
    return { dates: [], streak: 0 };
  }
}

function saveStreak(dates: string[], streak: number): void {
  localStorage.setItem(STREAK_KEY, JSON.stringify({ dates, streak }));
}

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort().reverse();
  const today = todayKey();
  let streak = 0;
  let checkDate = new Date(today);

  if (sorted[0] !== today) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const key = checkDate.toISOString().slice(0, 10);
    if (sorted.includes(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getAzkarCounts(): Record<number, number> {
  return loadProgress().counts;
}

export function incrementAzkar(id: number, max: number): { counts: Record<number, number>; justCompleted: boolean } {
  const progress = loadProgress();
  const current = progress.counts[id] || 0;

  if (current >= max) {
    return { counts: progress.counts, justCompleted: false };
  }

  const next = current + 1;
  progress.counts[id] = next;

  const justCompleted = next >= max;
  if (justCompleted && !progress.completedIds.includes(id)) {
    progress.completedIds.push(id);
    progress.dailyCompleted = progress.completedIds.length;

    const streakData = loadStreak();
    const today = todayKey();
    if (!streakData.dates.includes(today)) {
      streakData.dates.push(today);
      streakData.dates = streakData.dates.slice(-30);
      streakData.streak = computeStreak(streakData.dates);
      saveStreak(streakData.dates, streakData.streak);
    }
  }

  saveProgress(progress);
  return { counts: progress.counts, justCompleted };
}

export function resetAzkar(id: number): Record<number, number> {
  const progress = loadProgress();
  delete progress.counts[id];
  progress.completedIds = progress.completedIds.filter((cid) => cid !== id);
  progress.dailyCompleted = progress.completedIds.length;
  saveProgress(progress);
  return progress.counts;
}

export function resetCategory(category: string): Record<number, number> {
  const progress = loadProgress();
  const categoryIds = AZKAR.filter((a) => a.category === category).map((a) => a.id);

  for (const id of categoryIds) {
    delete progress.counts[id];
    progress.completedIds = progress.completedIds.filter((cid) => cid !== id);
  }

  progress.dailyCompleted = progress.completedIds.length;
  saveProgress(progress);
  return progress.counts;
}

export function getAzkarStats(activeCategory?: string): AzkarStats {
  const progress = loadProgress();
  const streakData = loadStreak();
  const streak = computeStreak(streakData.dates);

  const categoryProgress: Record<string, { done: number; total: number }> = {};
  for (const item of AZKAR) {
    if (!categoryProgress[item.category]) {
      categoryProgress[item.category] = { done: 0, total: 0 };
    }
    categoryProgress[item.category].total++;
    if ((progress.counts[item.id] || 0) >= item.count) {
      categoryProgress[item.category].done++;
    }
  }

  const relevant = activeCategory
    ? AZKAR.filter((a) => a.category === activeCategory)
    : AZKAR;

  const todayTotal = relevant.length;
  const todayCompleted = relevant.filter((a) => (progress.counts[a.id] || 0) >= a.count).length;

  return {
    todayCompleted,
    todayTotal,
    todayPercent: todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0,
    streak,
    totalCompleted: progress.completedIds.length,
    categoryProgress,
  };
}
