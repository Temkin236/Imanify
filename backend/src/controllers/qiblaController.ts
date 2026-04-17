import { NextFunction, Response } from 'express';
import qiblaService from '../services/qiblaService.js';
import { ApiResponse, CustomRequest, QiblaData } from '../types.js';
import { AppError } from '../utils/errors.js';

export async function getQiblaDirection(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const latParam = req.query.lat;
    const lonParam = req.query.lon;
    const lat = typeof latParam === 'string' ? Number(latParam) : Number.NaN;
    const lon = typeof lonParam === 'string' ? Number(lonParam) : Number.NaN;

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new AppError('Valid lat and lon query parameters are required', 400);
    }

    const qibla = await qiblaService.getQiblaDirection(lat, lon);
    res.json({ success: true, data: qibla } as ApiResponse<QiblaData>);
  } catch (error) {
    next(error);
  }
}
