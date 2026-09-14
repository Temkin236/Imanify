import { describe, it, expect, vi, beforeEach } from 'vitest';
import prayerService from '../services/prayerService.js';
import { AppError } from '../utils/errors.js';

describe('PrayerService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects empty city query with AppError status 400', async () => {
    await expect(prayerService.getByCity('')).rejects.toThrow(AppError);
    await expect(prayerService.getByCity('   ')).rejects.toThrow('City query is required');
  });

  it('fetches prayer times from Aladhan API and returns properly formatted timings', async () => {
    const mockApiResponse = {
      data: {
        timings: {
          Fajr: '05:00',
          Dhuhr: '12:15',
          Asr: '15:30',
          Maghrib: '18:20',
          Isha: '19:30'
        },
        date: {
          readable: '14 Sep 2026',
          hijri: {
            date: '03-04-1448'
          }
        }
      }
    };

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    } as Response);

    const result = await prayerService.getByCity('Addis Ababa', 'Ethiopia');

    expect(result.city).toBe('Addis Ababa');
    expect(result.country).toBe('Ethiopia');
    expect(result.timings.Fajr).toBe('05:00');
    expect(result.timings.Dhuhr).toBe('12:15');
    expect(result.timings.Maghrib).toBe('18:20');
    expect(result.hijriDate).toBe('03-04-1448');
  });

  it('uses cached response on subsequent requests within cache TTL', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');

    // The previous call populated the cache for 'addis ababa:ethiopia:...'
    const cachedResult = await prayerService.getByCity('Addis Ababa', 'Ethiopia');
    expect(cachedResult).toBeDefined();
    // fetch should not be called again
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
