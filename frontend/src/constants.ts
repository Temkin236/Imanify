import { Surah, PrayerTime } from './types';

export const SURAHS: Surah[] = [
  {
    id: 1,
    name: "الفاتحة",
    englishName: "Al-Fatiha",
    versesCount: 7,
    revelationType: "Meccan",
    verses: [
      { id: 1, number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", amharic: "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው፡፡" },
      { id: 2, number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", english: "[All] praise is [due] to Allah, Lord of the worlds -", amharic: "ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው፤" },
      { id: 3, number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", english: "The Entirely Merciful, the Especially Merciful,", amharic: "እጅግ በጣም ሩኅሩህ በጣም አዛኝ ለሆነው፤" },
      { id: 4, number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", english: "Sovereign of the Day of Recompense.", amharic: "የፍርዱ ቀን ባለቤት ለሆነው፡፡" },
      { id: 5, number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", english: "It is You we worship and You we ask for help.", amharic: "አንተን ብቻ እንግዛለን፤ አንተንም ብቻ እርዳታን እንለምናለን፡፡" },
      { id: 6, number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", english: "Guide us to the straight path -", amharic: "ቀጥተኛውን መንገድ ምራን፤" },
      { id: 7, number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", english: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", amharic: "የነዚያን በነርሱ ላይ ጸጋህን የለገስክላቸውን መንገድ፤ በነርሱ ላይ ያልተቆጣህባቸውንና ያልተሳሳቱትንም መንገድ (ምራን)፡፡" },
    ]
  },
  {
    id: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    versesCount: 4,
    revelationType: "Meccan",
    verses: [
      { id: 1, number: 1, arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", english: "Say, \"He is Allah, [who is] One,", amharic: "በል፡ እርሱ አላህ አንድ ነው፡፡" },
      { id: 2, number: 2, arabic: "اللَّهُ الصَّمَدُ", english: "Allah, the Eternal Refuge.", amharic: "አላህ (የሁሉ) መጠጊያ ነው፡፡" },
      { id: 3, number: 3, arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ", english: "He neither begets nor is born,", amharic: "አልወለደም፤ አልተወለደምም፡፡" },
      { id: 4, number: 4, arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", english: "Nor is there to Him any equivalent.\"", amharic: "ለእርሱም አንድም ቢጤ የለውም፡፡" },
    ]
  }
];

export { AZKAR, AZKAR_CATEGORIES } from './data/azkarData';

export const PRAYER_TIMES: PrayerTime[] = [
  { name: "Fajr", time: "05:12", icon: "Sunrise" },
  { name: "Dhuhr", time: "12:34", icon: "Sun" },
  { name: "Asr", time: "15:56", icon: "CloudSun" },
  { name: "Maghrib", time: "18:45", icon: "Sunset" },
  { name: "Isha", time: "20:01", icon: "Moon" },
];
