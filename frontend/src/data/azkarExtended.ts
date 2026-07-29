/**
 * Extended Azkar collection
 * Sources: Hisn al-Muslim (Fortress of the Muslim), Riyad as-Salihin, Sahih Bukhari & Muslim
 * References aligned with hisnmuslim.com & authentic hadith collections
 */
import { AzkarItem } from '../types';

export const AZKAR_EXTENDED: AzkarItem[] = [
  // ─── MORNING (Hisn al-Muslim) ───
  {
    id: 51, category: 'morning',
    title_en: 'Content with Allah as Religion', title_am: 'በእስልምና ላይ መرضነት',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: 'Raditu billahi Rabban, wa bil-Islami dinan, wa bi Muhammadin sallallahu alayhi wa sallama nabiyyan',
    english: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.',
    amharic: 'አላህን እንደ ጌታ፣ እስልምናን እንደ دين፣ መሐመድን ﷺ እንደ ነቢይ ተرضዬአለሁ።',
    count: 3, reference: 'Hisn al-Muslim #28 — Abu Dawud 5072', reward: 'Allah will be pleased with him on the Day of Resurrection.'
  },
  {
    id: 52, category: 'morning',
    title_en: 'Upon Natural Disposition of Islam', title_am: 'በፍጥረታዊ እስልምና',
    arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا',
    transliteration: 'Asbahna ala fitratil-Islam, wa ala kalimatil-ikhlas...',
    english: 'We have entered the morning upon the natural religion of Islam, the word of sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim — upright and Muslim.',
    amharic: 'በእስልምና ፍጥረት፣ በእውነተኝነት ቃል፣ በነቢያችን መሐመድ ﷺ دين ላይ ጠዋት ገባን።',
    count: 1, reference: 'Hisn al-Muslim #29 — Ahmad 15398'
  },
  {
    id: 53, category: 'morning',
    title_en: 'Morning Blessings Dua', title_am: 'የጠዋት بركة ዱዓ',
    arabic: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: 'Allahumma ma asbaha bi min ni\'matin aw bi ahadin min khalqika faminka wahdaka la sharika lak, falakal hamdu wa lakash shukr',
    english: 'O Allah, whatever blessing I or any of Your creation have received this morning is from You alone, without partner. So for You is all praise and to You is all gratitude.',
    amharic: 'አላህ ሆይ በዚህ ጠዋት የደረሰኝ ምንም بركة ከአንተ ብቻ ነው፤ ምስጋናና ምስጋና ለአንተ ነው።',
    count: 1, reference: 'Hisn al-Muslim #27 — Abu Dawud 5073'
  },
  {
    id: 54, category: 'morning',
    title_en: 'SubhanAllah — Creation Count', title_am: 'የፍጥረት ብዛት ተስቢህ',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi, adada khalqihi, wa rida nafsihi, wa zinata arshihi, wa midada kalimatih',
    english: 'Glory is to Allah and praise is to Him, by the number of His creation, by His pleasure, by the weight of His Throne, and by the extent of His words.',
    amharic: 'አላህን በፍጥረቱ ብዛት፣ በرضاه፣ በعرشه ክብደትና በቃላቱ ርዝመት አመስግናለሁ።',
    count: 3, reference: 'Hisn al-Muslim #54 — Muslim 2726'
  },
  {
    id: 55, category: 'morning',
    title_en: 'Tahleel — 100 Times', title_am: 'ታሕሊል 100 ጊዜ',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu, wa huwa ala kulli shay\'in qadir',
    english: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs dominion and praise, and He is over all things competent.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም፤ ምድረ መንግሥቱና ምስጋናው የእርሱ ነው።',
    count: 100, reference: 'Hisn al-Muslim #68 — Bukhari 3293; Muslim 2691', reward: 'Protection from Shaytan until evening; equivalent to freeing ten slaves.'
  },
  {
    id: 56, category: 'morning',
    title_en: 'Ya Hayyu Ya Qayyum', title_am: 'ያ ሐይሩ ያ ቃየum',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: 'Ya Hayyu Ya Qayyum, birahmatika astaghith, aslih li sha\'ni kullahu, wa la takilni ila nafsi tarfata ayn',
    english: 'O Ever-Living, O Sustainer, by Your mercy I seek help. Set right all my affairs and do not leave me to myself even for the blink of an eye.',
    amharic: 'ሕያው ሆይ! ራሱን ቻይ ሆይ! በምሕረትህ እርዳታ እጠይቃለሁ፤ ጉዳዬን ሁሉ አስተካክል።',
    count: 1, reference: 'Hisn al-Muslim #79 — Hakim 1/545; authenticated'
  },
  {
    id: 57, category: 'morning',
    title_en: 'Seeking Wellness', title_am: 'صحت መጠየቅ',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma afini fi badani, Allahumma afini fi sam\'i, Allahumma afini fi basari, la ilaha illa ant',
    english: 'O Allah, grant me wellness in my body. O Allah, grant me wellness in my hearing. O Allah, grant me wellness in my sight. None has the right to be worshipped except You.',
    amharic: 'አላህ ሆይ በሰውነቴ፣ በመስማቴ፣ በראיቴ صحت ስጠኝ።',
    count: 3, reference: 'Hisn al-Muslim #31 — Abu Dawud 5090'
  },
  {
    id: 58, category: 'morning',
    title_en: 'Hasbiyallah', title_am: 'ሐስቢያላህ',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'Hasbiyallahu la ilaha illa huwa, alayhi tawakkaltu wa huwa Rabbul arshil adheem',
    english: 'Allah is sufficient for me. None has the right to be worshipped except Him. I have placed my trust in Him, and He is the Lord of the Magnificent Throne.',
    amharic: 'አላህ ለእኔ በቂ ነው፤ በእርሱ ተደገጀሁ፤ እርሱ የታላቁ عرش ጌታ ነው።',
    count: 7, reference: 'Hisn al-Muslim #88 — Quran 9:129; Abu Dawud 5081', reward: 'Allah will suffice whoever says it seven times.'
  },

  // ─── EVENING ───
  {
    id: 59, category: 'evening',
    title_en: 'Evening — Content with Allah', title_am: 'ምሽት — በአላህ መرضነት',
    arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
    transliteration: 'Raditu billahi Rabban, wa bil-Islami dinan, wa bi Muhammadin nabiyyan',
    english: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad ﷺ as my Prophet.',
    amharic: 'አላህን እንደ ጌታ፣ እስልምናን እንደ دين፣ መሐመድን ﷺ እንደ ነቢይ ተرضዬአለሁ።',
    count: 3, reference: 'Hisn al-Muslim #28 — Abu Dawud 5072'
  },
  {
    id: 60, category: 'evening',
    title_en: 'Evening Blessings Dua', title_am: 'የምሽት بركة',
    arabic: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
    transliteration: 'Allahumma ma amsa bi min ni\'matin...',
    english: 'O Allah, whatever blessing I or any of Your creation have received this evening is from You alone, without partner. For You is all praise and gratitude.',
    amharic: 'አላህ ሆይ በዚህ ምሽት የደረሰኝ بركة ከአንተ ብቻ ነው።',
    count: 1, reference: 'Hisn al-Muslim #27 — Abu Dawud 5073'
  },
  {
    id: 61, category: 'evening',
    title_en: 'Evening Tahleel — 100x', title_am: 'ምሽት ታሕሊል',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah...',
    english: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs dominion and praise.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም።',
    count: 100, reference: 'Hisn al-Muslim #68 — Bukhari 3293', reward: 'Protection from Shaytan until morning.'
  },
  {
    id: 62, category: 'evening',
    title_en: 'Amsayna upon Islam', title_am: 'በእስልምና ምሽት',
    arabic: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    transliteration: 'Amsayna ala fitratil-Islam...',
    english: 'We have entered the evening upon the natural religion of Islam, the word of sincerity, and the religion of our Prophet Muhammad ﷺ.',
    amharic: 'በእስልምና ፍጥረት ላይ ምሽት ገባን።',
    count: 1, reference: 'Hisn al-Muslim #29 — Ahmad 15398'
  },
  {
    id: 63, category: 'evening',
    title_en: 'Seeking Forgiveness — 100x', title_am: '100x እርምታ',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullaha wa atubu ilayh',
    english: 'I seek forgiveness from Allah and repent to Him.',
    amharic: 'ከአላህ ይቅርታ እጠይቃለሁ፤ ወደ እርሱም እመለሳለሁ።',
    count: 100, reference: 'Hisn al-Muslim #73 — Bukhari 6307'
  },

  // ─── AFTER PRAYER ───
  {
    id: 64, category: 'after_prayer',
    title_en: 'SubhanAllah After Salah', title_am: 'ከصلat በኋላ ሱብሃ',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'SubhanAllah',
    english: 'Glory is to Allah.',
    amharic: 'አላህን ከכל ክፋት የሚያጸድቅ።',
    count: 33, reference: 'Hisn al-Muslim #84 — Bukhari 5362; Muslim 597'
  },
  {
    id: 65, category: 'after_prayer',
    title_en: 'Alhamdulillah After Salah', title_am: 'ከصلat በኋላ ሐምድ',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    english: 'All praise is due to Allah.',
    amharic: 'ምስጋና ለአላህ ይገባው።',
    count: 33, reference: 'Hisn al-Muslim #84 — Bukhari 5362; Muslim 597'
  },
  {
    id: 66, category: 'after_prayer',
    title_en: 'Allahu Akbar After Salah', title_am: 'ከصلat በኋላ አክበር',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    english: 'Allah is the Greatest.',
    amharic: 'አላህ ታላቅ ነው።',
    count: 34, reference: 'Hisn al-Muslim #84 — Bukhari 5362; Muslim 597', reward: 'Sins forgiven even if like the foam of the sea.'
  },
  {
    id: 67, category: 'after_prayer',
    title_en: 'Dua After Salah', title_am: 'ከصلat በኋላ ዱዓ',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allahumma a\'inni ala dhikrika, wa shukrika, wa husni ibadatik',
    english: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.',
    amharic: 'አላህ ሆይ እንድ አስታውስህ፣ እንድናመስግንህ፣ በጥሩ ሁኔታ እንድአምርህ ስጠኝ።',
    count: 1, reference: 'Hisn al-Muslim #86 — Abu Dawud 1522; Nasai 1300'
  },
  {
    id: 68, category: 'after_prayer',
    title_en: 'La ilaha illallah After Salah', title_am: 'ከصلat ታሕሊል',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah...',
    english: 'None has the right to be worshipped except Allah alone... O Allah, none can withhold what You give, and none can give what You withhold.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም። አንተ የሰጥኸውን ማንም አይከለክልም።',
    count: 1, reference: 'Hisn al-Muslim #85 — Bukhari 844; Muslim 593', reward: 'Equivalent to freeing a slave from the children of Ismail.'
  },

  // ─── SLEEP ───
  {
    id: 69, category: 'sleep',
    title_en: 'Dust Your Bed', title_am: 'አልጋ ማጽዳት',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: 'Bismika Rabbi wada\'tu janbi, wa bika arfa\'uh...',
    english: 'In Your name, my Lord, I lay my side down, and by You I raise it. If You take my soul, have mercy on it; if You release it, protect it as You protect Your righteous servants.',
    amharic: 'በስምህ ጌታዬ አልጋን አ laid down፤ ነፍሴን ከወሰድኸ ምሕርት አድርገል።',
    count: 1, reference: 'Hisn al-Muslim #97 — Bukhari 6320; Muslim 2714'
  },
  {
    id: 70, category: 'sleep',
    title_en: 'Last Two Ayahs of Al-Baqarah', title_am: 'آخر آيتين من البقرة',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ... (آخر آيتين من سورة البقرة)',
    transliteration: 'Aamanar Rasulu bima unzila ilayhi min Rabbihi... (last 2 ayahs of Surah Al-Baqarah)',
    english: 'The Messenger has believed in what was revealed to him from his Lord... (Recite the last two verses of Surah Al-Baqarah.)',
    amharic: 'መልክተኛው ከጌቱ የተላከለትን አምኗል። የአል-ባቃራህ ሱራ آخر آyትን አንብብ።',
    count: 1, reference: 'Hisn al-Muslim #96 — Bukhari 5009; Muslim 807', reward: 'They will suffice him (against all evil).'
  },
  {
    id: 71, category: 'sleep',
    title_en: 'Sleeping Tasbeeh', title_am: 'ከመተኛት ተስቢህ',
    arabic: 'سُبْحَانَ اللَّهِ (33) — الْحَمْدُ لِلَّهِ (33) — اللَّهُ أَكْبَرُ (34)',
    transliteration: 'SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34',
    english: 'Glory be to Allah 33 times, Praise be to Allah 33 times, Allah is Greatest 34 times.',
    amharic: 'ሱብሃ 33፣ ሐምድ 33፣ አክበር 34።',
    count: 100, reference: 'Hisn al-Muslim #84 — Bukhari 5362'
  },
  {
    id: 72, category: 'sleep',
    title_en: 'Al-Ikhlas Before Sleep', title_am: 'ከመተኛት ኢኽላስ',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul Huwallahu Ahad',
    english: 'Say: He is Allah, the One. (Recite Surah Al-Ikhlas)',
    amharic: 'በል፡ እርሱ አላህ አንድ ነው። (ሱረቱል ኢኽላስ)',
    count: 3, reference: 'Hisn al-Muslim #95 — Bukhari 5017', reward: 'Recite the three Quls and blow — protection from everything.'
  },

  // ─── DAILY LIFE (Hisn al-Muslim) ───
  {
    id: 73, category: 'daily',
    title_en: 'Before Wudu', title_am: 'ከውudu በፊት',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    english: 'In the name of Allah.',
    amharic: 'በአላህ ስም።',
    count: 1, reference: 'Hisn al-Muslim #4 — Abu Dawud 101; Tirmidhi 2658'
  },
  {
    id: 74, category: 'daily',
    title_en: 'After Wudu Shahada', title_am: 'ከውudu በኋላ',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ashhadu an la ilaha illallahu wahdahu la sharika lah, wa ashhadu anna Muhammadan abduhu wa rasuluh',
    english: 'I bear witness that none has the right to be worshipped except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም ብዬ እመሰክራለሁ፤ መሐመድ ባሪያውና መልእክተኛው ነው ብዬም እመሰክራለሁ።',
    count: 1, reference: 'Hisn al-Muslim #6 — Muslim 234; Tirmidhi 358'
  },
  {
    id: 75, category: 'daily',
    title_en: 'After Wudu Dua', title_am: 'ከውudu ዱዓ',
    arabic: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ',
    transliteration: 'Allahummaj\'alni minat tawwabina waj\'alni minal mutatahhirin',
    english: 'O Allah, make me among those who repent and make me among those who purify themselves.',
    amharic: 'አላህ ሆይ ከሚመለሱትና ከሚጽዱት መካከል አድርገኝ።',
    count: 1, reference: 'Hisn al-Muslim #7 — Tirmidhi 55'
  },
  {
    id: 76, category: 'daily',
    title_en: 'Entering the Bathroom', title_am: 'ወደ መጸዳጃ ቤት',
    arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Bismillah, Allahumma inni a\'udhu bika minal khubuthi wal khaba\'ith',
    english: 'In the name of Allah. O Allah, I seek refuge in You from evil and evil ones (male and female devils).',
    amharic: 'በአላህ ስም፤ ከክፉና ክፉዎች እጠበቃለሁ።',
    count: 1, reference: 'Hisn al-Muslim #1 — Bukhari 142; Muslim 375'
  },
  {
    id: 77, category: 'daily',
    title_en: 'Leaving the Bathroom', title_am: 'ከመጸዳጃ ቤት',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak',
    english: 'I seek Your forgiveness.',
    amharic: 'ይቅርታህን እጠይቃለሁ።',
    count: 1, reference: 'Hisn al-Muslim #2 — Tirmidhi 358; Abu Dawud 30'
  },
  {
    id: 78, category: 'daily',
    title_en: 'Entering the Market', title_am: 'ወደ ገበያ',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu, yuhyi wa yumit...',
    english: 'None has the right to be worshipped except Allah alone... He gives life and causes death, and He is Ever-Living and does not die. In His hand is all good.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም፤ ሕያው ነው፤ አይሞትም።',
    count: 1, reference: 'Hisn al-Muslim #19 — Tirmidhi 3428; Ibn Majah 2235', reward: 'A million good deeds recorded; a million bad deeds wiped.'
  },
  {
    id: 79, category: 'daily',
    title_en: 'When It Rains', title_am: 'ሲዘንብ',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    transliteration: 'Allahumma sayyiban nafi\'an',
    english: 'O Allah, make it a beneficial rain.',
    amharic: 'አላህ ሆይ ጠቃሚ ዝናብ አድርገው።',
    count: 1, reference: 'Hisn al-Muslim #20 — Bukhari 1032'
  },
  {
    id: 80, category: 'daily',
    title_en: 'During Thunder', title_am: 'በመጥለቅ',
    arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
    transliteration: 'Subhanal-ladhi yusabbihur ra\'du bihamdihi wal mala\'ikatu min khifatih',
    english: 'Glory is to Him whom the thunder glorifies with His praise, and the angels out of fear of Him.',
    amharic: 'ራዖን በምስጋናው የሚያመስግነውን (አላህን) አከብራለሁ።',
    count: 1, reference: 'Hisn al-Muslim #21 — Mawatta Malik 2/922'
  },
  {
    id: 81, category: 'daily',
    title_en: 'For the Traveler', title_am: 'ለጉዞ',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
    transliteration: 'Allahumma inna nas\'aluka fi safarina hadhal birra wat taqwa...',
    english: 'O Allah, we ask You on this journey of ours for righteousness and piety, and deeds that please You. O Allah, make this journey easy for us and shorten its distance.',
    amharic: 'አላህ ሆይ በዚህ ጉዞ ጽድቅና ተቀራርቦ እንጠይቃለን፤ ጉዞውን ቀላል አድርገው።',
    count: 1, reference: 'Hisn al-Muslim #17 — Muslim 1342'
  },
  {
    id: 82, category: 'daily',
    title_en: 'When Angry', title_am: 'ሲበሳ',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A\'udhu billahi minash shaytanir rajim',
    english: 'I seek refuge in Allah from the accursed Satan.',
    amharic: 'ከሰይጣን እጠበቃለሁ።',
    count: 1, reference: 'Hisn al-Muslim #64 — Bukhari 3282; Abu Dawud 4784', reward: 'Anger will leave him.'
  },
  {
    id: 83, category: 'daily',
    title_en: 'When Hearing Good News', title_am: 'ደስተኛ ዜና',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
    transliteration: 'Alhamdulillahil-ladhi bini\'matihi tatimmus salihat',
    english: 'All praise is due to Allah by whose grace good deeds are completed.',
    amharic: 'በنعمته ጥሩ ነገሮች የሚጠናቀቁበት (አላህ) ምስጋና ይገባው።',
    count: 1, reference: 'Hisn al-Muslim #65 — Ibn Majah 3803'
  },
  {
    id: 84, category: 'daily',
    title_en: 'When Something Bad Happens', title_am: 'ክፉ ነገር ሲፈጠር',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي، وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    transliteration: 'Inna lillahi wa inna ilayhi raji\'un, Allahumma\'jurni fi musibati wa akhlif li khayran minha',
    english: 'Indeed we belong to Allah, and indeed to Him we will return. O Allah, reward me in my affliction and replace it with something better.',
    amharic: 'እውነትም ለአላህ ነን፤ ወደ እርሱም እንመለሳለን።',
    count: 1, reference: 'Hisn al-Muslim #66 — Muslim 918'
  },
  {
    id: 85, category: 'daily',
    title_en: 'Visiting the Sick', title_am: 'ታመም ሲጎበኝ',
    arabic: 'لَا بَأْسَ، طَهُورٌ إِنْ شَاءَ اللَّهُ',
    transliteration: 'La ba\'sa, tahurun in sha Allah',
    english: 'No harm, it is a purification, if Allah wills.',
    amharic: 'ጥፋት የለም፤ አላህ ከፈቀደ ጥራት ነው።',
    count: 1, reference: 'Hisn al-Muslim #67 — Bukhari 3616'
  },
  {
    id: 86, category: 'daily',
    title_en: 'Congratulating Newlyweds', title_am: 'ለ新婚',
    arabic: 'بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    transliteration: 'Barakallahu laka, wa baraka alayka, wa jama\'a baynakuma fi khayr',
    english: 'May Allah bless you, and shower blessings upon you, and join you together in goodness.',
    amharic: 'አላህ ይبركልህ፤ በጥሩ ነገር ይሰብስባችሁ።',
    count: 1, reference: 'Hisn al-Muslim #71 — Abu Dawud 2130; Tirmidhi 1091'
  },
  {
    id: 87, category: 'daily',
    title_en: 'When Adhan Is Heard', title_am: 'አዳን ሲሰማ',
    arabic: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ',
    transliteration: 'Allahumma Rabba hadhihid da\'watit tammah...',
    english: 'O Allah, Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the praised station You promised him.',
    amharic: 'አላህ ሆይ! ለመሐመድ ﷺ ሽብራትና ፍሬ ስጠው።',
    count: 1, reference: 'Hisn al-Muslim #8 — Bukhari 614'
  },
  {
    id: 88, category: 'daily',
    title_en: 'After Adhan', title_am: 'ከአዳን በኋላ',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allahumma salli ala Muhammadin wa ala ali Muhammad...',
    english: 'O Allah, send prayers upon Muhammad and the family of Muhammad, as You sent prayers upon Ibrahim and the family of Ibrahim. Indeed You are Praiseworthy, Glorious.',
    amharic: 'አላህ ሆይ! በመሐመድ ﷺና በቤተሰቡ ላይ ስላት (صلat) አድርግ።',
    count: 1, reference: 'Hisn al-Muslim #9 — Bukhari 3370'
  },

  // ─── RAMADAN ───
  {
    id: 89, category: 'ramadan',
    title_en: 'When Seeing the Crescent', title_am: 'ሲrescent',
    arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ',
    transliteration: 'Allahumma ahillahu alayna bil yumni wal iman, was salamati wal Islam, Rabbi wa Rabbukallah',
    english: 'O Allah, bring it over us with blessing, faith, safety, and Islam. My Lord and your Lord is Allah.',
    amharic: 'አላህ ሆይ! በبركة፣ በእምነት፣ በسلامةና በእስልምና ላይ አምጣው።',
    count: 1, reference: 'Hisn al-Muslim #142 — Tirmidhi 3451; Daraqutni 2/179'
  },
  {
    id: 90, category: 'ramadan',
    title_en: 'Dua at Iftar Time', title_am: 'በኢፍታር',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي',
    transliteration: 'Allahumma inni as\'aluka birahmatikal-lati wasi\'at kulla shay\'in an taghfira li',
    english: 'O Allah, I ask You by Your mercy which encompasses all things, that You forgive me.',
    amharic: 'አላህ ሆይ በሁሉን የሚያስፈፅም ምሕርትህን በመጠቀም ይቅር ብለል።',
    count: 1, reference: 'Hisn al-Muslim #145 — Ibn Majah 1753'
  },
  {
    id: 91, category: 'ramadan',
    title_en: 'Zakat & Charity Dua', title_am: 'ለصدقة',
    arabic: 'اللَّهُمَّ اجْعَلْهَا مَغْنَمًا وَلَا تَجْعَلْهَا مَغْرَمًا',
    transliteration: 'Allahummaj\'alha maghnam wa la taj\'alha maghraman',
    english: 'O Allah, make it (this charity) a gain and do not make it a loss.',
    amharic: 'አላህ ሆይ! ጥሩ ነገር አድርገው፤ ክፉ ነገር አድርገው።',
    count: 1, reference: 'Hisn al-Muslim #146 — Tabarani 912'
  },

  // ─── PROTECTION ───
  {
    id: 92, category: 'protection',
    title_en: 'Dua of Yunus — Distress', title_am: 'የ distress ዱዓ',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minadh dhalimin',
    english: 'None has the right to be worshipped except You. Glory is to You. Indeed, I have been of the wrongdoers.',
    amharic: 'ከአንተ በስተቀር አምልኮ የለም፤ አንተን አከብራለሁ፤ እኔ ከظالمين ነበርኩ።',
    count: 1, reference: 'Hisn al-Muslim #120 — Quran 21:87; Tirmidhi 3505', reward: 'Allah answers the distressed who calls with this dua.'
  },
  {
    id: 93, category: 'protection',
    title_en: 'Protection for Children', title_am: 'ለልጆች መከላከlia',
    arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration: 'U\'idhukuma bi kalimatillahit tammati, min kulli shaytanin wa hammah, wa min kulli aynin lammah',
    english: 'I seek protection for you both in the perfect words of Allah from every devil and poisonous creature, and from every evil eye.',
    amharic: 'በአላህ ፍጹም ቃላት ከሰይጣንና ከبد العين እጠብቃችሁ።',
    count: 1, reference: 'Hisn al-Muslim #122 — Bukhari 3371', reward: 'The Prophet ﷺ used this for Hasan and Husayn.'
  },
  {
    id: 94, category: 'protection',
    title_en: 'Before Intimacy', title_am: 'መከላከlia',
    arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ، وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا',
    transliteration: 'Bismillah, Allahumma jannibnash shaytan, wa jannibish shaytana ma razaqtana',
    english: 'In the name of Allah. O Allah, keep Shaytan away from us and keep Shaytan away from what You bestow upon us.',
    amharic: 'በአላህ ስም፤ ሰይጣንን ከእኛና ከምንዳህ ያርቀنا።',
    count: 1, reference: 'Hisn al-Muslim #123 — Bukhari 141; Muslim 1434', reward: 'Shaytan will never harm the child born from it.'
  },
  {
    id: 95, category: 'protection',
    title_en: 'Fear & Anxiety', title_am: 'ፍርሃት',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal wakeel',
    english: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
    amharic: 'አላህ ለእኛ በቂ ነው፤ እርሱም ምርጥ ተጠሪቀ ነው።',
    count: 7, reference: 'Hisn al-Muslim #88 — Quran 3:173', reward: 'Allah is sufficient for those who trust in Him.'
  },
  {
    id: 96, category: 'protection',
    title_en: 'Morning & Evening — 3 Quls', title_am: 'ሦስቱ Quls',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ — قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ — قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Surah Al-Ikhlas, Al-Falaq, An-Nas — 3 times each',
    english: 'Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas — three times each morning and evening.',
    amharic: 'ሱረቱል ኢኽላስ፣ አል-ፈለቅ፣ አን-ናስ — ሦስት ጊዜ ለ각각።',
    count: 3, reference: 'Hisn al-Muslim #74 — Abu Dawud 5082; Tirmidhi 3575', reward: 'They will suffice you against everything.'
  },
  {
    id: 97, category: 'protection',
    title_en: 'Against Evil Eye — Ruqyah', title_am: 'ከبد العين',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration: 'A\'udhu bi kalimatillahit tammati min kulli shaytanin wa hammah, wa min kulli aynin lammah',
    english: 'I seek refuge in the perfect words of Allah from every devil, poisonous creature, and evil eye.',
    amharic: 'በአላህ ፍጹም ቃላት ከሰይጣንና ከبد العين እጠበቃለሁ።',
    count: 3, reference: 'Hisn al-Muslim #121 — Bukhari 3371'
  },
  {
    id: 98, category: 'protection',
    title_en: 'When Afraid at Night', title_am: 'በሌሊት ፍርሃት',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ، وَشَرِّ عِبَادِهِ، وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ',
    transliteration: 'A\'udhu bi kalimatillahit tammati min ghadabihi wa iqabihi, wa sharri ibadihi, wa min hamazatish shayatin wa an yahdurun',
    english: 'I seek refuge in the perfect words of Allah from His anger, punishment, the evil of His servants, and from the whispers of devils.',
    amharic: 'በአላህ ፍጹም ቃላት ከቁጣው፣ ከعقابውና ከሰይጣን እጠበቃለሁ።',
    count: 1, reference: 'Hisn al-Muslim #119 — Abu Dawud 3893'
  },

  // ─── AFTER PRAYER extras ───
  {
    id: 99, category: 'after_prayer',
    title_en: 'Seeking Knowledge Dua', title_am: 'እውቀት',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allahumma inni as\'aluka ilman nafi\'an, wa rizqan tayyiban, wa amalan mutaqabbalan',
    english: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.',
    amharic: 'አላህ ሆይ ጠቃሚ እውቀት፣ ጥሩ ምግብና ተቀባይነት ያለው ስራ እጠይቃለሁ።',
    count: 1, reference: 'Hisn al-Muslim #89 — Ibn Majah 925; Ibn Hibban 974'
  },
  {
    id: 100, category: 'after_prayer',
    title_en: 'Dua Between Adhan & Iqamah', title_am: 'በአዳንና ኢቃማ መካከል',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي',
    transliteration: 'Allahumma inni as\'aluka birahmatikal-lati wasi\'at kulla shay\'in an taghfira li',
    english: 'O Allah, I ask You by Your mercy which encompasses all things, that You forgive me.',
    amharic: 'አላህ ሆይ በምሕርትህ ይቅር ብለል።',
    count: 1, reference: 'Hisn al-Muslim #10 — Tirmidhi 359; Abu Dawud 521', reward: 'Dua between Adhan and Iqamah is not rejected.'
  },
];
