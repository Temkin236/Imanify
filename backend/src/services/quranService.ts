import amharicQuranData from '../data/amharic_quran.json' with { type: 'json' };
import { AmharicQuranAyah, MergedQuranAyah } from '../types.js';
import config from '../utils/config.js';
import { AppError, NotFoundError, ServiceUnavailableError } from '../utils/errors.js';

interface RemoteAyah {
  numberInSurah: number;
  text: string;
}

interface RemoteEditionData {
  edition: {
    identifier: string;
  };
  ayahs: RemoteAyah[];
}

interface RemoteQuranApiResponse {
  code: number;
  status: string;
  data: RemoteEditionData[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class QuranService {
  private readonly apiBase = 'https://api.alquran.cloud/v1';
  private readonly cacheTtlMs = Number(config.get('apiCacheTtlHours')) * 60 * 60 * 1000;
  private readonly amharicAyahMap: Map<string, AmharicQuranAyah>;
  private readonly surahEditionsCache = new Map<number, CacheEntry<RemoteEditionData[]>>();
  private readonly mergedAyahCache = new Map<string, CacheEntry<MergedQuranAyah>>();

  constructor() {
    this.amharicAyahMap = this.buildAmharicMap(amharicQuranData as AmharicQuranAyah[]);
  }

  private buildAmharicMap(ayahs: AmharicQuranAyah[]): Map<string, AmharicQuranAyah> {
    const map = new Map<string, AmharicQuranAyah>();
    for (const ayah of ayahs) {
      map.set(`${ayah.surah}:${ayah.ayah}`, ayah);
    }
    return map;
  }

  private getCached<T>(cache: Map<string | number, CacheEntry<T>>, key: string | number): T | null {
    const entry = cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.cacheTtlMs) {
      cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCached<T>(cache: Map<string | number, CacheEntry<T>>, key: string | number, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  private validateSurahAyah(surah: number, ayah: number): void {
    if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
      throw new AppError('Surah must be an integer between 1 and 114', 400);
    }
    if (!Number.isInteger(ayah) || ayah < 1) {
      throw new AppError('Ayah must be a positive integer', 400);
    }
  }

  private async fetchSurahEditions(surah: number): Promise<RemoteEditionData[]> {
    const cached = this.getCached(this.surahEditionsCache, surah);
    if (cached) {
      return cached;
    }

    const timeout = Number(config.get('alquranApiTimeout'));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(
        `${this.apiBase}/surah/${surah}/editions/quran-uthmani,en.sahih`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new ServiceUnavailableError('Quran API');
      }

      const payload = (await response.json()) as RemoteQuranApiResponse;
      if (!payload.data || !Array.isArray(payload.data)) {
        throw new ServiceUnavailableError('Quran API');
      }

      this.setCached(this.surahEditionsCache, surah, payload.data);
      return payload.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new ServiceUnavailableError('Quran API');
    } finally {
      clearTimeout(timer);
    }
  }

  async getMergedAyah(surah: number, ayah: number): Promise<MergedQuranAyah> {
    this.validateSurahAyah(surah, ayah);
    const cacheKey = `${surah}:${ayah}`;

    const cached = this.getCached(this.mergedAyahCache, cacheKey);
    if (cached) {
      return cached;
    }

    const editions = await this.fetchSurahEditions(surah);
    const arabicEdition = editions.find((edition) => edition.edition.identifier === 'quran-uthmani');
    const englishEdition = editions.find((edition) => edition.edition.identifier === 'en.sahih');

    const arabicAyah = arabicEdition?.ayahs.find((item) => item.numberInSurah === ayah);
    const englishAyah = englishEdition?.ayahs.find((item) => item.numberInSurah === ayah);
    const amharicAyah = this.amharicAyahMap.get(cacheKey);

    if (!arabicAyah && !englishAyah && !amharicAyah) {
      throw new NotFoundError(`Ayah ${ayah} in Surah ${surah}`);
    }

    const merged: MergedQuranAyah = {
      surah,
      ayah,
      arabic: arabicAyah?.text ?? amharicAyah?.text_ar ?? '',
      english: englishAyah?.text ?? amharicAyah?.text_en ?? '',
      amharic: amharicAyah?.text_am ?? ''
    };

    this.setCached(this.mergedAyahCache, cacheKey, merged);
    return merged;
  }
}

export default new QuranService();
