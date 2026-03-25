/**
 * Quran Translation Service
 * Fetches and merges Arabic, English, and Amharic translations
 */

import axios from 'axios';
import amharicQuran from '../data/amharic_quran.json';

// Cache for API responses
const translationCache = new Map<string, any>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface QuranVerse {
  surah: number;
  ayah: number;
  arabic: string;
  english: string;
  amharic: string | null;
  amharicAvailable: boolean;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: QuranVerse;
}

/**
 * Get Amharic translation for a specific verse
 */
function getAmharicTranslation(surah: number, ayah: number): string | null {
  const amharicVerse = (amharicQuran as any[]).find(
    (verse) => verse.surah === surah && verse.ayah === ayah
  );

  return amharicVerse?.text_am || null;
}

/**
 * Fetch Arabic translation from Al-Quran API
 * Using Uthmani script
 */
async function fetchArabicTranslation(surah: number, ayah: number): Promise<string> {
  try {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`
    );

    if (response.data.code === 200 && response.data.data) {
      return response.data.data.text; // Returns Uthmani Arabic
    }
    throw new Error('Invalid response from Arabic API');
  } catch (error) {
    console.error(`Error fetching Arabic translation for ${surah}:${ayah}:`, error);
    throw error;
  }
}

/**
 * Fetch English translation from Al-Quran API
 * Using Sahih International translation
 */
async function fetchEnglishTranslation(surah: number, ayah: number): Promise<string> {
  try {
    // Edition: en.sahih (Sahih International)
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/en.sahih`
    );

    if (response.data.code === 200 && response.data.data[0]) {
      return response.data.data[0].text;
    }
    throw new Error('Invalid response from English API');
  } catch (error) {
    console.error(`Error fetching English translation for ${surah}:${ayah}:`, error);
    throw error;
  }
}

/**
 * Generate cache key for verse
 */
function getCacheKey(surah: number, ayah: number): string {
  return `quran_${surah}_${ayah}`;
}

/**
 * Clear cache for a specific verse or all
 */
export function clearCache(surah?: number, ayah?: number): void {
  if (surah !== undefined && ayah !== undefined) {
    const key = getCacheKey(surah, ayah);
    translationCache.delete(key);
    console.log(`Cache cleared for ${surah}:${ayah}`);
  } else {
    translationCache.clear();
    console.log('All cache cleared');
  }
}

/**
 * Get cached verse or null if expired/not found
 */
function getFromCache(surah: number, ayah: number): QuranVerse | null {
  const key = getCacheKey(surah, ayah);
  const cached = translationCache.get(key);

  if (!cached) return null;

  // Check if cache expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    translationCache.delete(key);
    return null;
  }

  return cached.data;
}

/**
 * Store verse in cache
 */
function setCache(surah: number, ayah: number, verse: QuranVerse): void {
  const key = getCacheKey(surah, ayah);
  translationCache.set(key, {
    data: verse,
    timestamp: Date.now(),
  });
}

/**
 * Main function: Merge all translations
 */
export async function mergeTranslations(
  surah: number,
  ayah: number
): Promise<QuranVerse> {
  // Validate input
  if (!surah || !ayah || surah < 1 || surah > 114 || ayah < 1) {
    throw new Error('Invalid surah or ayah number');
  }

  // Check cache first
  const cached = getFromCache(surah, ayah);
  if (cached) {
    console.log(`Cache hit for ${surah}:${ayah}`);
    return cached;
  }

  try {
    // Fetch Arabic and English in parallel
    const [arabic, english] = await Promise.all([
      fetchArabicTranslation(surah, ayah),
      fetchEnglishTranslation(surah, ayah),
    ]);

    // Fetch Amharic from local JSON
    const amharic = getAmharicTranslation(surah, ayah);

    const verse: QuranVerse = {
      surah,
      ayah,
      arabic,
      english,
      amharic: amharic || 'Amharic translation not available',
      amharicAvailable: amharic !== null,
    };

    // Cache the result
    setCache(surah, ayah, verse);

    return verse;
  } catch (error) {
    console.error(`Error fetching translations for ${surah}:${ayah}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple verses at once
 */
export async function mergeMultipleVerses(
  verses: { surah: number; ayah: number }[]
): Promise<QuranVerse[]> {
  try {
    const results = await Promise.allSettled(
      verses.map((v) => mergeTranslations(v.surah, v.ayah))
    );

    return results
      .map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error('Failed to fetch verse:', result.reason);
          return null;
        }
      })
      .filter((v) => v !== null) as QuranVerse[];
  } catch (error) {
    console.error('Error fetching multiple verses:', error);
    throw error;
  }
}

/**
 * Get entire surah
 */
export async function getSurah(surah: number): Promise<QuranVerse[]> {
  if (surah < 1 || surah > 114) {
    throw new Error('Invalid surah number');
  }

  try {
    // Fetch all ayahs for the surah from API
    const response = await axios.get(
      `https://api.alquran.cloud/v1/surah/${surah}`
    );

    if (response.data.code !== 200 || !response.data.data) {
      throw new Error('Invalid response from Surah API');
    }

    const ayahs = response.data.data.ayahs;
    const verses = await Promise.all(
      ayahs.map((ayah: any) => mergeTranslations(surah, ayah.numberInSurah))
    );

    return verses;
  } catch (error) {
    console.error(`Error fetching Surah ${surah}:`, error);
    throw error;
  }
}

/**
 * Search verses by keyword in English translation
 */
export async function searchVerses(keyword: string, limit: number = 10): Promise<QuranVerse[]> {
  if (!keyword || keyword.length < 2) {
    throw new Error('Search keyword must be at least 2 characters');
  }

  try {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/search/${keyword}/en.sahih`
    );

    if (response.data.code !== 200 || !response.data.data.matches) {
      throw new Error('Invalid response from Search API');
    }

    const matches = response.data.data.matches.slice(0, limit);
    const verses = await Promise.all(
      matches.map((match: any) =>
        mergeTranslations(match.surah, match.ayah)
      )
    );

    return verses;
  } catch (error) {
    console.error(`Error searching verses for "${keyword}":`, error);
    throw error;
  }
}

export default {
  mergeTranslations,
  mergeMultipleVerses,
  getSurah,
  searchVerses,
  clearCache,
};
