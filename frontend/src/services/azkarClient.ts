import axios from 'axios';
import { AzkarItem } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:3000/api';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class AzkarServiceClient {
  private cache = new Map<string, CacheEntry<any>>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours for Azkar

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

  async getAzkarByCategory(category: string): Promise<AzkarItem[]> {
    const cacheKey = `azkar_${category}`;
    
    const cached = this.getFromCache<AzkarItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${API_BASE_URL}/azkar/category/${category}`);
      const azkar: AzkarItem[] = response.data.data;
      this.setCache(cacheKey, azkar);
      return azkar;
    } catch (error) {
      throw new Error(
        `Failed to fetch azkar: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getMorningAzkar(): Promise<AzkarItem[]> {
    return this.getAzkarByCategory('morning');
  }

  async getEveningAzkar(): Promise<AzkarItem[]> {
    return this.getAzkarByCategory('evening');
  }

  async getAfterPrayerAzkar(): Promise<AzkarItem[]> {
    return this.getAzkarByCategory('after_prayer');
  }

  async getAllAzkar(): Promise<AzkarItem[]> {
    const cacheKey = 'all_azkar';
    
    const cached = this.getFromCache<AzkarItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${API_BASE_URL}/azkar`);
      const azkar: AzkarItem[] = response.data.data;
      this.setCache(cacheKey, azkar);
      return azkar;
    } catch (error) {
      throw new Error(
        `Failed to fetch all azkar: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async createAzkar(data: {
    text: string;
    category: string;
    count: number;
    arabic?: string;
  }): Promise<AzkarItem> {
    try {
      const response = await axios.post(`${API_BASE_URL}/azkar`, data);
      // Invalidate cache
      this.cache.delete(`azkar_${data.category}`);
      this.cache.delete('all_azkar');
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to create azkar: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const azkarServiceClient = new AzkarServiceClient();
