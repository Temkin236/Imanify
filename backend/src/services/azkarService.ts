import azkarData from '../data/azkar.json' with { type: 'json' };
import { AzkarItem } from '../types.js';
import { NotFoundError } from '../utils/errors.js';

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

  async getById(id: number): Promise<AzkarItem> {
    const item = this.azkar.find((z) => z.id === id);
    if (!item) {
      throw new NotFoundError(`Azkar item with id ${id}`);
    }
    return item;
  }

  async getByCategory(category: string): Promise<AzkarItem[]> {
    const normalized = category.trim().toLowerCase();
    const filtered = this.azkar.filter((item) => item.category.toLowerCase() === normalized);

    if (filtered.length === 0) {
      throw new NotFoundError(`Azkar category '${category}'`);
    }

    return filtered;
  }

  async getCategories(): Promise<string[]> {
    const categoriesSet = new Set<string>();
    for (const item of this.azkar) {
      if (item.category) {
        categoriesSet.add(item.category.toLowerCase());
      }
    }
    return Array.from(categoriesSet);
  }

  async search(query: string): Promise<AzkarItem[]> {
    const term = query.trim().toLowerCase();
    if (!term) {
      return this.azkar;
    }

    return this.azkar.filter(
      (item) =>
        item.arabic.toLowerCase().includes(term) ||
        item.translation_en.toLowerCase().includes(term) ||
        item.translation_am.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }
}

export default new AzkarService();
