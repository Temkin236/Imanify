import { describe, it, expect } from 'vitest';
import islamicRefService, {
  lookupReferences,
  formatQuranCitation,
  formatHadithCitation,
  formatReferencesForUser,
  formatReferencesForAI
} from '../services/islamicReferenceService.js';

describe('IslamicReferenceService', () => {
  it('correctly maps anxious/stress prompt to authentic Quran and Hadith sources', () => {
    const result = lookupReferences('I am feeling anxious and overwhelmed');
    expect(result.quran.length).toBeGreaterThan(0);
    expect(result.hadith.length).toBeGreaterThan(0);

    const hasComfortVerse = result.quran.some(
      (q) => q.surah === 13 || q.surah === 2 || q.surah === 94
    );
    expect(hasComfortVerse).toBe(true);
  });

  it('retrieves fasting and Ramadan evidence for Ramadan-related queries', () => {
    const result = lookupReferences('Tell me about fasting in Ramadan');
    expect(result.quran.length).toBeGreaterThan(0);

    const hasBaqarahVerse = result.quran.some((q) => q.surah === 2 && q.ayah === 183);
    expect(hasBaqarahVerse).toBe(true);
  });

  it('formats Quran citation with Surah name, chapter:ayah, Arabic and English text', () => {
    const mockRef = {
      surah: 1,
      surahName: 'Al-Fatiha',
      surahNameAr: 'الفاتحة',
      ayah: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      english: 'All praise is due to Allah, Lord of all the worlds.',
      amharic: 'ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለኾነው',
      topics: ['gratitude', 'praise']
    };

    const formatted = formatQuranCitation(mockRef);
    expect(formatted).toContain('Quran Al-Fatiha');
    expect(formatted).toContain('1:2');
    expect(formatted).toContain('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ');
    expect(formatted).toContain('All praise is due to Allah');
  });

  it('formats Hadith citation with collection source, grade, narrator, and text', () => {
    const mockHadith = {
      id: 'h_test',
      source: 'Sahih al-Bukhari 6323',
      grade: 'Sahih' as const,
      narrator: 'Anas ibn Malik',
      english: 'O Allah, I seek refuge in You from worry and grief.',
      topics: ['anxious']
    };

    const formatted = formatHadithCitation(mockHadith);
    expect(formatted).toContain('Sahih al-Bukhari 6323');
    expect(formatted).toContain('Sahih');
    expect(formatted).toContain('Anas ibn Malik');
    expect(formatted).toContain('worry and grief');
  });

  it('formats reference block for AI system prompts with citation rules', () => {
    const refs = lookupReferences('dua for gratitude');
    const block = formatReferencesForAI(refs);

    expect(block).toContain('VERIFIED ISLAMIC SOURCES');
    expect(block).toContain('CITATION RULES:');
    expect(block).toContain('Allahu Alim');
  });
});
