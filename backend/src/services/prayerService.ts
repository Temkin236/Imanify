import { PrayerTimes, Prayer, PrayerReminder } from '../types';

interface AladhanResponse {
  code: number;
  status: string;
  data?: {
    timings?: PrayerTimes;
    date?: {
      gregorian: string;
      hijri: string;
    };
    meta?: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
    [key: string]: any;
  };
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

class PrayerService {
  private isCacheValid(key: string): boolean {
    const entry = cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < CACHE_TTL;
  }

  private getFromCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return cache.get(key)?.data || null;
    }
    cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  async getPrayerTimes(
    date: string,
    city: string = 'Addis Ababa',
    country: string = 'Ethiopia'
  ): Promise<PrayerTimes | null> {
    const cacheKey = `${city}-${country}-${date}`;
    
    const cached = this.getFromCache<PrayerTimes>(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&date=${date}&method=2`;
      const response = await fetch(url);
      const data: AladhanResponse = await response.json();
      
      if (data.data?.timings) {
        this.setCache(cacheKey, data.data.timings);
        return data.data.timings;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to fetch prayer times: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTodayPrayers(
    city: string = 'Addis Ababa',
    country: string = 'Ethiopia'
  ): Promise<PrayerTimes | null> {
    try {
      const today = new Date().toLocaleDateString('en-GB');
      return await this.getPrayerTimes(today, city, country);
    } catch (error) {
      throw new Error(`Failed to fetch today's prayers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNextPrayer(
    city: string = 'Addis Ababa',
    country: string = 'Ethiopia'
  ): Promise<Prayer> {
    try {
      const times = await this.getTodayPrayers(city, country);
      const now = new Date();

      const prayers: Prayer[] = [
        { name: 'Fajr', time: times?.Fajr || '' },
        { name: 'Dhuhr', time: times?.Dhuhr || '' },
        { name: 'Asr', time: times?.Asr || '' },
        { name: 'Maghrib', time: times?.Maghrib || '' },
        { name: 'Isha', time: times?.Isha || '' }
      ];

      return prayers.find((p: Prayer) => p.time) || prayers[0];
    } catch (error) {
      throw new Error(`Failed to get next prayer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPrayerReminders(): Promise<PrayerReminder[]> {
    try {
      return [
        { prayer: 'Fajr', time: '05:30', reminder: 'Remember Allah in the early morning' },
        { prayer: 'Dhuhr', time: '12:30', reminder: 'Midday reminder to reconnect with Allah' },
        { prayer: 'Asr', time: '15:45', reminder: 'Asr prayer brings peace to the heart' },
        { prayer: 'Maghrib', time: '18:50', reminder: 'Time of breaking fast and gratitude' },
        { prayer: 'Isha', time: '20:15', reminder: 'End your day with prayer' }
      ];
    } catch (error) {
      throw new Error(`Failed to get prayer reminders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new PrayerService();
