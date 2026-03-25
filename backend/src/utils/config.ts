/**
 * Configuration Utility
 * Manages and validates environment variables
 */

interface Config {
  // Server
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  // CORS
  corsOrigin: string[];

  // API
  alquranApiTimeout: number;
  apiCacheTtlHours: number;

  // Gemini API (for chatbot)
  geminiApiKey?: string;

  // Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;

  // Database (for future use)
  db?: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };

  // Logging
  logFilePath: string;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
      .split(',')
      .map(url => url.trim());

    return {
      port: parseInt(process.env.PORT || '5000', 10),
      nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
      logLevel: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
      corsOrigin,
      alquranApiTimeout: parseInt(process.env.ALQURAN_API_TIMEOUT || '5000', 10),
      apiCacheTtlHours: parseInt(process.env.API_CACHE_TTL_HOURS || '24', 10),
      geminiApiKey: process.env.GEMINI_API_KEY,
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
      rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      logFilePath: process.env.LOG_FILE_PATH || './logs/server.log',
      db: process.env.DB_HOST ? {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'imanify',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
      } : undefined,
    };
  }

  private validateConfig(): void {
    if (this.config.port < 1 || this.config.port > 65535) {
      throw new Error('Invalid PORT: must be between 1 and 65535');
    }

    if (this.config.corsOrigin.length === 0) {
      throw new Error('CORS_ORIGIN must be configured');
    }

    if (this.config.alquranApiTimeout < 1000 || this.config.alquranApiTimeout > 30000) {
      throw new Error('ALQURAN_API_TIMEOUT should be between 1000 and 30000 ms');
    }

    if (this.config.apiCacheTtlHours < 1 || this.config.apiCacheTtlHours > 168) {
      throw new Error('API_CACHE_TTL_HOURS should be between 1 and 168 hours');
    }

    if (!['development', 'production', 'test'].includes(this.config.nodeEnv)) {
      throw new Error('NODE_ENV must be development, production, or test');
    }
  }

  getConfig(): Config {
    return this.config;
  }

  get(key: keyof Config): any {
    return this.config[key];
  }

  isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }

  printConfig(): void {
    const safeConfig = { ...this.config };
    if (safeConfig.geminiApiKey) {
      safeConfig.geminiApiKey = '***REDACTED***';
    }
    if (safeConfig.db?.password) {
      safeConfig.db.password = '***REDACTED***';
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     🔧 Configuration Loaded            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(JSON.stringify(safeConfig, null, 2));
  }
}

export default ConfigManager.getInstance();
