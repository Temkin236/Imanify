import { Response } from 'express';
import qiblaService from '../services/qiblaService';
import { CustomRequest, ApiResponse, QiblaData } from '../types';

export async function getQiblaDirection(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { latitude, longitude } = req.query;
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : 0;
    const lng = typeof longitude === 'string' ? parseFloat(longitude) : 0;

    const qibla = await qiblaService.getQiblaDirection(lat, lng);
    res.json({ success: true, data: qibla } as ApiResponse<QiblaData>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function calculateQibla(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { latitude, longitude } = req.body;
    const result = await qiblaService.calculateQibla(latitude, longitude);
    res.json({ success: true, data: result } as ApiResponse<QiblaData>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getQiblaInfo(req: CustomRequest, res: Response): Promise<void> {
  try {
    const info = await qiblaService.getQiblaInfo();
    res.json({ success: true, data: info } as ApiResponse<object>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}
