export interface Verse {
  id: number;
  number: number;
  arabic: string;
  english: string;
  amharic: string;
  audioUrl?: string;
}

export interface Surah {
  id: number;
  name: string;
  englishName: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  verses: Verse[];
}

export interface AzkarItem {
  id: number;
  category: 'morning' | 'evening' | 'after_prayer' | 'sleep' | 'ramadan' | 'daily' | 'protection';
  title_en: string;
  title_am: string;
  arabic: string;
  transliteration?: string;
  english: string;
  amharic: string;
  count: number;
  reference?: string;
  reward?: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  id: string;
  email: string;
  streak: number;
  achievements: string[];
  lastActiveDate: string;
  createdAt: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  title_am?: string;
  description: string;
  icon: string;
  requiredDays: number;
  unlockedAt?: string;
}

export type CalculationMethodId = 1 | 2 | 3 | 4 | 5;

export interface PrayerCalculationMethod {
  id: CalculationMethodId;
  name: string;
  description: string;
}

export interface PrayerSettings {
  city: string;
  country: string;
  method: CalculationMethodId;
  notificationsEnabled: boolean;
  latitude?: number;
  longitude?: number;
}

export interface IslamicDate {
  readable: string;
  hijriDate: string;
  day?: string;
  month?: string;
  year?: string;
}
