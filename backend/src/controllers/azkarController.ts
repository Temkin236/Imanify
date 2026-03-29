import { Response } from 'express';
import Azkar from '../models/Azkar';
import { CustomRequest, ApiResponse, Azkar as AzkarType } from '../types';

export async function getAllAzkar(req: CustomRequest, res: Response): Promise<void> {
  try {
    const azkar = await Azkar.find();
    res.json({ success: true, data: azkar } as ApiResponse<AzkarType[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getAzkarByCategory(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { category } = req.params;
    const azkar = await Azkar.findByCategory(category);
    res.json({ success: true, data: azkar } as ApiResponse<AzkarType[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getMorningAzkar(req: CustomRequest, res: Response): Promise<void> {
  try {
    const azkar = await Azkar.findByCategory('morning');
    res.json({ success: true, data: azkar } as ApiResponse<AzkarType[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function getEveningAzkar(req: CustomRequest, res: Response): Promise<void> {
  try {
    const azkar = await Azkar.findByCategory('evening');
    res.json({ success: true, data: azkar } as ApiResponse<AzkarType[]>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}

export async function createAzkar(req: CustomRequest, res: Response): Promise<void> {
  try {
    const { text, category, count } = req.body;
    const azkar = await Azkar.create({ text, category, count });
    res.status(201).json({ success: true, data: azkar } as ApiResponse<AzkarType>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: errorMessage } as ApiResponse<null>);
  }
}
