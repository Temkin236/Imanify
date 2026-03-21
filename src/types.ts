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
  english: string;
  amharic: string;
  count: number;
  reference?: string;
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
