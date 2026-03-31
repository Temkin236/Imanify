import { NextFunction, Response } from 'express';
import prayerService from '../services/prayerService';
import { ApiResponse, CustomRequest, PrayerResponse } from '../types';

export async function getPrayerTimes(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { city, country = 'Ethiopia' } = req.query;
    const cityString = typeof city === 'string' ? city : 'Addis Ababa';
    const countryString = typeof country === 'string' ? country : 'Ethiopia';

    const result = await prayerService.getByCity(cityString, countryString);
    res.json({ success: true, data: result } as ApiResponse<PrayerResponse>);
  } catch (error) {
    next(error);
  }
}
