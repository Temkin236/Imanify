/**
 * Quran Controller
 * Handles Quran API business logic
 */

import { Request, Response } from 'express';
import {
  mergeTranslations,
  mergeMultipleVerses,
  getSurah as getFullSurah,
  searchVerses as searchVersesByKeyword,
  clearCache,
} from '../services/quranService';

class QuranController {
  /**
   * Get a single verse (ayah) with all translations
   */
  static async getVerse(req: Request, res: Response): Promise<void> {
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
      console.error('Error in getVerse:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch verse',
      });
    }
  }

  /**
   * Get entire surah (chapter) with all translations
   */
  static async getSurah(req: Request, res: Response): Promise<void> {
    try {
      const { surah } = req.params;
      const surahNum = parseInt(surah, 10);

      const verses = await getFullSurah(surahNum);

      res.json({
        success: true,
        surah: surahNum,
        totalAyahs: verses.length,
        data: verses,
      });
    } catch (error: any) {
      console.error('Error in getSurah:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch surah',
      });
    }
  }

  /**
   * Get multiple verses at once
   */
  static async getMultipleVerses(req: Request, res: Response): Promise<void> {
    try {
      const { verses } = req.body;

      if (!verses || !Array.isArray(verses) || verses.length === 0) {
        res.status(400).json({
          success: false,
          error: 'verses array is required and must not be empty',
        });
        return;
      }

      // Validate max 20 verses per request
      if (verses.length > 20) {
        res.status(400).json({
          success: false,
          error: 'Maximum 20 verses per request',
        });
        return;
      }

      const results = await mergeMultipleVerses(verses);

      res.json({
        success: true,
        count: results.length,
        data: results,
      });
    } catch (error: any) {
      console.error('Error in getMultipleVerses:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch verses',
      });
    }
  }

  /**
   * Search verses by keyword
   */
  static async searchVerses(req: Request, res: Response): Promise<void> {
    try {
      const { keyword, limit = '10' } = req.query;

      if (!keyword || typeof keyword !== 'string') {
        res.status(400).json({
          success: false,
          error: 'keyword query parameter is required',
        });
        return;
      }

      if (keyword.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Keyword must be at least 2 characters',
        });
        return;
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
      console.error('Error in searchVerses:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Search failed',
      });
    }
  }

  /**
   * Clear cache
   */
  static clearCache(req: Request, res: Response): void {
    try {
      const { surah, ayah } = req.body;

      if (surah !== undefined && ayah !== undefined) {
        clearCache(surah, ayah);
        res.json({
          success: true,
          message: `Cache cleared for ${surah}:${ayah}`,
        });
        return;
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
  }

  /**
   * Health check
   */
  static health(req: Request, res: Response): void {
    res.json({
      success: true,
      status: 'Quran API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  }
}

export default QuranController;
