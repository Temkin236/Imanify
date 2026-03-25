/**
 * Type Definitions for Imanify Backend
 */

export interface QuranVerse {
  surah: number;
  ayah: number;
  translations: {
    ar?: TranslationData;
    en?: TranslationData;
    am?: TranslationData;
  };
}

export interface TranslationData {
  text: string;
  edition: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

export interface VerseReference {
  surah: number;
  ayah: number;
}

export interface searchQuery {
  keyword: string;
  limit?: number;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}

export interface SurahInfo {
  number: number;
  name: string;
  englishName?: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ApiErrorData {
  code: number;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type Language = 'en' | 'ar' | 'am';

export interface LanguageConfig {
  code: Language;
  name: string;
  apiEdition?: string;
  rtl?: boolean;
}
