import axios from 'axios';
import { Surah, Verse } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/api';
const EXTERNAL_API = 'https://api.alquran.cloud/v1';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class QuranServiceClient {
  private cache = new Map<string, CacheEntry<any>>();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour

  private isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < this.cacheExpiry;
  }

  private getFromCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data || null;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getAllSurahs(): Promise<Surah[]> {
    const cacheKey = 'all_surahs';
    
    const cached = this.getFromCache<Surah[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${API_BASE_URL}/quran`);
      const surahs: Surah[] = response.data.data;
      this.setCache(cacheKey, surahs);
      return surahs;
    } catch (error) {
      throw new Error(
        `Failed to fetch surahs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getSurahDetails(id: number): Promise<Surah> {
    const cacheKey = `surah_${id}`;
    
    const cached = this.getFromCache<Surah>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${API_BASE_URL}/quran/${id}`);
      const surah: Surah = response.data.data;
      this.setCache(cacheKey, surah);
      return surah;
    } catch (error) {
      throw new Error(
        `Failed to fetch surah details: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async searchSurahs(query: string): Promise<Surah[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/quran/search`, {
        params: { query }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to search surahs: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getJuz(juzNumber: number): Promise<Verse[]> {
    const cacheKey = `juz_${juzNumber}`;
    
    const cached = this.getFromCache<Verse[]>(cacheKey);
    if (cached) return cached;

    try {
      // Fallback to external API if backend doesn't support
      const response = await axios.get(
        `${EXTERNAL_API}/juz/${juzNumber}/quran-uthmani`
      );
      const verses = response.data.data.ayahs;
      this.setCache(cacheKey, verses);
      return verses;
    } catch (error) {
      throw new Error(
        `Failed to fetch Juz ${juzNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const quranServiceClient = new QuranServiceClient();
