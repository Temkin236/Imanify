import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import quranRoutes from './routes/quranRoutes';
import azkarRoutes from './routes/azkarRoutes';
import prayerRoutes from './routes/prayerRoutes';
import qiblaRoutes from './routes/qiblaRoutes';
import chatRoutes from './routes/chatRoutes';
import { ApiResponse } from './types';
import { errorHandler } from './utils/errorHandler';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'Imanify Backend API',
      docs: '/api'
    },
    timestamp: new Date().toISOString()
  } as ApiResponse<object>);
});

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      endpoints: {
        health: '/api/health',
        quranAyah: '/api/quran/:surah/:ayah',
        azkarAll: '/api/azkar',
        azkarCategory: '/api/azkar/:category',
        prayerByCity: '/api/prayer?city=Addis%20Ababa',
        qibla: '/api/qibla?lat=9.03&lon=38.74',
        chat: 'POST /api/chat'
      }
    },
    timestamp: new Date().toISOString()
  } as ApiResponse<object>);
});

// Routes
app.use('/api/quran', quranRoutes);
app.use('/api/azkar', azkarRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/qibla', qiblaRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      message: 'Imanify Backend is running'
    },
    timestamp: new Date().toISOString()
  } as ApiResponse<object>);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString()
  } as ApiResponse<null>);
});

app.use(errorHandler);

export default app;
