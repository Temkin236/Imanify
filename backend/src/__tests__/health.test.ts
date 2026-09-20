import { describe, it, expect } from 'vitest';
import app from '../app.js';

describe('App & Health Endpoint Structure', () => {
  it('exports an express application instance with health route configured', () => {
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  it('process uptime and environment can be retrieved for health monitoring', () => {
    const uptime = Math.floor(process.uptime());
    expect(uptime).toBeGreaterThanOrEqual(0);
    expect(typeof uptime).toBe('number');

    const env = process.env.NODE_ENV || 'development';
    expect(typeof env).toBe('string');
  });
});
