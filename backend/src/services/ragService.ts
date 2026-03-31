import amharicQuranData from '../data/amharic_quran.json';
import { RagAzkarMatch, RagContextResult, RagQuranMatch } from '../types';
import azkarService from './azkarService';

interface QuranRecord {
  surah: number;
  ayah: number;
  text_en?: string;
  text_am?: string;
}

interface ScoredItem<T> {
  score: number;
  item: T;
}

class RagService {
  private readonly quranData = amharicQuranData as QuranRecord[];

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-z0-9\u1200-\u137f]+/)
      .filter((token) => token.length > 1);
  }

  private scoreText(text: string, keywords: string[]): number {
    const haystack = text.toLowerCase();
    return keywords.reduce((score, keyword) => {
      if (!keyword) {
        return score;
      }

      let idx = 0;
      let count = 0;
      while (true) {
        const found = haystack.indexOf(keyword, idx);
        if (found === -1) {
          break;
        }
        count += 1;
        idx = found + keyword.length;
      }

      return score + count;
    }, 0);
  }

  async getContext(question: string): Promise<RagContextResult> {
    const keywords = this.tokenize(question);

    const scoredQuran: ScoredItem<RagQuranMatch>[] = this.quranData
      .map((entry) => {
        const english = entry.text_en ?? '';
        const amharic = entry.text_am ?? '';
        const score = this.scoreText(`${english} ${amharic}`, keywords);

        return {
          score,
          item: {
            surah: entry.surah,
            ayah: entry.ayah,
            english,
            amharic
          }
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const azkar = await azkarService.getAll();
    const scoredAzkar: ScoredItem<RagAzkarMatch>[] = azkar
      .map((entry) => {
        const score = this.scoreText(
          `${entry.translation_en} ${entry.translation_am} ${entry.arabic}`,
          keywords
        );

        return {
          score,
          item: {
            id: entry.id,
            category: entry.category,
            arabic: entry.arabic,
            translation_en: entry.translation_en,
            translation_am: entry.translation_am
          }
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      quran: scoredQuran.map((entry) => entry.item),
      azkar: scoredAzkar.map((entry) => entry.item)
    };
  }
}

export default new RagService();
