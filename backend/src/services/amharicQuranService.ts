const CDN_BASE =
  'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/amh-muhammedsadiqan';

interface SurahChapterItem {
  chapter: number;
  verse: number;
  text: string;
}

interface SurahResponse {
  chapter: SurahChapterItem[];
}

interface CacheEntry {
  map: Map<number, string>;
  timestamp: number;
}

class AmharicQuranService {
  private readonly surahCache = new Map<number, CacheEntry>();
  private readonly pendingFetches = new Map<number, Promise<Map<number, string>>>();
  private readonly cacheTtlMs = 24 * 60 * 60 * 1000;

  private async fetchSurahMap(surah: number): Promise<Map<number, string>> {
    const cached = this.surahCache.get(surah);
    if (cached && Date.now() - cached.timestamp < this.cacheTtlMs) {
      return cached.map;
    }

    const pending = this.pendingFetches.get(surah);
    if (pending) return pending;

    const promise = (async () => {
      try {
        const response = await fetch(`${CDN_BASE}/${surah}.json`);
        if (!response.ok) {
          throw new Error(`Amharic surah ${surah} fetch failed`);
        }
        const data = (await response.json()) as SurahResponse;
        const map = new Map<number, string>();
        for (const item of data.chapter) {
          map.set(item.verse, item.text);
        }
        this.surahCache.set(surah, { map, timestamp: Date.now() });
        return map;
      } catch {
        return new Map<number, string>();
      } finally {
        this.pendingFetches.delete(surah);
      }
    })();

    this.pendingFetches.set(surah, promise);
    return promise;
  }

  async getVerse(surah: number, ayah: number): Promise<string> {
    const map = await this.fetchSurahMap(surah);
    return map.get(ayah) ?? '';
  }
}

export default new AmharicQuranService();
