/**
 * Imanify Backend Server
 * Quran API with multi-language support (Arabic, English, Amharic)
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quranRoutes from './routes/quranRoutes';
import config from './utils/config';
import logger from './utils/logger';
import { AppError, getErrorResponse } from './utils/errors';

// Load environment variables
dotenv.config();

const app: Express = express();
const cfg = config.getConfig();
const PORT = cfg.port;
const NODE_ENV = cfg.nodeEnv;

// CORS configuration
const corsOptions = {
  origin: cfg.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Register Quran API routes
app.use('/api/quran', quranRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(getErrorResponse(err));
  }

  res.status(500).json({
    success: false,
    error: NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info('🕌 Imanify Quran API Server started', {
    port: PORT,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  logger.info('📚 Quran API endpoints available at /api/quran');
  logger.info('Available endpoints:');
  logger.info('  GET  /api/quran/:surah/:ayah');
  logger.info('  GET  /api/quran/surah/:surah');
  logger.info('  POST /api/quran/verses');
  logger.info('  GET  /api/quran/search');
  logger.info('  POST /api/quran/cache/clear');
  logger.info('  GET  /api/quran/health');

  config.printConfig();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

export default app;
