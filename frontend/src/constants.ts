import { Surah, AzkarItem, PrayerTime } from './types';

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

export const AZKAR: AzkarItem[] = [
  {
    id: 1,
    category: "morning",
    title_en: "Best Dua for Forgiveness",
    title_am: "ምርጥ የእርምጃ ዱዓ",
    arabic: "اللّهـمَّ أَنْتَ رَبِّـي لا إلهَ إلاّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    english: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I am faithful to Your covenant and my promise to You as much as I can. I seek refuge in You from all the evil I have practiced. I acknowledge before You all the blessings You have bestowed upon me, and I confess to You all my sins. So forgive me, for none can forgive sins except You.",
    amharic: "አላህ ሆይ አንተ ጌታዬ ነህ፣ ከአንተ በስተቀር የሚገባ አምልኮ የለም። ፈጠርከኝ እኔም ባሪያህ ነኝ፣ እኔም በቃል ኪዳንህና በተስፋህ ላይ የቻልኩትን ያህል እጸናለሁ። ከሠራሁት ክፉ ነገር ሁሉ በአንተ እጠበቃለሁ። በኔ ላይ የዋልከውን ጸጋህን አምናለሁ፣ ኃጢአቴንም እመሰክራለሁ። ስለዚህ ማረኝ፣ ከአንተ በስተቀር ኃጢአትን የሚምር የለምና።",
    count: 1,
    reference: "Hisn al-Muslim"
  },
  {
    id: 2,
    category: "morning",
    title_en: "Protection from Harm",
    title_am: "ከክፉ ነገር መከላከያ",
    arabic: "بِسْمِ اللهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    english: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is the All-Hearing, the All-Knowing.",
    amharic: "በአላህ ስም፤ በስሙ በምድርም ሆነ በሰማይ ምንም ነገር የማይጎዳው፤ እርሱም ሰሚውና አዋቂው ነው።",
    count: 3
  },
  {
    id: 3,
    category: "evening",
    title_en: "Evening Protection",
    title_am: "የምሽት መከላከያ",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    english: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    amharic: "በአላህ ፍጹም ቃላት ከፈጠረው ነገር ሁሉ ክፋት እጠበቃለሁ።",
    count: 3
  },
  {
    id: 4,
    category: "after_prayer",
    title_en: "Tasbeeh After Prayer",
    title_am: "ከተሰገደ በኋላ የሚባል ተስቢህ",
    arabic: "سُبْحَانَ اللَّهِ (33) - الْحَمْدُ لِلَّهِ (33) - اللَّهُ أَكْبَرُ (34)",
    english: "SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x",
    amharic: "ሱብሃነላህ 33 ጊዜ፣ አልሃምዱሊላህ 33 ጊዜ፣ አላሁ አክበር 34 ጊዜ",
    count: 100
  },
  {
    id: 5,
    category: "after_prayer",
    title_en: "Ayat al-Kursi",
    title_am: "አያተል ኩርሲ",
    arabic: "اللّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلاَّ بِمَا شَاء وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    english: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    amharic: "አላህ ከእርሱ በስተቀር ሌላ አምላክ የለም፤ ሕያው ራሱን ቻይ ነው፤ ማንቀላፋትም ሆነ እንቅልፍ አይይዘውም፤ በሰማያትና በምድር ያለው ሁሉ የእርሱ ነው፤ ያ በእርሱ ዘንድ በፈቃዱ ቢሆን እንጅ የሚማልድ ማነው? በፊታቸው ያለውንና ከኋላቸው ያለውን ሁሉ ያውቃል፤ ከእውቀቱም በሻው ነገር እንጅ በምንም ነገር አያካብቡም፤ መንበሩ ሰማያትንና ምድርን ሰፋ፤ ጥበቃቸውም አያቅተውም፤ እርሱም የላቀ ታላቅ ነው፡፡",
    count: 1
  },
  {
    id: 6,
    category: "sleep",
    title_en: "Last 3 Surahs",
    title_am: "የመጨረሻዎቹ 3 ሱራዎች",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ - قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ - قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    english: "Surah Al-Ikhlas, Al-Falaq, An-Nas",
    amharic: "ሱረቱል ኢኽላስ፣ አል-ፈለቅ፣ አን-ናስ",
    count: 3
  },
  {
    id: 7,
    category: "sleep",
    title_en: "Before Sleeping",
    title_am: "ከመተኛት በፊት",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    english: "In Your name, O Allah, I die and I live",
    amharic: "አላህ ሆይ በስምህ እሞታለሁ (እተኛለሁ) እኖራለሁም (እነቃለሁም)።",
    count: 1
  },
  {
    id: 8,
    category: "ramadan",
    title_en: "Dua for Breaking Fast",
    title_am: "ጾም ሲፈታ የሚደረግ ዱዓ",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    english: "The thirst has gone and the veins are quenched, and reward is confirmed, if Allah wills.",
    amharic: "ጥማቱ ሄደ፤ የደም ስሮች ረጠቡ፤ አላህ ከፈቀደ ምንዳውም ተረጋገጠ።",
    count: 1
  },
  {
    id: 9,
    category: "daily",
    title_en: "Entering Home",
    title_am: "ወደ ቤት ሲገባ",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",
    english: "In the name of Allah we enter, and in the name of Allah we go out, and upon our Lord we rely.",
    amharic: "በአላህ ስም ገባን፤ በአላህ ስም ወጣን፤ በጌታችንም ላይ ተመካን።",
    count: 1
  },
  {
    id: 10,
    category: "protection",
    title_en: "Healing Dua",
    title_am: "የፈውስ ዱዓ",
    arabic: "أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لا شِفَاءَ إِلا شِفَاؤُكَ، شِفَاءً لا يُغَادِرُ سَقَمًا",
    english: "Remove the harm, Lord of mankind, and heal, You are the Healer. There is no healing but Your healing, a healing which leaves no disease behind.",
    amharic: "የሰዎች ጌታ ሆይ! ህመሙን አስወግድ፤ አንተ ፈዋሽ ነህና ፈውሰው፤ ከአንተ ፈውስ ውጭ ሌላ ፈውስ የለም፤ ህመምን የማይተው ፈውስን (ፈውሰው)።",
    count: 1
  }
];

export const PRAYER_TIMES: PrayerTime[] = [
  { name: "Fajr", time: "05:12", icon: "Sunrise" },
  { name: "Dhuhr", time: "12:34", icon: "Sun" },
  { name: "Asr", time: "15:56", icon: "CloudSun" },
  { name: "Maghrib", time: "18:45", icon: "Sunset" },
  { name: "Isha", time: "20:01", icon: "Moon" },
];
