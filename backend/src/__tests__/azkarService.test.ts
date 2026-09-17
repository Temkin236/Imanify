import { describe, it, expect } from 'vitest';
import azkarService from '../services/azkarService.js';
import { NotFoundError } from '../utils/errors.js';

describe('AzkarService', () => {
  it('returns all azkar items with required properties', async () => {
    const items = await azkarService.getAll();
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('arabic');
    expect(first).toHaveProperty('translation_en');
    expect(first).toHaveProperty('category');
    expect(first).toHaveProperty('repeat');
  });

  it('filters items correctly by category in a case-insensitive manner', async () => {
    const categories = await azkarService.getCategories();
    expect(categories.length).toBeGreaterThan(0);

    const testCategory = categories[0];
    const filtered = await azkarService.getByCategory(testCategory.toUpperCase());
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach((item) => {
      expect(item.category.toLowerCase()).toBe(testCategory.toLowerCase());
    });
  });

  it('throws NotFoundError when an invalid category is requested', async () => {
    await expect(azkarService.getByCategory('non_existent_category_12345')).rejects.toThrow(
      NotFoundError
    );
  });

  it('retrieves an item by its specific ID', async () => {
    const all = await azkarService.getAll();
    const target = all[0];

    const retrieved = await azkarService.getById(target.id);
    expect(retrieved.id).toBe(target.id);
    expect(retrieved.arabic).toBe(target.arabic);
  });

  it('throws NotFoundError when an item with invalid ID is requested', async () => {
    await expect(azkarService.getById(99999999)).rejects.toThrow(NotFoundError);
  });

  it('searches azkar items by query keywords across translations', async () => {
    const all = await azkarService.getAll();
    const query = all[0].translation_en.split(' ')[0] || 'Allah';

    const searchResults = await azkarService.search(query);
    expect(searchResults.length).toBeGreaterThan(0);
  });
});
