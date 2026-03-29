import { Response } from 'express';
import quranService from '../services/quranService';
import { CustomRequest, ApiResponse, Surah } from '../types';

export async function getAllSurahs(req: CustomRequest, res: Response): Promise<void> {
  try {
    const surahs = await quranService.getAllSurahs();
    res.json({ success: true, data: surahs } as ApiResponse<Surah[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getSurahById(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const surah = await quranService.getSurahById(id);
    res.json({ success: true, data: surah } as ApiResponse<Surah | null>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getAmharicQuran(req: CustomRequest, res: Response): Promise<void> {
  try {
    const quran = await quranService.getAmharicQuran();
    res.json({ success: true, data: quran });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function searchSurah(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { query } = req.query;
    const queryString = typeof query === 'string' ? query : '';
    const results = await quranService.searchSurah(queryString);
    res.json({ success: true, data: results } as ApiResponse<Surah[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}
