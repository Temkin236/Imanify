import { PrayerResponse, PrayerTimes } from '../types';
import { AppError, ServiceUnavailableError } from '../utils/errors';

interface AladhanResponse {
  data?: {
    timings?: Record<string, string>;
    date?: {
      readable?: string;
      hijri?: {
        date?: string;
      };
    };
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class PrayerService {
  private readonly cache = new Map<string, CacheEntry<PrayerResponse>>();
  private readonly cacheTtlMs = 60 * 60 * 1000;

  private getCached(key: string): PrayerResponse | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.cacheTtlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCached(key: string, data: PrayerResponse): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getByCity(city: string, country: string = 'Ethiopia'): Promise<PrayerResponse> {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      throw new AppError('City query is required', 400);
    }

    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `${trimmedCity.toLowerCase()}:${country.toLowerCase()}:${today}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(trimmedCity)}&country=${encodeURIComponent(country)}&method=2`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new ServiceUnavailableError('Aladhan API');
      }

      const payload = (await response.json()) as AladhanResponse;
      const timings = payload.data?.timings;
      const hijriDate = payload.data?.date?.hijri?.date;
      const readableDate = payload.data?.date?.readable;

      if (!timings || !hijriDate || !readableDate) {
        throw new ServiceUnavailableError('Aladhan API');
      }

      const prayerTimes: PrayerTimes = {
        Fajr: timings.Fajr,
        Dhuhr: timings.Dhuhr,
        Asr: timings.Asr,
        Maghrib: timings.Maghrib,
        Isha: timings.Isha
      };

      const result: PrayerResponse = {
        city: trimmedCity,
        country,
        date: readableDate,
        hijriDate,
        timings: prayerTimes
      };

      this.setCached(cacheKey, result);
      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new ServiceUnavailableError('Aladhan API');
    }
  }
}

export default new PrayerService();
