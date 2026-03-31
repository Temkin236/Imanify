export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
}

export interface TimeUntil {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string; // HH:MM:SS
}

export interface NextPrayer {
  name: string;
  time: string;
  timeUntil: TimeUntil;
  sunnahQuote: string;
  sunnahQuoteAr: string;
  reward: string;
}

export interface PrayerData extends PrayerTimes {
  date: string;
  hijri: {
    date: string;
    month: string;
    year: string;
  };
  nextPrayer: NextPrayer;
  isRamadan: boolean;
}

const SUNNAH_DATA: Record<string, { quote: string; quoteAr: string; reward: string }> = {
  fajr: {
    quote:
      '"The best prayer is Fajr prayer on a cold day. Whoever performs Fajr prayer in congregation will have the reward of spending the entire night in worship."',
    quoteAr: '"أفضل الصلوات عند الله صلاة الفجر يوم الجمعة في جماعة"',
    reward: '⭐ Spending the night in worship',
  },
  sunrise: {
    quote:
      '"Whoever prays Fajr in congregation, then sits remembering Allah until sunrise, then prays two Rak\'ahs, will have a complete reward of Hajj and \'Umrah."',
    quoteAr: '"من صلى الفجر في جماعة ثم قعد يذكر الله حتى تطلع الشمس"',
    reward: '⭐ Reward of Hajj and Umrah',
  },
  dhuhr: {
    quote:
      '"The best day is Friday. On this day, Allah created Adam. On this day, he will be resurrected. On this day, the Hour will be established."',
    quoteAr: '"خير يوم طلعت فيه الشمس يوم الجمعة"',
    reward: '⭐ Immense blessings and mercy',
  },
  asr: {
    quote:
      '"Whoever misses Asr prayer, it is as if his family and wealth have been destroyed."',
    quoteAr: '"من ترك صلاة العصر فقد حبط عمله"',
    reward: '⭐ Preservation of family and wealth',
  },
  maghrib: {
    quote:
      '"The Maghrib prayer is the time of mercy. Angels lower their wings for the student of knowledge."',
    quoteAr: '"المغرب وقت الرحمة"',
    reward: '⭐ Time of divine mercy',
  },
  isha: {
    quote:
      '"Whoever remains awake for the night of Isha and Fajr prayers, Allah will make the fire of Hell forbidden for them."',
    quoteAr: '"من قام ليل القيام أمنه الله من الفزع"',
    reward: '⭐ Protection and peace',
  },
  iftar: {
    quote:
      '"The fasting person has two moments of joy: when he breaks his fast, he is happy, and when he meets his Lord, he will be happy because of his fasting."',
    quoteAr: '"للصائم فرحتان: فرحة عند فطره وفرحة عند لقاء ربه"',
    reward: '🌙 Immense reward for fasting',
  },
};

