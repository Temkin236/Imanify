import { Surah, QuranData } from '../types';

class QuranService {
  private quranData: QuranData = {
    surahs: []
  };

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      // In production, this would load from the JSON file
      this.quranData = {
        surahs: []
      };
    } catch (error) {
      console.error('Failed to load Quran data');
    }
  }

  async getAllSurahs(): Promise<Surah[]> {
    try {
      return this.quranData.surahs || [];
    } catch (error) {
      throw new Error(`Failed to fetch surahs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSurahById(id: string): Promise<Surah | null> {
    try {
      const surah = this.quranData.surahs?.find((s: Surah) => s.number === parseInt(id));
      return surah || null;
    } catch (error) {
      throw new Error(`Failed to fetch surah: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAmharicQuran(): Promise<QuranData> {
    try {
      return this.quranData || { surahs: [] };
    } catch (error) {
      throw new Error(`Failed to fetch Amharic Quran: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchSurah(query: string): Promise<Surah[]> {
    try {
      const results = this.quranData.surahs?.filter((s: Surah) =>
        s.name?.toLowerCase().includes(query.toLowerCase()) ||
        s.englishName?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      return results;
    } catch (error) {
      throw new Error(`Failed to search surahs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new QuranService();
