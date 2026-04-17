import { NextFunction, Response } from 'express';
import azkarService from '../services/azkarService.js';
import { ApiResponse, AzkarItem, CustomRequest } from '../types.js';

export async function getAllAzkar(
  _req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const azkar = await azkarService.getAll();
    res.json({ success: true, data: azkar } as ApiResponse<AzkarItem[]>);
  } catch (error) {
    next(error);
  }
}

export async function getAzkarByCategory(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { category } = req.params;
    const azkar = await azkarService.getByCategory(category);
    res.json({ success: true, data: azkar } as ApiResponse<AzkarItem[]>);
  } catch (error) {
    next(error);
  }
}
