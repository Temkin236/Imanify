/**
 * Validation Middleware
 * Validates request parameters
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validate surah parameter
 */
export const validateSurah = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { surah } = req.params;
  const surahNum = parseInt(surah, 10);

  if (isNaN(surahNum)) {
    res.status(400).json({
      success: false,
      error: 'Surah must be a valid number',
    });
    return;
  }

  if (surahNum < 1 || surahNum > 114) {
    res.status(400).json({
      success: false,
      error: 'Surah must be between 1 and 114',
    });
    return;
  }

  next();
};

/**
 * Validate ayah parameter
 */
export const validateAyah = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { ayah } = req.params;
  const ayahNum = parseInt(ayah, 10);

  if (isNaN(ayahNum)) {
    res.status(400).json({
      success: false,
      error: 'Ayah must be a valid number',
    });
    return;
  }

  if (ayahNum < 1) {
    res.status(400).json({
      success: false,
      error: 'Ayah must be greater than 0',
    });
    return;
  }

  next();
};

/**
 * Validate language query parameter
 */
export const validateLanguage = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { language } = req.query;

  // Default to 'en' if not provided
  if (!language) {
    req.query.language = 'en';
    next();
    return;
  }

  const validLanguages = ['en', 'ar', 'am'];
  if (!validLanguages.includes(language as string)) {
    res.status(400).json({
      success: false,
      error: 'Language must be one of: en, ar, am',
    });
    return;
  }

  next();
};

/**
 * Validate request body for verses array
 */
export const validateVersesBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { verses } = req.body;

  if (!verses) {
    res.status(400).json({
      success: false,
      error: 'verses array is required',
    });
    return;
  }

  if (!Array.isArray(verses)) {
    res.status(400).json({
      success: false,
      error: 'verses must be an array',
    });
    return;
  }

  if (verses.length === 0) {
    res.status(400).json({
      success: false,
      error: 'verses array cannot be empty',
    });
    return;
  }

  if (verses.length > 20) {
    res.status(400).json({
      success: false,
      error: 'Maximum 20 verses per request',
    });
    return;
  }

  // Validate each verse object
  for (const verse of verses) {
    if (!verse.surah || !verse.ayah) {
      res.status(400).json({
        success: false,
        error: 'Each verse must have surah and ayah',
      });
      return;
    }

    const surahNum = parseInt(verse.surah, 10);
    const ayahNum = parseInt(verse.ayah, 10);

    if (isNaN(surahNum) || isNaN(ayahNum)) {
      res.status(400).json({
        success: false,
        error: 'Surah and ayah must be numbers',
      });
      return;
    }

    if (surahNum < 1 || surahNum > 114) {
      res.status(400).json({
        success: false,
        error: 'Surah must be between 1 and 114',
      });
      return;
    }

    if (ayahNum < 1) {
      res.status(400).json({
        success: false,
        error: 'Ayah must be greater than 0',
      });
      return;
    }
  }

  next();
};
