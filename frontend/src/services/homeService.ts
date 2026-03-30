import { getTodayPrayerTimes, PrayerData } from './prayerService';
import { getTodayHijriDate, HijriDateData } from './hijriService';
import { getEventForDate, getNextUpcomingEvent, IslamicEvent } from './islamicEventsService';
import { SURAHS } from '../constants';

const QURAN_BASE_URL = 'https://api.alquran.cloud/v1';
const ADDIS_ABABA_COORDS = { latitude: 8.9806, longitude: 38.7578 };

export type SeasonName = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface WeatherSnapshot {
  city: string;
  country: string;
  temperatureC: number;
  weatherCode: number;
  weatherText: string;
  isDay: boolean;
  season: SeasonName;
}

export interface DailyAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  english: string;
  amharic: string;
}

export interface SituationalReminder {
  title: string;
  message: string;
  hadithOrAthar: string;
  source: string;
  action: string;
}

export interface HomeInsights {
  completedPrayers: number;
  totalPrayers: number;
  remembranceScore: number;
}

export interface HomeSnapshot {
  prayerData: PrayerData;
  hijri: HijriDateData;
  weather: WeatherSnapshot;
  event: IslamicEvent | null;
  dailyAyah: DailyAyah;
  reminder: SituationalReminder;
  insights: HomeInsights;
}

function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getSeason(monthIndex: number): SeasonName {
  // Northern hemisphere season model
  if (monthIndex >= 2 && monthIndex <= 4) return 'Spring';
  if (monthIndex >= 5 && monthIndex <= 7) return 'Summer';
  if (monthIndex >= 8 && monthIndex <= 10) return 'Autumn';
  return 'Winter';
}

function weatherCodeToText(code: number): string {
  if ([0].includes(code)) return 'Clear sky';
  if ([1, 2, 3].includes(code)) return 'Partly cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rainy';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Mild weather';
}

async function getWeatherSnapshot(city = 'Addis Ababa', country = 'Ethiopia'): Promise<WeatherSnapshot> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ADDIS_ABABA_COORDS.latitude}&longitude=${ADDIS_ABABA_COORDS.longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }

    const data: any = await res.json();
    const now = new Date();
    const code = Number(data?.current?.weather_code ?? 0);
    const temp = Number(data?.current?.temperature_2m ?? 23);
    const isDay = Boolean(data?.current?.is_day ?? 1);

    return {
      city,
      country,
      temperatureC: temp,
      weatherCode: code,
      weatherText: weatherCodeToText(code),
      isDay,
      season: getSeason(now.getMonth()),
    };
  } catch {
    const now = new Date();
    return {
      city,
      country,
      temperatureC: 23,
      weatherCode: 1,
      weatherText: 'Partly cloudy',
      isDay: now.getHours() >= 6 && now.getHours() < 18,
      season: getSeason(now.getMonth()),
    };
  }
}

