import { Request, Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

export interface Prayer {
  name: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  time: string;
}

export interface PrayerReminder {
  prayer: string;
  time: string;
  reminder: string;
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

export interface Azkar {
  id: number;
  text: string;
  category: 'morning' | 'evening' | 'after_prayer';
  count: number;
  arabic: string;
}

export interface AzkarCreateData {
  text: string;
  category: 'morning' | 'evening' | 'after_prayer';
  count: number;
  arabic?: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelation: 'Meccan' | 'Medinan';
  ayahs?: Ayah[];
}

export interface Ayah {
  number: number;
  arabic: string;
  english: string;
  amharic: string;
}

export interface QuranAmharicData {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  englishText?: string;
  amharicText: string;
}

export interface QuranData {
  surahs: Surah[];
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

export interface ChatMessage {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

export interface CustomRequest extends Request {
  userId?: string;
  user?: Partial<User>;
}

export interface CustomResponse extends Response {
  locals?: {
    message?: string;
    [key: string]: any;
  };
}
