import amharicQuranData from '../data/amharic_quran.json.js';
import { RagAzkarMatch, RagContextResult, RagQuranMatch } from '../types.js';
import azkarService from './azkarService.js';

interface QuranRecord {
  surah: number;
  ayah: number;
  text_ar?: string;
  text_en?: string;
  text_am?: string;
}

interface ScoredItem<T> {
  score: number;
  item: T;
}

class RagService {
  private readonly amharicData = amharicQuranData as QuranRecord[];
  private readonly stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'was', 'are',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'what', 'which', 'who', 'when', 'where',
    'why', 'how', 'ካለ', 'ስለ', 'ወደ', 'ነው', 'እንደ', 'ላይ', 'ውስጥ'
  ]);

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-z0-9\u0600-\u06ff\u1200-\u137f\s]+/)
      .filter((token) => token.length > 2 && !this.stopWords.has(token));
  }

  private scoreSimilarity(text: string, keywords: string[]): number {
    const normalizedText = text.toLowerCase();
    let score = 0;

    for (const keyword of keywords) {
      // Exact phrase match (highest priority)
      if (normalizedText.includes(keyword)) {
        score += 10;
      }

      // Substring match (medium priority)
      const keywordTokens = keyword.split(/\s+/);
      for (const token of keywordTokens) {
        if (normalizedText.includes(token)) {
          score += 3;
        }
      }
    }

    return score;
  }

  async getContext(question: string): Promise<RagContextResult> {
    const keywords = this.tokenize(question);

    // Score local Amharic Quran data
    const scoredQuran: ScoredItem<RagQuranMatch>[] = this.amharicData
      .map((entry) => {
        const combined = `${entry.text_ar || ''} ${entry.text_en || ''} ${entry.text_am || ''}`;
        const score = this.scoreSimilarity(combined, keywords);

        return {
          score,
          item: {
            surah: entry.surah,
            ayah: entry.ayah,
            arabic: entry.text_ar || '',
            english: entry.text_en || '',
            amharic: entry.text_am || ''
          }
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Score Azkar
    const azkar = await azkarService.getAll();
    const scoredAzkar: ScoredItem<RagAzkarMatch>[] = azkar
      .map((entry) => {
        const combined = `${entry.arabic} ${entry.translation_en} ${entry.translation_am}`;
        const score = this.scoreSimilarity(combined, keywords);

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
      .slice(0, 5);

    return {
      quran: scoredQuran.map((entry) => entry.item).slice(0, 3),
      azkar: scoredAzkar.map((entry) => entry.item).slice(0, 2)
    };
  }
}

export default new RagService();
