import { Request } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface CustomRequest extends Request {
  userId?: string;
}

export interface MergedQuranAyah {
  surah: number;
  ayah: number;
  arabic: string;
  english: string;
  amharic: string;
}

export interface AmharicQuranAyah {
  surah: number;
  ayah: number;
  surahName?: string;
  text_ar?: string;
  text_en?: string;
  text_am?: string;
}

export interface AzkarItem {
  id: number;
  arabic: string;
  translation_en: string;
  translation_am: string;
  category: string;
  repeat: number;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerResponse {
  city: string;
  country: string;
  date: string;
  hijriDate: string;
  timings: PrayerTimes;
}

export interface QiblaData {
  angle: number;
  direction: string;
  distance: string;
  latitude: number;
  longitude: number;
  kaabaLatitude: number;
  kaabaLongitude: number;
}

export interface RagQuranMatch {
  surah: number;
  ayah: number;
  arabic: string;
  english: string;
  amharic: string;
}

export interface RagAzkarMatch {
  id: number;
  category: string;
  arabic: string;
  translation_en: string;
  translation_am: string;
}

export interface RagContextResult {
  quran: RagQuranMatch[];
  azkar: RagAzkarMatch[];
}

export interface ChatRequestBody {
  message: string;
}

export interface ChatResponse {
  answer: string;
  context: RagContextResult;
}

// Legacy aliases retained for compatibility with existing model placeholders.
export interface AzkarCreateData {
  text: string;
  category: 'morning' | 'evening' | 'after_prayer';
  count: number;
  arabic?: string;
}

export interface Azkar {
  id: number;
  text: string;
  category: 'morning' | 'evening' | 'after_prayer';
  count: number;
  arabic: string;
}

export interface QuranAmharicData {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  englishText?: string;
  amharicText: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  language: 'en' | 'ar' | 'am';
  ramadanMode: boolean;
  createdAt: Date;
}

export interface UserCreateData {
  username: string;
  email: string;
  language?: 'en' | 'ar' | 'am';
  ramadanMode?: boolean;
}
