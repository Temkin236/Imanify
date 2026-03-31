import azkarData from '../data/azkar.json';
import { AzkarItem } from '../types';
import { NotFoundError } from '../utils/errors';

interface RawAzkarItem {
  id: number;
  text: string;
  text_en: string;
  text_am?: string;
  category: string;
  count: number;
}

class AzkarService {
  private readonly azkar: AzkarItem[];

  constructor() {
    this.azkar = (azkarData as RawAzkarItem[]).map((item) => ({
      id: item.id,
      arabic: item.text,
      translation_en: item.text_en,
      translation_am: item.text_am ?? item.text_en,
      category: item.category,
      repeat: item.count
    }));
  }

  async getAll(): Promise<AzkarItem[]> {
    return this.azkar;
  }

  async getByCategory(category: string): Promise<AzkarItem[]> {
    const normalized = category.trim().toLowerCase();
    const filtered = this.azkar.filter((item) => item.category.toLowerCase() === normalized);

    if (filtered.length === 0) {
      throw new NotFoundError(`Azkar category '${category}'`);
    }

    return filtered;
  }
}

export default new AzkarService();
