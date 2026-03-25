/**
 * Quran API Routes
 * Express endpoints for Quran verse retrieval with multi-language support
 */

import { Router, Request, Response, NextFunction } from 'express';
import {
  mergeTranslations,
  mergeMultipleVerses,
  getSurah as getFullSurah,
  searchVerses as searchVersesByKeyword,
  clearCache,
} from '../services/quranService';

const router = Router();

// Middleware to validate surah and ayah parameters
const validateVerseParams = (req: Request, res: Response, next: NextFunction) => {
  const { surah, ayah } = req.params;

  const surahNum = parseInt(surah, 10);
  const ayahNum = parseInt(ayah, 10);

  if (isNaN(surahNum) || isNaN(ayahNum)) {
    return res.status(400).json({
      success: false,
      error: 'Surah and ayah must be valid numbers',
    });
  }

  if (surahNum < 1 || surahNum > 114) {
    return res.status(400).json({
      success: false,
      error: 'Surah must be between 1 and 114',
    });
  }

  if (ayahNum < 1) {
    return res.status(400).json({
      success: false,
      error: 'Ayah must be greater than 0',
    });
  }

  next();
};

/**
 * GET /api/quran/:surah/:ayah
 * Get a specific verse with all three translations
 */
router.get(
  '/:surah/:ayah',
  validateVerseParams,
  async (req: Request, res: Response) => {
    try {
      const { surah, ayah } = req.params;
      const surahNum = parseInt(surah, 10);
      const ayahNum = parseInt(ayah, 10);

      const verse = await mergeTranslations(surahNum, ayahNum);

      res.json({
        success: true,
        data: verse,
      });
    } catch (error: any) {
      console.error('Error in GET /api/quran/:surah/:ayah', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch verse',
      });
    }
  }
);

/**
 * GET /api/quran/surah/:surah
 * Get entire surah with all translations
 */
router.get('/surah/:surah', async (req: Request, res: Response) => {
  try {
    const { surah } = req.params;
    const surahNum = parseInt(surah, 10);

    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      return res.status(400).json({
        success: false,
        error: 'Surah must be between 1 and 114',
      });
    }

    const verses = await getFullSurah(surahNum);

    res.json({
      success: true,
      surah: surahNum,
      totalAyahs: verses.length,
      data: verses,
    });
  } catch (error: any) {
    console.error('Error in GET /api/quran/surah/:surah', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch surah',
    });
  }
});

/**
 * POST /api/quran/verses
 * Get multiple verses at once
 * Body: { verses: [{ surah: 1, ayah: 1 }, { surah: 2, ayah: 2 }] }
 */
router.post('/verses', async (req: Request, res: Response) => {
  try {
    const { verses } = req.body;

    if (!verses || !Array.isArray(verses) || verses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'verses array is required and must not be empty',
      });
    }

    // Validate max 20 verses per request
    if (verses.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 20 verses per request',
      });
    }

    const results = await mergeMultipleVerses(verses);

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error('Error in POST /api/quran/verses', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch verses',
    });
  }
});

/**
 * GET /api/quran/search
 * Search verses by keyword in English translation
 * Query: ?keyword=peace&limit=10
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { keyword, limit = '10' } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'keyword query parameter is required',
      });
    }

    if (keyword.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Keyword must be at least 2 characters',
      });
    }

    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50);

    const results = await searchVersesByKeyword(keyword, limitNum);

    res.json({
      success: true,
      keyword,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error('Error in GET /api/quran/search', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Search failed',
    });
  }
});

/**
 * POST /api/quran/cache/clear
 * Clear cache (optional: for specific verse)
 * Body: { surah?: number, ayah?: number }
 */
router.post('/cache/clear', (req: Request, res: Response) => {
  try {
    const { surah, ayah } = req.body;

    if (surah !== undefined && ayah !== undefined) {
      clearCache(surah, ayah);
      return res.json({
        success: true,
        message: `Cache cleared for ${surah}:${ayah}`,
      });
    }

    clearCache();
    res.json({
      success: true,
      message: 'All cache cleared',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to clear cache',
    });
  }
});

/**
 * GET /api/quran/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'Quran API is running',
    version: '1.0.0',
  });
});

export default router;
