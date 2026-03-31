import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../types';
import { AppError } from './errors';

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    } as ApiResponse<null>);
    return;
  }

  const message = error instanceof Error ? error.message : 'Internal server error';
  res.status(500).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  } as ApiResponse<null>);
}