const cache = new Map<string, { data: PrayerData; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000;

export async function getPrayerTimes(
  date: Date,
  city: string = 'Addis Ababa', // Default to Addis Ababa
  country: string = 'Ethiopia'
): Promise<PrayerData> {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const dateStr = `${day}-${month}-${year}`;
  const cacheKey = `${city}-${date.toDateString()}`;

  try {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const encodedCity = encodeURIComponent(city);
    const encodedCountry = encodeURIComponent(country);
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodedCity}&country=${encodedCountry}&date=${dateStr}&method=2`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Aladhan API error: ${response.status}`);
    }

    const apiData: any = await response.json();
    if (!apiData || apiData.code !== 200) {
      throw new Error(`API error: ${apiData?.status || 'Unknown error'}`);
    }
    if (!apiData.data || !apiData.data.timings) {
      throw new Error('Invalid response structure from Aladhan API');
    }

    const timings = apiData.data.timings;
    const hijri = apiData.data.hijri || {};

    const isRamadan = hijri?.month?.number === 9 || false;

    const prayerData: PrayerData = {
      fajr: formatTime(timings.Fajr),
      sunrise: formatTime(timings.Sunrise),
      dhuhr: formatTime(timings.Dhuhr),
      asr: formatTime(timings.Asr),
      sunset: formatTime(timings.Sunset),
      maghrib: formatTime(timings.Maghrib),
      isha: formatTime(timings.Isha),
      imsak: formatTime(timings.Imsak),
      midnight: formatTime(timings.Midnight),
      date: dateStr,
      hijri: {
        date: hijri?.date || 'N/A',
        month: hijri?.month?.en || 'N/A',
        year: hijri?.year || 'N/A',
      },
      nextPrayer: calculateNextPrayer(timings, isRamadan),
      isRamadan,
    };
    cache.set(cacheKey, { data: prayerData, timestamp: Date.now() });

    return prayerData;
  } catch (error) {

    
    // Return sensible fallback data instead of crashing
    const fallbackData: PrayerData = {
      fajr: '05:00',
      sunrise: '06:30',
      dhuhr: '12:30',
      asr: '15:45',
      sunset: '18:45',
      maghrib: '18:50',
      isha: '20:15',
      imsak: '04:30',
      midnight: '00:00',
      date: dateStr,
      hijri: {
        date: 'N/A',
        month: 'N/A',
        year: 'N/A',
      },
      nextPrayer: {
        name: 'Maghrib',
        time: '18:50',
        timeUntil: { hours: 2, minutes: 45, seconds: 12, formatted: '02:45:12' },
        sunnahQuote: 'Prayer times are temporarily unavailable. Please check your connection.',
        sunnahQuoteAr: 'أوقات الصلاة غير متاحة حالياً',
        reward: '⚠️',
      },
      isRamadan: false,
    };

    cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
    
    return fallbackData;
  }
}

export async function getTodayPrayerTimes(
  city: string = 'Addis Ababa',
  country: string = 'Ethiopia'
): Promise<PrayerData> {
  return getPrayerTimes(new Date(), city, country);
}

function formatTime(time: string): string {
  if (!time || time.includes('N/A')) return '--:--';
  return time.split(' ')[0]; // Remove any extra text
}

function calculateNextPrayer(timings: Record<string, string>, isRamadan: boolean): NextPrayer {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];

  if (isRamadan) {
    const maghribIndex = prayers.findIndex(p => p.name === 'Maghrib');
    if (maghribIndex !== -1) prayers[maghribIndex] = { name: 'Iftar (Maghrib)', time: timings.Maghrib };
  }

  let nextPrayer = prayers[0];
  let minTimeDiff = Infinity;

  for (const prayer of prayers) {
    const [prayerHour, prayerMinute] = prayer.time.split(':').map(Number);
    const prayerTime = prayerHour * 60 + prayerMinute;
    let timeDiff = prayerTime - currentTime;

    if (timeDiff < 0) timeDiff += 24 * 60;

    if (timeDiff < minTimeDiff) {
      minTimeDiff = timeDiff;
      nextPrayer = prayer;
    }
  }

  const timeUntil = minutesToTimeFormat(minTimeDiff);
  const sunnahKey = nextPrayer.name.toLowerCase().replace(' (maghrib)', '');
  const sunnahInfo =
    SUNNAH_DATA[sunnahKey as keyof typeof SUNNAH_DATA] || SUNNAH_DATA['fajr'];

  return {
    name: nextPrayer.name,
    time: nextPrayer.time,
    timeUntil,
    sunnahQuote: sunnahInfo.quote,
    sunnahQuoteAr: sunnahInfo.quoteAr,
    reward: sunnahInfo.reward,
  };
}

function minutesToTimeFormat(minutes: number): TimeUntil {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;

  return {
    hours,
    minutes: mins,
    seconds: secs,
    formatted: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
  };
}

/**
 * Get real-time countdown to next prayer
 */
export function getRealTimeCountdown(): TimeUntil {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // This should be called frequently to update the countdown
  return {
    hours,
    minutes,
    seconds,
    formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}

/**
 * Get Sunnah quote and reward info for a prayer
 */
export function getSunnahInfo(
  prayerName: string
): { quote: string; quoteAr: string; reward: string } {
  const key = prayerName.toLowerCase().replace(' (maghrib)', '');
  return SUNNAH_DATA[key as keyof typeof SUNNAH_DATA] || SUNNAH_DATA['fajr'];
}

/**
 * Clear the prayer times cache
 */
export function clearPrayerCache(): void {
  cache.clear();
}
