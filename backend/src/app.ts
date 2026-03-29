import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import quranRoutes from './routes/quranRoutes';
import azkarRoutes from './routes/azkarRoutes';
import prayerRoutes from './routes/prayerRoutes';
import qiblaRoutes from './routes/qiblaRoutes';
import chatRoutes from './routes/chatRoutes';
import { ApiResponse } from './types';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/quran', quranRoutes);
app.use('/api/azkar', azkarRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/qibla', qiblaRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Imanify Backend is running',
    timestamp: new Date()
  } as ApiResponse<object>);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  } as ApiResponse<null>);
});

export default app;
