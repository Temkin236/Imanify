import { Response } from 'express';
import prayerService from '../services/prayerService';
import { CustomRequest, ApiResponse, PrayerTimes, Prayer, PrayerReminder } from '../types';

export async function getPrayerTimes(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { date, city = 'Addis Ababa', country = 'Ethiopia' } = req.query;
    const dateString = typeof date === 'string' ? date : '';
    const cityString = typeof city === 'string' ? city : 'Addis Ababa';
    const countryString = typeof country === 'string' ? country : 'Ethiopia';

    const times = await prayerService.getPrayerTimes(dateString, cityString, countryString);
    res.json({ success: true, data: times } as ApiResponse<PrayerTimes>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getTodayPrayers(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { city = 'Addis Ababa', country = 'Ethiopia' } = req.query;
    const cityString = typeof city === 'string' ? city : 'Addis Ababa';
    const countryString = typeof country === 'string' ? country : 'Ethiopia';

    const times = await prayerService.getTodayPrayers(cityString, countryString);
    res.json({ success: true, data: times } as ApiResponse<PrayerTimes>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getNextPrayer(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { city = 'Addis Ababa', country = 'Ethiopia' } = req.query;
    const cityString = typeof city === 'string' ? city : 'Addis Ababa';
    const countryString = typeof country === 'string' ? country : 'Ethiopia';

    const nextPrayer = await prayerService.getNextPrayer(cityString, countryString);
    res.json({ success: true, data: nextPrayer } as ApiResponse<Prayer>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getPrayerReminders(req: CustomRequest, res: Response): Promise<void> {
  try {
    const reminders = await prayerService.getPrayerReminders();
    res.json({ success: true, data: reminders } as ApiResponse<PrayerReminder[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}
