import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface PrayerResponse {
  success: boolean;
  data: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
  };
}

export interface QiblaResponse {
  success: boolean;
  data: {
    angle: number;
    direction: string;
    distance: string;
    latitude: number;
    longitude: number;
    kaabaLatitude: number;
    kaabaLongitude: number;
  };
}

class PrayerQiblaClient {
  async getPrayerTimes(city: string = 'Addis Ababa', country: string = 'Ethiopia', date?: string): Promise<PrayerResponse['data']> {
    try {
      const response = await axios.get<PrayerResponse>(`${API_BASE_URL}/prayer/times`, {
        params: { city, country, date }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch prayer times: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getTodayPrayers(city: string = 'Addis Ababa', country: string = 'Ethiopia'): Promise<PrayerResponse['data']> {
    try {
      const response = await axios.get<PrayerResponse>(`${API_BASE_URL}/prayer/today`, {
        params: { city, country }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch today's prayers: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getNextPrayer(city: string = 'Addis Ababa', country: string = 'Ethiopia') {
    try {
      const response = await axios.get(`${API_BASE_URL}/prayer/next`, {
        params: { city, country }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch next prayer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPrayerReminders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/prayer/reminders`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch prayer reminders: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getQiblaDirection(latitude: number, longitude: number): Promise<QiblaResponse['data']> {
    try {
      const response = await axios.get<QiblaResponse>(`${API_BASE_URL}/qibla/direction`, {
        params: { latitude, longitude }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch Qibla direction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async calculateQibla(latitude: number, longitude: number): Promise<QiblaResponse['data']> {
    try {
      const response = await axios.post<QiblaResponse>(`${API_BASE_URL}/qibla/calculate`, {
        latitude,
        longitude
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to calculate Qibla: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getQiblaInfo() {
    try {
      const response = await axios.get(`${API_BASE_URL}/qibla/info`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch Qibla info: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export const prayerQiblaClient = new PrayerQiblaClient();
