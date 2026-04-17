import { QiblaData } from '../types.js';

interface QiblaInfo {
  kaabaLocation: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  significance: string;
}

class QiblaService {
  private readonly KAABA_LAT: number = 21.4225;
  private readonly KAABA_LNG: number = 39.8262;

  async getQiblaDirection(latitude: number, longitude: number): Promise<QiblaData> {
    try {
      const angle = this.calculateQiblaAngle(latitude, longitude);
      const direction = this.getDirection(angle);
      const distance = this.calculateDistance(latitude, longitude, this.KAABA_LAT, this.KAABA_LNG);

      return {
        angle,
        direction,
        distance,
        latitude,
        longitude,
        kaabaLatitude: this.KAABA_LAT,
        kaabaLongitude: this.KAABA_LNG
      };
    } catch (error) {
      throw new Error(`Failed to get Qibla direction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateQiblaAngle(lat1: number, lng1: number): number {
    const lat2 = this.KAABA_LAT;
    const lng2 = this.KAABA_LNG;

    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const y = Math.sin(dLng) * Math.cos(lat2 * (Math.PI / 180));
    const x =
      Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
      Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLng);

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    return (angle + 360) % 360;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  }

  private getDirection(angle: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
  }

  async calculateQibla(latitude: number, longitude: number): Promise<QiblaData> {
    return await this.getQiblaDirection(latitude, longitude);
  }

  async getQiblaInfo(): Promise<QiblaInfo> {
    return {
      kaabaLocation: {
        city: 'Mecca',
        country: 'Saudi Arabia',
        latitude: this.KAABA_LAT,
        longitude: this.KAABA_LNG
      },
      significance:
        'Qibla is the direction of the Kaaba in Mecca towards which Muslims face during prayer'
    };
  }
}

export default new QiblaService();
