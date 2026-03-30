/**
 * Islamic Events Service
 * Provides real Islamic events throughout the Hijri year with Sunnah-based information
 */

import { LucideIcon, Sparkles, Moon, Heart, Zap, Gift, Flame, BookOpen, Hand } from 'lucide-react';

export interface IslamicEvent {
  date: number; // Day of Hijri month (1-30)
  label: string;
  label_ar: string;
  description: string;
  description_ar: string;
  icon: LucideIcon;
  color: string;
  significance: 'high' | 'medium' | 'low'; // For prioritization
  sunnah_tip: string;
  reward?: string;
  month?: number; // Optional: if specific to certain month, 1-12
}

// Islamic events throughout the Hijri year
const ISLAMIC_EVENTS: Record<number, IslamicEvent[]> = {
  // Muharram
  1: [
    {
      date: 1,
      label: 'Islamic New Year',
      label_ar: 'رأس السنة الهجرية',
      description: 'Beginning of the Islamic calendar year - time for renewal and reflection',
      description_ar: 'بداية السنة الهجرية - وقت التجديد والتأمل',
      icon: Zap,
      color: 'text-blue-400 bg-blue-500/10',
      significance: 'high',
      sunnah_tip: 'Increase remembrance (Dhikr) and reflection on the past year',
      reward: '🌍 Fresh start for spiritual growth',
      month: 1,
    },
    {
      date: 9,
      label: 'Day of Ashura Eve',
      label_ar: 'عشية يوم عاشوراء',
      description: 'Day of fasting with great reward - commemorates Musa (AS) deliverance',
      description_ar: 'يوم صيام فضيل - يذكر نجاة موسى عليه السلام',
      icon: Flame,
      color: 'text-orange-400 bg-orange-500/10',
      significance: 'high',
      sunnah_tip: 'Fast on 9th and 10th of Muharram for immense spiritual reward',
      reward: '⭐ Great reward and Allah\'s pleasure',
      month: 1,
    },
    {
      date: 10,
      label: 'Day of Ashura',
      label_ar: 'يوم عاشوراء',
      description: 'Most virtuous day to fast after Ramadan - expiation of past year sins',
      description_ar: 'أفضل يوم للصيام بعد رمضان - كفارة ذنوب السنة',
      icon: Heart,
      color: 'text-red-400 bg-red-500/10',
      significance: 'high',
      sunnah_tip: 'Prophet Muhammad (SAW) fasted on this day; highly recommended fast',
      reward: '🕌 Sins of previous year forgiven',
      month: 1,
    },
  ],
  // Safar
  2: [
    {
      date: 15,
      label: 'Mid-Month Blessing',
      label_ar: 'ليلة البركة',
      description: 'A blessed night - opportunity for Dua and remembrance',
      description_ar: 'ليلة من ليالي البركة - فرصة للدعاء والذكر',
      icon: Moon,
      color: 'text-gold-400 bg-gold-500/10',
      significance: 'medium',
      sunnah_tip: 'Spend time in Dua and seeking forgiveness on this night',
      reward: '🌙 Duas are more likely to be answered',
      month: 2,
    },
  ],
  // Rabi al-Awwal
  3: [
    {
      date: 12,
      label: 'Birth of Prophet Muhammad',
      label_ar: 'مولد النبي محمد صلى الله عليه وسلم',
      description: 'Celebration of the birth of our beloved Prophet (SAW) - greatest messenger',
      description_ar: 'مولد أعظم رسول - سيدنا محمد صلى الله عليه وسلم',
      icon: BookOpen,
      color: 'text-emerald-400 bg-emerald-500/10',
      significance: 'high',
      sunnah_tip: 'Increase Salawat (blessings) upon the Prophet - "Allahumma salli ala Muhammad"',
      reward: '🕯️ Each Salah brings you closer to the Prophet',
      month: 3,
    },
  ],
  // Rajab
  7: [
    {
      date: 1,
      label: 'Month of Rajab Begins',
      label_ar: 'شهر رجب',
      description: 'Sacred month - one of the four sacred months in Islam',
      description_ar: 'شهر مبارك من الأشهر الحرم',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10',
      significance: 'high',
      sunnah_tip: 'Prophet (SAW) emphasized virtues of Rajab - increase Ibadah',
      reward: '✨ Sacred month with increased spiritual rewards',
      month: 7,
    },
    {
      date: 27,
      label: 'Isra and Miraj Night',
      label_ar: 'ليلة الإسراء والمعراج',
      description: 'Night of the Prophet\'s miraculous journey to heavens',
      description_ar: 'ليلة رحلة النبي إلى السماء',
      icon: Zap,
      color: 'text-indigo-400 bg-indigo-500/10',
      significance: 'high',
      sunnah_tip: 'Engage in extra Ibadah (worship), Dua, and Quranic recitation',
      reward: '🌌 Connected to the knowledge of unseen realities',
      month: 7,
    },
  ],
  // Sha\'ban
  8: [
    {
      date: 15,
      label: 'Night of Bara\'ah',
      label_ar: 'ليلة البراءة',
      description: 'Night of forgiveness - Allah decides fate for the coming year',
      description_ar: 'ليلة القدر الثانية - تُقسم فيها الأرزاق',
      icon: Hand,
      color: 'text-cyan-400 bg-cyan-500/10',
      significance: 'high',
      sunnah_tip: 'Fast during the day and worship at night; seek Allah\'s forgiveness',
      reward: '🌟 Possible forgiveness of all sins this night',
      month: 8,
    },
  ],
  // Ramadan
  9: [
    {
      date: 1,
      label: 'Ramadan Begins',
      label_ar: 'بداية رمضان',
      description: 'Month of fasting, Quran, and spiritual excellence',
      description_ar: 'شهر الصيام والقرآن',
      icon: Moon,
      color: 'text-gold-400 bg-gold-500/10',
      significance: 'high',
      sunnah_tip: 'Recite Taraweeh prayers and read the Quran with dedication',
      reward: '🌙 Best month for deeds - Allah\'s mercy intensified',
      month: 9,
    },
    {
      date: 21,
      label: 'Odd Nights Begin',
      label_ar: 'ليالي العشر الأواخر',
      description: 'Last 10 nights - Laylatul Qadr is one of these blessed nights',
      description_ar: 'العشر الأواخر من رمضان',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-500/10',
      significance: 'high',
      sunnah_tip: 'Intensify worship, especially Tahajjud (night prayer) and Dua',
      reward: '✨ Laylatul Qadr = 1000 months of worship',
      month: 9,
    },
    {
      date: 27,
      label: 'Potential Laylatul Qadr',
      label_ar: 'ليلة القدر',
      description: 'Night of Decree - when Quran was first revealed',
      description_ar: 'الليلة التي أنزل فيها القرآن',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-500/10',
      significance: 'high',
      sunnah_tip: 'Most likely night for Laylatul Qadr - seek it in odd nights',
      reward: '👑 Worship here = 1000 months elsewhere',
      month: 9,
    },
  ],
  // Shawwal
  10: [
    {
      date: 1,
      label: 'Eid al-Fitr',
      label_ar: 'عيد الفطر',
      description: 'Festival of Breaking the Fast - celebration of completing Ramadan',
      description_ar: 'عيد الفطر السعيد',
      icon: Gift,
      color: 'text-green-400 bg-green-500/10',
      significance: 'high',
      sunnah_tip: 'Eat dates before Eid prayer; maintain spiritual consciousness after Ramadan',
      reward: '🎉 Special Khutbah and gathering with community',
      month: 10,
    },
    {
      date: 6,
      label: 'Six Days of Shawwal',
      label_ar: 'ستة أيام من شوال',
      description: 'Fasting these 6 days equals fasting entire year',
      description_ar: 'من صام ستة أيام من شوال',
      icon: Flame,
      color: 'text-orange-400 bg-orange-500/10',
      significance: 'high',
      sunnah_tip: 'Fast 6 days in Shawwal after Eid for complete year reward',
      reward: '⭐ Mathematical reward = 12 months of fasting',
      month: 10,
    },
  ],
  // Dhul-Hijjah
  12: [
    {
      date: 1,
      label: 'Dhul-Hijjah Begins',
      label_ar: 'شهر ذو الحجة',
      description: 'Month of pilgrimage - first 10 days are most virtuous',
      description_ar: 'شهر الحج والأضاحي',
      icon: Hand,
      color: 'text-rose-400 bg-rose-500/10',
      significance: 'high',
      sunnah_tip: 'Fast during first 9 days if not performing Hajj',
      reward: '🕌 Best 10 days of the year for deeds',
      month: 12,
    },
    {
      date: 8,
      label: 'Day of Tarwiyah',
      label_ar: 'يوم التروية',
      description: 'Pilgrims head to Arafat - preparation for greatest gathering',
      description_ar: 'يوم السعي الأول من الحج',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10',
      significance: 'high',
      sunnah_tip: 'If not in Hajj, fast this day for great reward',
      reward: '🕌 Connected to Hajj blessings worldwide',
      month: 12,
    },
    {
      date: 9,
      label: 'Day of Arafah',
      label_ar: 'يوم عرفة',
      description: 'Greatest day of Hajj - peak of Islamic spiritual gathering',
      description_ar: 'أعظم يوم من أيام الحج',
      icon: Heart,
      color: 'text-red-400 bg-red-500/10',
      significance: 'high',
      sunnah_tip: 'Fast on Day of Arafah if not in Hajj - sins forgiven',
      reward: '🌍 Sins of 2 years (past + future) forgiven',
      month: 12,
    },
    {
      date: 10,
      label: 'Eid al-Adha',
      label_ar: 'عيد الأضحى',
      description: 'Festival of Sacrifice - commemoration of Prophet Ibrahim\'s obedience',
      description_ar: 'عيد الأضحى المبارك',
      icon: Gift,
      color: 'text-emerald-400 bg-emerald-500/10',
      significance: 'high',
      sunnah_tip: 'Dress well, eat sacrificial meat, visit family and community',
      reward: '🎉 Greatest Eid celebration after Eid al-Fitr',
      month: 12,
    },
  ],
};

