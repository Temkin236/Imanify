/**
 * Islamic (Hijri) Calendar Service
 * Provides utilities to fetch and convert Gregorian dates to Hijri dates using Aladhan API
 */

export interface HijriDateData {
  hijriDay: number;
  hijriMonthEn: string;
  hijriMonthAr: string;
  hijriMonthNumber: number; // Month number 1-12 for event matching
  hijriYear: number;
  gregorianDate: string; // DD-MM-YYYY format
  isRamadan: boolean;
  isFriday: boolean;
  nextPrayerName?: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
        ar: string;
      };
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
      designation: {
        abbreviated: string;
        expanded: string;
      };
      holidays: string[];
    };
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: {
        en: string;
        ar: string;
      };
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
      designation: {
        abbreviated: string;
        expanded: string;
      };
    };
  };
}

// Simple in-memory cache for API responses (TTL: 24 hours)
const cache = new Map<string, { data: HijriDateData; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Converts a Gregorian date to Hijri date
 * @param date - JavaScript Date object or string in DD-MM-YYYY format
 * @returns Promise with Hijri date data
 */
export async function getHijriDate(date: Date | string): Promise<HijriDateData> {
  try {
    // Format the date as DD-MM-YYYY
    let dateStr: string;
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      dateStr = `${day}-${month}-${year}`;
    } else {
      dateStr = date;
    }

    // Check cache first
    const cached = cache.get(dateStr);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // Fetch from Aladhan API
    const url = `https://api.aladhan.com/v1/gToH?date=${dateStr}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Aladhan API error: ${response.status}`);
    }

    const data: AladhanResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`Aladhan API returned error: ${data.status}`);
    }

    // Extract and transform the data
    const hijri = data.data.hijri;
    const gregorian = data.data.gregorian;
    const isRamadan = hijri.month.en === 'Ramadan';
    const isFriday = gregorian.weekday.en.toLowerCase() === 'friday';

    const hijriData: HijriDateData = {
      hijriDay: parseInt(hijri.day, 10),
      hijriMonthEn: hijri.month.en,
      hijriMonthAr: hijri.month.ar,
      hijriMonthNumber: hijri.month.number,
      hijriYear: parseInt(hijri.year, 10),
      gregorianDate: gregorian.format,
      isRamadan,
      isFriday,
      nextPrayerName: isFriday ? 'Jumu\'ah' : undefined,
    };

    // Cache the result
    cache.set(dateStr, { data: hijriData, timestamp: Date.now() });

    return hijriData;
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    throw error;
  }
}

/**
 * Gets the current Hijri date (today)
 * @returns Promise with today's Hijri date data
 */
export async function getTodayHijriDate(): Promise<HijriDateData> {
  return getHijriDate(new Date());
}

/**
 * Formats the Hijri date into a display string
 * @param hijriData - HijriDateData object
 * @returns Formatted string (e.g., "15 Ramadan 1447 AH")
 */
export function formatHijriDate(hijriData: HijriDateData): string {
  return `${hijriData.hijriDay} ${hijriData.hijriMonthEn} ${hijriData.hijriYear} AH`;
}

/**
 * Clears the API cache
 */
export function clearHijriCache(): void {
  cache.clear();
}
