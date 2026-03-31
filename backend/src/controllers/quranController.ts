import { NextFunction, Response } from 'express';
import quranService from '../services/quranService';
import { ApiResponse, CustomRequest, MergedQuranAyah } from '../types';
import { AppError } from '../utils/errors';

export async function getQuranAyah(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const surah = Number(req.params.surah);
    const ayah = Number(req.params.ayah);

    if (!Number.isFinite(surah) || !Number.isFinite(ayah)) {
      throw new AppError('Surah and ayah must be numeric', 400);
    }

    const mergedAyah = await quranService.getMergedAyah(surah, ayah);
    res.json({
      success: true,
      data: mergedAyah
    } as ApiResponse<MergedQuranAyah>);
  } catch (error) {
    next(error);
  }
}