async function getDailyAyah(): Promise<DailyAyah> {
  const dailyId = (dayOfYear() % 6236) + 1;

  try {
    const res = await fetch(`${QURAN_BASE_URL}/ayah/${dailyId}/editions/quran-uthmani,en.sahih,am.sadiq`);
    if (!res.ok) {
      throw new Error(`Quran API error: ${res.status}`);
    }

    const data: any = await res.json();
    if (!Array.isArray(data?.data) || data.data.length < 2) {
      throw new Error('Invalid Quran daily ayah payload');
    }

    const editions: any[] = data.data;
    const arabicAyah = editions.find((e) => e?.edition?.identifier === 'quran-uthmani') || editions[0];
    const englishAyah = editions.find((e) => e?.edition?.identifier === 'en.sahih') || editions[1];
    const amharicAyah =
      editions.find((e) => e?.edition?.identifier === 'am.sadiq') ||
      editions.find((e) => e?.edition?.language === 'am');

    const fallbackAmharic =
      SURAHS.find((s) => s.id === arabicAyah?.surah?.number)
        ?.verses.find((v) => v.number === arabicAyah?.numberInSurah)
        ?.amharic || 'ይህ የቀኑ አንቀጽ ነው፤ በእርሱ ላይ አስተንትን።';

    return {
      surahNumber: arabicAyah.surah.number,
      surahName: arabicAyah.surah.englishName,
      ayahNumber: arabicAyah.numberInSurah,
      arabic: arabicAyah.text,
      english: englishAyah.text,
      amharic: amharicAyah?.text || fallbackAmharic,
    };
  } catch {
    const fallback = SURAHS[0].verses[4];
    return {
      surahNumber: 1,
      surahName: 'Al-Fatiha',
      ayahNumber: 5,
      arabic: fallback.arabic,
      english: fallback.english,
      amharic: fallback.amharic,
    };
  }
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function buildInsights(prayerData: PrayerData): HomeInsights {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const todayPrayers = [prayerData.fajr, prayerData.dhuhr, prayerData.asr, prayerData.maghrib, prayerData.isha];
  const completed = todayPrayers.filter((t) => current >= parseMinutes(t)).length;

  const remembranceScore = Math.max(25, Math.min(100, Math.round((completed / 5) * 100 + (prayerData.isRamadan ? 10 : 0))));

  return {
    completedPrayers: completed,
    totalPrayers: 5,
    remembranceScore,
  };
}

function buildSituationalReminder(
  prayerData: PrayerData,
  hijri: HijriDateData,
  weather: WeatherSnapshot,
  event: IslamicEvent | null
): SituationalReminder {
  if (prayerData.isRamadan) {
    return {
      title: 'Ramadan Focus',
      message: 'Today is a fasting day. Guard your tongue, nourish your heart with Quran, and prepare your iftar with gratitude.',
      hadithOrAthar: '"Whoever fasts Ramadan with faith and seeking reward, his previous sins are forgiven."',
      source: 'Sahih al-Bukhari, Sahih Muslim',
      action: 'Read 2 pages before Maghrib and make dua before iftar.',
    };
  }

  if (hijri.isFriday) {
    return {
      title: 'Jumuah Preparation',
      message: 'It is Friday. Increase salawat upon the Prophet and prioritize Surah Al-Kahf.',
      hadithOrAthar: '"The best day on which the sun has risen is Friday."',
      source: 'Sahih Muslim',
      action: 'Recite Surah Al-Kahf and send salawat often today.',
    };
  }

  if ([61, 63, 65, 80, 81, 82].includes(weather.weatherCode)) {
    return {
      title: 'Rainy Day Reminder',
      message: 'Rain is mercy. Use this moment for sincere dua and gratitude.',
      hadithOrAthar: '"Two supplications are rarely rejected: at the time of the call to prayer and when rain falls."',
      source: 'Hasan narrations (reported in Abu Dawud)',
      action: 'Make a short dua list and ask Allah while rain is falling.',
    };
  }

  if (event?.significance === 'high') {
    return {
      title: event.label,
      message: event.description,
      hadithOrAthar: event.sunnah_tip,
      source: 'Islamic calendar reminder',
      action: event.reward || 'Increase dhikr and sincere intention today.',
    };
  }

  const nextPrayerMinutes = prayerData.nextPrayer.timeUntil.hours * 60 + prayerData.nextPrayer.timeUntil.minutes;
  if (nextPrayerMinutes <= 60) {
    return {
      title: `${prayerData.nextPrayer.name} is close`,
      message: 'A prayer window is approaching. Pause and renew your intention.',
      hadithOrAthar: '"The most beloved deeds to Allah are prayers at their proper times."',
      source: 'Sahih al-Bukhari',
      action: `Prepare for ${prayerData.nextPrayer.name} with wudu and 2 minutes of dhikr.`,
    };
  }

  const seasonAction: Record<SeasonName, SituationalReminder> = {
    Spring: {
      title: 'Spring Renewal',
      message: 'Spring is a season of renewal. Refresh your intention and begin again with small consistent worship.',
      hadithOrAthar: '"The most beloved deeds to Allah are those most consistent, even if small."',
      source: 'Sahih al-Bukhari, Sahih Muslim',
      action: 'Commit to one daily habit this week (2 pages Quran or morning dhikr).',
    },
    Summer: {
      title: 'Summer Patience',
      message: 'Heat can make worship harder. Patience in difficulty increases reward.',
      hadithOrAthar: '"Whoever remains patient, Allah will make him patient."',
      source: 'Sahih al-Bukhari',
      action: 'Pray on time and keep your dhikr short but consistent.',
    },
    Autumn: {
      title: 'Autumn Reflection',
      message: 'As days shift, reflect on what is fading and what should remain in your heart.',
      hadithOrAthar: '"Be in this world as though you were a stranger or a traveler."',
      source: 'Sahih al-Bukhari',
      action: 'Take 5 quiet minutes after one prayer to reflect and make dua.',
    },
    Winter: {
      title: 'Winter Worship',
      message: 'Longer nights and calmer moments are a gift for reflection and night prayer.',
      hadithOrAthar: '"The best prayer after the obligatory prayers is night prayer."',
      source: 'Sahih Muslim',
      action: 'Pray 2 rakaat before sleeping or before Fajr this week.',
    },
  };

  return seasonAction[weather.season];
}

export async function getHomeSnapshot(city = 'Addis Ababa', country = 'Ethiopia'): Promise<HomeSnapshot> {
  const [prayerData, hijri, weather, dailyAyah] = await Promise.all([
    getTodayPrayerTimes(city, country),
    getTodayHijriDate(),
    getWeatherSnapshot(city, country),
    getDailyAyah(),
  ]);

  const todaysEvent = getEventForDate(hijri.hijriMonthNumber, hijri.hijriDay) ||
    getNextUpcomingEvent(hijri.hijriMonthNumber, hijri.hijriYear);

  return {
    prayerData,
    hijri,
    weather,
    event: todaysEvent,
    dailyAyah,
    reminder: buildSituationalReminder(prayerData, hijri, weather, todaysEvent || null),
    insights: buildInsights(prayerData),
  };
}
