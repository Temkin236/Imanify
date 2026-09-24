import { describe, it, expect } from 'vitest';
import qiblaService from '../services/qiblaService.js';

describe('QiblaService', () => {
  it('calculates accurate Qibla direction from Addis Ababa, Ethiopia', async () => {
    // Addis Ababa coordinates: ~9.03 N, 38.74 E
    const addisLat = 9.03;
    const addisLng = 38.74;

    const result = await qiblaService.getQiblaDirection(addisLat, addisLng);

    expect(result).toBeDefined();
    expect(result.latitude).toBe(addisLat);
    expect(result.longitude).toBe(addisLng);
    expect(result.kaabaLatitude).toBe(21.4225);
    expect(result.kaabaLongitude).toBe(39.8262);

    // From Ethiopia towards Mecca is roughly North (approx 5-10 degrees)
    expect(result.angle).toBeGreaterThan(0);
    expect(result.angle).toBeLessThan(20);
    expect(result.direction).toBe('N');

    // Distance between Addis Ababa and Mecca is approx 1300-1500 km
    const distanceNum = parseFloat(result.distance);
    expect(distanceNum).toBeGreaterThan(1300);
    expect(distanceNum).toBeLessThan(1500);
  });

  it('calculates zero distance when located directly at the Kaaba', async () => {
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const result = await qiblaService.calculateQibla(kaabaLat, kaabaLng);

    expect(result).toBeDefined();
    expect(parseFloat(result.distance)).toBeCloseTo(0, 1);
  });

  it('provides verified metadata and Kaaba information', async () => {
    const info = await qiblaService.getQiblaInfo();

    expect(info).toBeDefined();
    expect(info.kaabaLocation.city).toBe('Mecca');
    expect(info.kaabaLocation.country).toBe('Saudi Arabia');
    expect(info.kaabaLocation.latitude).toBe(21.4225);
    expect(info.kaabaLocation.longitude).toBe(39.8262);
    expect(info.significance).toContain('Kaaba in Mecca');
  });
});
