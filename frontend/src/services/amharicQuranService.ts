const CDN_BASE =
  'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/amh-muhammedsadiqan';

export const AMHARIC_FALLBACK =
  'ይህ አንቀጽ በአማርኛ ትርጉም በመጫን ላይ ነው።';

interface SurahChapterItem {
  chapter: number;
  verse: number;
  text: string;
}

interface SurahResponse {
  chapter: SurahChapterItem[];
}

const surahCache = new Map<number, Map<number, string>>();
const pendingFetches = new Map<number, Promise<Map<number, string>>>();

async function fetchSurahMap(surah: number): Promise<Map<number, string>> {
  const cached = surahCache.get(surah);
  if (cached) return cached;

  const pending = pendingFetches.get(surah);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const res = await fetch(`${CDN_BASE}/${surah}.json`);
      if (!res.ok) throw new Error(`Amharic surah ${surah} fetch failed`);
      const data = (await res.json()) as SurahResponse;
      const map = new Map<number, string>();
      for (const item of data.chapter) {
        map.set(item.verse, item.text);
      }
      surahCache.set(surah, map);
      return map;
    } catch {
      return new Map<number, string>();
    } finally {
      pendingFetches.delete(surah);
    }
  })();

  pendingFetches.set(surah, promise);
  return promise;
}

export async function getSurahAmharicMap(surah: number): Promise<Map<number, string>> {
  return fetchSurahMap(surah);
}

export async function getAmharicVerse(surah: number, ayah: number): Promise<string> {
  const map = await fetchSurahMap(surah);
  return map.get(ayah) || AMHARIC_FALLBACK;
}

export async function prefetchSurahAmharic(surahs: number[]): Promise<void> {
  const unique = [...new Set(surahs.filter((s) => s >= 1 && s <= 114))];
  await Promise.all(unique.map((s) => fetchSurahMap(s)));
}

export async function getAmharicTextsForAyahs(
  items: Array<{ surah: number; ayah: number }>
): Promise<string[]> {
  await prefetchSurahAmharic(items.map((i) => i.surah));
  return items.map(({ surah, ayah }) => {
    const map = surahCache.get(surah);
    return map?.get(ayah) || AMHARIC_FALLBACK;
  });
}