/**
 * Get upcoming Islamic events for the current or specified Hijri month
 */
export function getUpcomingIslamicEvents(hijriMonth: number, hijriYear?: number): IslamicEvent[] {
  const events = ISLAMIC_EVENTS[hijriMonth] || [];
  
  // Sort by date (closest first)
  const today = new Date().getDate();
  const filteredEvents = events.filter(e => e.date >= today);
  
  return filteredEvents.sort((a, b) => a.date - b.date);
}

/**
 * Get all events for the given Hijri month
 */
export function getMonthlyIslamicEvents(hijriMonth: number): IslamicEvent[] {
  return ISLAMIC_EVENTS[hijriMonth] || [];
}

/**
 * Get a specific event by month and date
 */
export function getEventForDate(hijriMonth: number, day: number): IslamicEvent | undefined {
  const monthEvents = ISLAMIC_EVENTS[hijriMonth];
  return monthEvents?.find(e => e.date === day);
}

/**
 * Check if tomorrow is an Islamic event
 */
export function isTomorrowIslamicEvent(current: Date, hijriMonth: number): boolean {
  const tomorrow = current.getDate() + 1;
  return ISLAMIC_EVENTS[hijriMonth]?.some(e => e.date === tomorrow) || false;
}

/**
 * Get the next upcoming Islamic event across all months
 */
export function getNextUpcomingEvent(hijriMonth: number, hijriYear: number): IslamicEvent | null {
  const currentMonthEvents = getUpcomingIslamicEvents(hijriMonth);
  if (currentMonthEvents.length > 0) {
    return currentMonthEvents[0];
  }

  // Check next month
  const nextMonth = hijriMonth === 12 ? 1 : hijriMonth + 1;
  const nextMonthEvents = ISLAMIC_EVENTS[nextMonth];
  return nextMonthEvents?.[0] || null;
}

/**
 * Get all major events for the Hijri year
 */
export function getYearlyIslamicEvents(): IslamicEvent[] {
  const allEvents: IslamicEvent[] = [];
  Object.values(ISLAMIC_EVENTS).forEach(monthEvents => {
    allEvents.push(...monthEvents.filter(e => e.significance === 'high'));
  });
  return allEvents;
}

export default {
  getUpcomingIslamicEvents,
  getMonthlyIslamicEvents,
  getEventForDate,
  isTomorrowIslamicEvent,
  getNextUpcomingEvent,
  getYearlyIslamicEvents,
};
