import { AzkarItem } from '../types';
import { AZKAR_EXTENDED } from './azkarExtended';

export const AZKAR: AzkarItem[] = [
  // ─── MORNING (8) ───
  {
    id: 1, category: 'morning',
    title_en: 'Sayyid al-Istighfar', title_am: 'ምርጥ የእርምጃ ዱዓ',
    arabic: 'اللّهُمَّ أَنْتَ رَبِّي لا إلهَ إلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لا يَغْفِرُ الذُّنُوبَ إِلا أَنْتَ',
    transliteration: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana abduka...',
    english: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant. I am faithful to Your covenant as much as I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings and confess my sins. Forgive me, for none forgives sins except You.',
    amharic: 'አላህ ሆይ አንተ ጌታዬ ነህ፣ ከአንተ በስተቀር አምልኮ የለም። ፈጠርኸኝ እኔም ባሪያህ ነኝ። ኃጢአቴን አምናለሁ፣ ስለዚህ ማረኝ።',
    count: 1, reference: 'Sahih al-Bukhari 6306', reward: 'Whoever says it with conviction in the morning and dies that day enters Paradise.'
  },
  {
    id: 2, category: 'morning',
    title_en: 'Morning Renewal', title_am: 'የጠዋት መጀመሪያ',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ',
    transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah...',
    english: 'We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without partner.',
    amharic: 'ጠዋት ላይ መጣን፤ ምድረ መንግሥቱ ለአላህ ነው። ምስጋና ለአላህ ይገባው።',
    count: 1, reference: 'Muslim', reward: 'Protection and blessing for the entire day.'
  },
  {
    id: 3, category: 'morning',
    title_en: 'Protection from Harm', title_am: 'ከክፉ ነገር መከላከያ',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\'i...',
    english: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    amharic: 'በአላህ ስም፤ በስሙ በምድርም ሆነ በሰማይ ምንም ነገር የማይጎዳው።',
    count: 3, reference: 'Sunan Abu Dawud 5088; Jami\' at-Tirmidhi 3388', reward: 'Nothing will harm you until evening.'
  },
  {
    id: 4, category: 'morning',
    title_en: 'SubhanAllah & Praise', title_am: 'ሱብሃነላህ',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    english: 'Glory is to Allah and praise is to Him.',
    amharic: 'አላህን ከכל ክፋት የሚያጸድቅ እና እንደሚገባው የሚያመሰግን ነው።',
    count: 100, reference: 'Bukhari & Muslim', reward: 'Sins forgiven even if like the foam of the sea.'
  },
  {
    id: 5, category: 'morning',
    title_en: 'Morning Protection', title_am: 'የጠዋት መከላከያ',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu...',
    english: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
    amharic: 'አላህ ሆይ በአንተ ጠዋት መጣን፤ በአንተም ምሽት መጣን፤ በአንተ እንኖራለን፤ ወደ አንተም ትንሳኤ ነው።',
    count: 1, reference: 'Tirmidhi'
  },
  {
    id: 6, category: 'morning',
    title_en: 'Seeking Goodness', title_am: 'ጥሩ ነገር መጠየቅ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ، فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ',
    transliteration: 'Allahumma inni as\'aluka khayra hadhal-yawm, fathahu wa nasrahu wa nurahu wa barakatahu',
    english: 'O Allah, I ask You for the good of this day, its victory, its help, its light, and its blessings.',
    amharic: 'አላህ ሆይ የዛሬውን ቀን ጥሩነት፣ победаውን፣ እርዳታውን፣ ብርሃኑንና بركتهን እጠይቃለሁ።',
    count: 1, reference: 'Abu Dawud'
  },
  {
    id: 7, category: 'morning',
    title_en: 'Refuge from Evil Eye', title_am: 'ከبد العين መጠበቅ',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bi kalimatillahit-tammati min sharri ma khalaq',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    amharic: 'በአላህ ፍጹም ቃላት ከፈጠረው ነገር ሁሉ ክፋት እጠበቃለሁ።',
    count: 3, reference: 'Muslim', reward: 'Protection from all harm.'
  },
  {
    id: 8, category: 'morning',
    title_en: 'La ilaha illallah', title_am: 'ላ ኢላሀ ኢላላህ',
    arabic: 'لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir',
    english: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs the dominion and to Him belongs all praise, and He is over all things competent.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም፤ ምድረ መንግሥቱና ምስጋናው የእርሱ ነው።',
    count: 1, reference: 'Bukhari & Muslim', reward: 'Equivalent to freeing ten slaves and written ten good deeds.'
  },

  // ─── EVENING (8) ───
  {
    id: 9, category: 'evening',
    title_en: 'Evening Renewal', title_am: 'የምሽት መጀመሪያ',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ',
    transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah...',
    english: 'We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah.',
    amharic: 'ምሽት ላይ መጣን፤ ምድረ መንግሥቱ ለአላህ ነው።',
    count: 1, reference: 'Muslim'
  },
  {
    id: 10, category: 'evening',
    title_en: 'Evening Protection', title_am: 'የምሽት መከላከያ',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'A\'udhu bi kalimatillahit-tammati min sharri ma khalaq',
    english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    amharic: 'በአላህ ፍጹም ቃላት ከፈጠረው ነገር ክፋት እጠበቃለሁ።',
    count: 3, reference: 'Muslim', reward: 'Protection until morning.'
  },
  {
    id: 11, category: 'evening',
    title_en: 'Evening Tasbeeh', title_am: 'የምሽት ተስቢህ',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'SubhanAllahi wa bihamdihi',
    english: 'Glory is to Allah and praise is to Him.',
    amharic: 'አላህን ከכל ክፋት የሚያጸድቅ እና እንደሚገባው የሚያመሰግን ነው።',
    count: 100, reference: 'Bukhari & Muslim'
  },
  {
    id: 12, category: 'evening',
    title_en: 'Protection from Harm', title_am: 'ከጥፋት መከላከያ',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلا فِي السَّمَاءِ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un...',
    english: 'In the name of Allah with whose name nothing is harmed on earth nor in the heavens.',
    amharic: 'በአላህ ስም፤ በስሙ ምንም ነገር የማይጎዳው።',
    count: 3, reference: 'Abu Dawud', reward: 'Nothing will harm you until morning.'
  },
  {
    id: 13, category: 'evening',
    title_en: 'Evening Dua', title_am: 'የምሽት ዱዓ',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration: 'Allahumma bika amsayna, wa bika asbahna...',
    english: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
    amharic: 'አላህ ሆይ በአንተ ምሽት መጣን፤ በአንተም ጠዋት መጣን፤ ወደ አንተም መመለስ ነው።',
    count: 1, reference: 'Tirmidhi'
  },
  {
    id: 14, category: 'evening',
    title_en: 'Seeking Forgiveness', title_am: 'እርምታ መጠየቅ',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullah wa atubu ilayh',
    english: 'I seek forgiveness from Allah and repent to Him.',
    amharic: 'ከአላህ ይቅርታ እጠይቃለሁ፤ ወደ እርሱም እመለሳለሁ።',
    count: 100, reference: 'Muslim'
  },
  {
    id: 15, category: 'evening',
    title_en: 'Health & Well-being', title_am: 'صحت እና ደህንነት',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: 'Allahumma inni as\'alukal-afiyata fid-dunya wal-akhirah',
    english: 'O Allah, I ask You for well-being in this world and the Hereafter.',
    amharic: 'አላህ ሆይ በዚህ ዓለምና በላቀው ዓለም ደህንነት እጠይቃለሁ።',
    count: 3, reference: 'Ibn Majah'
  },
  {
    id: 16, category: 'evening',
    title_en: 'Ayat al-Kursi', title_am: 'አያተል ኩርሲ',
    arabic: 'اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ...',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
    english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
    amharic: 'አላህ ከእርሱ በስተቀር አምላክ የለም፤ ሕያው ራሱን ቻይ ነው።',
    count: 1, reference: 'Sahih al-Bukhari 2311', reward: 'A protector from Allah remains with you until morning.'
  },

  // ─── AFTER PRAYER (6) ───
  {
    id: 17, category: 'after_prayer',
    title_en: 'Istighfar After Prayer', title_am: 'ከصلat በኋላ እርምታ',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah (3 times)',
    english: 'I seek forgiveness from Allah (3 times).',
    amharic: 'ከአላህ ይቅርታ እጠይቃለሁ (3 ጊዜ)።',
    count: 3, reference: 'Muslim'
  },
  {
    id: 18, category: 'after_prayer',
    title_en: 'Tasbeeh After Prayer', title_am: 'ከصلat በኋላ ተስቢህ',
    arabic: 'سُبْحَانَ اللَّهِ (33) — الْحَمْدُ لِلَّهِ (33) — اللَّهُ أَكْبَرُ (34)',
    transliteration: 'SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x',
    english: 'Glory be to Allah 33 times, Praise be to Allah 33 times, Allah is the Greatest 34 times.',
    amharic: 'ሱብሃነላህ 33፣ አልሐምዱሊላህ 33፣ አላሁ አክበር 34 ጊዜ።',
    count: 100, reference: 'Bukhari & Muslim', reward: 'Sins forgiven even if like the foam of the sea.'
  },
  {
    id: 19, category: 'after_prayer',
    title_en: 'Ayat al-Kursi', title_am: 'አያተል ኩርሲ',
    arabic: 'اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ لا تَأْخُذُهُ سِنَةٌ وَلا نَوْمٌ...',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
    english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer. Neither drowsiness nor sleep overtakes Him.',
    amharic: 'አላህ ከእርሱ በስተቀር አምላክ የለም፤ ሕያው ራሱን ቻይ ነው።',
    count: 1, reference: 'Sahih al-Jami\' 6464 (authenticated)', reward: 'Nothing prevents entry to Paradise except death.'
  },
  {
    id: 20, category: 'after_prayer',
    title_en: 'Tahleel', title_am: 'ታሕሊል',
    arabic: 'لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lah...',
    english: 'None has the right to be worshipped except Allah alone, without partner. To Him belongs dominion and praise.',
    amharic: 'ከአላህ በስተቀር አምልኮ የለም።',
    count: 1, reference: 'Muslim', reward: 'Equivalent to freeing a slave from the children of Ismail.'
  },
  {
    id: 21, category: 'after_prayer',
    title_en: 'Dua After Fard Prayer', title_am: 'ከፈርድ በኋላ ዱዓ',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ، تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ',
    transliteration: 'Allahumma antas-salamu wa minkas-salamu, tabarakta ya dhal-jalali wal-ikram',
    english: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.',
    amharic: 'አላህ ሆይ አንተ ሰላም ነህ፤ ከአንተም ሰላም ይመጣል።',
    count: 1, reference: 'Muslim'
  },
  {
    id: 22, category: 'after_prayer',
    title_en: 'Surah Al-Ikhlas', title_am: 'ሱረቱል ኢኽላስ',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ — اللَّهُ الصَّمَدُ — لَمْ يَلِدْ وَلَمْ يُولَدْ — وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    transliteration: 'Qul Huwallahu Ahad...',
    english: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born.',
    amharic: 'በል፡ እርሱ አላህ አንድ ነው። አላህ (የሁሉ) መጠጊያ ነው።',
    count: 3, reference: 'Bukhari', reward: 'Equivalent to one-third of the Quran.'
  },

  // ─── SLEEP (6) ───
  {
    id: 23, category: 'sleep',
    title_en: 'Before Sleeping', title_am: 'ከመተኛት በፊት',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    english: 'In Your name, O Allah, I die and I live.',
    amharic: 'አላህ ሆይ በስምህ እሞታለሁ (እተኛለሁ) እኖራለሁም።',
    count: 1, reference: 'Bukhari'
  },
  {
    id: 24, category: 'sleep',
    title_en: 'Last 3 Surahs', title_am: 'የመጨረሻዎቹ 3 ሱራዎች',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ — قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ — قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Surah Al-Ikhlas, Al-Falaq, An-Nas',
    english: 'Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas.',
    amharic: 'ሱረቱል ኢኽላስ፣ አል-ፈለቅ፣ አን-ናስ አንብብ።',
    count: 3, reference: 'Bukhari & Muslim', reward: 'Sufficient protection from everything.'
  },
  {
    id: 25, category: 'sleep',
    title_en: 'Sleeping Dua', title_am: 'የእንቅልፍ ዱዓ',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: 'Allahumma qini adhabaka yawma tab\'athu ibadak',
    english: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    amharic: 'አላህ ሆይ ባሮችህን ከምትነስናቸው ቀን ከቅጣትህ ጠብቀኝ።',
    count: 1, reference: 'Abu Dawud & Tirmidhi'
  },
  {
    id: 26, category: 'sleep',
    title_en: 'Ayat al-Kursi Before Sleep', title_am: 'ከመተኛት በፊት አያተል ኩርሲ',
    arabic: 'اللَّهُ لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ...',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
    english: 'Recite Ayat al-Kursi before sleeping.',
    amharic: 'ከመተኛት በፊት አያተል ኩርሲን አንብብ።',
    count: 1, reference: 'Bukhari', reward: 'Allah sends a guardian and no devil comes near you until morning.'
  },
  {
    id: 27, category: 'sleep',
    title_en: 'Forgiveness Before Sleep', title_am: 'ከመተኛት በፊት እርምታ',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ',
    transliteration: 'Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk',
    english: 'O Allah, I submit myself to You and entrust my affair to You.',
    amharic: 'አላህ ሆይ ነፍሴን ለአንተ አሳልፌዋለሁ፤ ጉዳዬንም በአንተ አደረግኩ።',
    count: 1, reference: 'Bukhari & Muslim'
  },
  {
    id: 28, category: 'sleep',
    title_en: 'SubhanAllah Before Sleep', title_am: 'ከመተኛት በፊት ተስቢህ',
    arabic: 'سُبْحَانَ اللَّهِ (33) — الْحَمْدُ لِلَّهِ (33) — اللَّهُ أَكْبَرُ (34)',
    transliteration: 'SubhanAllah, Alhamdulillah, Allahu Akbar',
    english: 'Glory be to Allah 33 times, Praise be to Allah 33 times, Allah is Greatest 34 times.',
    amharic: 'ሱብሃነላህ 33፣ አልሐምዱሊላህ 33፣ አላሁ አክበር 34።',
    count: 100, reference: 'Bukhari'
  },

  // ─── RAMADAN (5) ───
  {
    id: 29, category: 'ramadan',
    title_en: 'Dua for Breaking Fast', title_am: 'ጾም ሲፈታ',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    transliteration: 'Dhahaba adh-dhama\'u wabtallatil-uruqu wa thabatal-ajru in sha Allah',
    english: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
    amharic: 'ጥማቱ ሄደ፤ የደም ስሮች ረጠቡ፤ አላህ ከፈቀደ ምንዳውም ተረጋገጠ።',
    count: 1, reference: 'Abu Dawud'
  },
  {
    id: 30, category: 'ramadan',
    title_en: 'Dua When Starting Fast', title_am: 'ጾም ሲጀመር',
    arabic: 'وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ',
    transliteration: 'Wa bisawmi ghadin nawaitu min shahri Ramadan',
    english: 'I intend to keep the fast for tomorrow in the month of Ramadan.',
    amharic: 'በረማዳን bulan ነገ ጾም ለመጠመቅ ነውኝ።',
    count: 1, reference: 'Common practice'
  },
  {
    id: 31, category: 'ramadan',
    title_en: 'Laylatul Qadr Dua', title_am: 'የልይላቱል ቃድር ዱዓ',
    arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    transliteration: 'Allahumma innaka afuwwun tuhibbul-afwa fa\'fu anni',
    english: 'O Allah, You are Pardoning and love to pardon, so pardon me.',
    amharic: 'አላህ ሆይ አንተ ይቅር የሚያደርግ ነህ፤ ይቅርንም ትወዳለህ፤ ስለዚህ ለኔ ፈቀድ።',
    count: 1, reference: 'Tirmidhi', reward: 'Best dua for the last ten nights of Ramadan.'
  },
  {
    id: 32, category: 'ramadan',
    title_en: 'Dua for Suhoor', title_am: 'የሱሆር ዱዓ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي',
    transliteration: 'Allahumma inni as\'aluka birahmatikal-lati wasi\'at kulla shay\'in an taghfira li',
    english: 'O Allah, I ask You by Your mercy which encompasses all things, that You forgive me.',
    amharic: 'አላህ ሆይ በሁሉን ነገር የሚያስፈፅም ምሕርትህን በመጠቀም ለኔ ይቅር ብለል።',
    count: 1, reference: 'Ibn Majah'
  },
  {
    id: 33, category: 'ramadan',
    title_en: 'Taraweeh Intention', title_am: 'ተራዊህ',
    arabic: 'اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ',
    transliteration: 'Allahummaj\'al siyami fihi siyamas-sa\'imin',
    english: 'O Allah, make my fasting in it the fasting of those who truly fast.',
    amharic: 'አላህ ሆይ በዚህ bulan ጾሜን እውነተኛ ጠሚያን ጾም አድርገው።',
    count: 1, reference: 'Ramadan dua'
  },

  // ─── DAILY LIFE (10) ───
  {
    id: 34, category: 'daily',
    title_en: 'Entering Home', title_am: 'ወደ ቤት ሲገባ',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna, wa bismillahi kharajna, wa ala Rabbina tawakkalna',
    english: 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.',
    amharic: 'በአላህ ስም ገባን፤ በአላህ ስም ወጣን፤ በጌታችንም ተመካን።',
    count: 1, reference: 'Abu Dawud'
  },
  {
    id: 35, category: 'daily',
    title_en: 'Leaving Home', title_am: 'ከቤት ሲወጣ',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    transliteration: 'Bismillah, tawakkaltu alallah, wa la hawla wa la quwwata illa billah',
    english: 'In the name of Allah, I place my trust in Allah, and there is no power except with Allah.',
    amharic: 'በአላህ ስም፤ በአላህ ተደራጀሁ፤ ከአላህ በስተቀር ኃይል የለም።',
    count: 1, reference: 'Abu Dawud & Tirmidhi', reward: 'Guided, sufficed, and protected; devils move away.'
  },
  {
    id: 36, category: 'daily',
    title_en: 'Before Eating', title_am: 'ከመመገብ በፊት',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    english: 'In the name of Allah.',
    amharic: 'በአላህ ስም።',
    count: 1, reference: 'Bukhari & Muslim'
  },
  {
    id: 37, category: 'daily',
    title_en: 'After Eating', title_am: 'ከመመገብ በኋላ',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلا قُوَّةٍ',
    transliteration: 'Alhamdulillahil-ladhi at\'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah',
    english: 'All praise is for Allah who fed me this and provided it for me without any might or power from myself.',
    amharic: 'እኔን ያስመገበኝና ከእኔ ኃይል ያለም ያቀረጸውን ለአላህ ምስጋና ይገባው።',
    count: 1, reference: 'Abu Dawud & Tirmidhi', reward: 'Past sins forgiven.'
  },
  {
    id: 38, category: 'daily',
    title_en: 'Entering the Mosque', title_am: 'ወደ መስጊድ ሲገባ',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahummaftah li abwaba rahmatik',
    english: 'O Allah, open for me the doors of Your mercy.',
    amharic: 'አላህ ሆይ የምሕረትህ በሮችን ከፍተልልኝ።',
    count: 1, reference: 'Muslim'
  },
  {
    id: 39, category: 'daily',
    title_en: 'Leaving the Mosque', title_am: 'ከመስጊድ ሲወጣ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma inni as\'aluka min fadlik',
    english: 'O Allah, I ask You from Your bounty.',
    amharic: 'አላህ ሆይ ከጸጋህ እጠይቃለሁ።',
    count: 1, reference: 'Muslim'
  },
  {
    id: 40, category: 'daily',
    title_en: 'Travel Dua', title_am: 'የጉዞ ዱዓ',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin',
    english: 'Glory to Him who has subjected this to us, and we could not have accomplished it by ourselves.',
    amharic: 'ይህን ለእኛ የሚገዛውን (አላህን) ከكل ክፋት የሚያጸድቅ።',
    count: 1, reference: 'Muslim'
  },
  {
    id: 41, category: 'daily',
    title_en: 'Wearing New Clothes', title_am: 'አዲስ ልብስ ሲለብስ',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ خَيْرَهُ وَخَيْرَ مَا صُنِعَ لَهُ',
    transliteration: 'Allahumma lakal-hamdu anta kasawtanihi, as\'aluka khayrahu wa khayra ma suni\'a lah',
    english: 'O Allah, for You is all praise. You have clothed me with it. I ask You for its good and the good of what it was made for.',
    amharic: 'አላህ ሆይ ምስጋና ለአንተ ነው፤ አለብሰኸኝ። ጥሩነቱን እጠይቃለሁ።',
    count: 1, reference: 'Abu Dawud & Tirmidhi'
  },
  {
    id: 42, category: 'daily',
    title_en: 'Looking in the Mirror', title_am: 'በመראት ሲመለከት',
    arabic: 'اللَّهُمَّ كَمَا حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    transliteration: 'Allahumma kama hassanta khalqi fahassin khuluqi',
    english: 'O Allah, as You have made my appearance beautiful, make my character beautiful.',
    amharic: 'አላህ ሆይ ፍጥረቴን እንደሰራኸው መልኩን ጥራትህንም አድርገው።',
    count: 1, reference: 'Common dua'
  },
  {
    id: 43, category: 'daily',
    title_en: 'Sneezing Response', title_am: 'ሲያስሽም',
    arabic: 'الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ',
    transliteration: 'Alhamdulillah — Yarhamukallah — Yahdikumullah',
    english: 'All praise is for Allah. May Allah have mercy on you. May Allah guide you.',
    amharic: 'ለአላህ ምስጋና። አላህ ይረዳህ። አላህ ይመራችሁ።',
    count: 1, reference: 'Bukhari'
  },

  // ─── PROTECTION (7) ───
  {
    id: 44, category: 'protection',
    title_en: 'Healing Dua', title_am: 'የፈውስ ዱዓ',
    arabic: 'أَذْهِبِ الْبَأْسَ رَبَّ النَّاسِ، وَاشْفِ أَنْتَ الشَّافِي، لا شِفَاءَ إِلا شِفَاؤُكَ',
    transliteration: 'Adhhibil-ba\'sa Rabban-nas, washfi antash-Shafi, la shifa\'a illa shifa\'uk',
    english: 'Remove the harm, Lord of mankind, and heal — You are the Healer. There is no healing except Your healing.',
    amharic: 'የሰዎች ጌታ ሆይ! ህመሙን አስወግድ፤ አንተ ፈዋሽ ነህና ፈውሰው።',
    count: 1, reference: 'Bukhari & Muslim'
  },
  {
    id: 45, category: 'protection',
    title_en: 'Protection from Anxiety', title_am: 'ከጭንቀት መከላከያ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan',
    english: 'O Allah, I seek refuge in You from worry and grief.',
    amharic: 'አላህ ሆይ ከ걱정ና ከሀዘን እጠበቃለሁ።',
    count: 1, reference: 'Bukhari'
  },
  {
    id: 46, category: 'protection',
    title_en: 'Protection from Evil Eye', title_am: 'ከبد العين',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration: 'A\'udhu bi kalimatillahit-tammati min kulli shaytanin wa hammah...',
    english: 'I seek refuge in the perfect words of Allah from every devil and poisonous creature and from every evil eye.',
    amharic: 'በአላህ ፍጹም ቃላት ከሰይጣን፣ ከ poisonous creatureና ከبد العين እጠበቃለሁ።',
    count: 3, reference: 'Bukhari'
  },
  {
    id: 47, category: 'protection',
    title_en: 'Muawwidhat (3 Quls)', title_am: 'ሙአውwidhat',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ — قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ — قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
    transliteration: 'Al-Ikhlas, Al-Falaq, An-Nas',
    english: 'Recite the three Quls for protection.',
    amharic: 'ለመከላከlia ሦስቱን Quls አንብብ።',
    count: 3, reference: 'Bukhari & Muslim', reward: 'Sufficient protection from all evil.'
  },
  {
    id: 48, category: 'protection',
    title_en: 'Hasbunallah', title_am: 'ሐስቡነላህ',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: 'Hasbunallahu wa ni\'mal-wakil',
    english: 'Allah is sufficient for us, and He is the best Disposer of affairs.',
    amharic: 'አላህ ለእኛ በቂ ነው፤ እርሱም ምርጥ ተጠሪቀ ነው።',
    count: 7, reference: 'Quran 3:173', reward: 'Allah is sufficient for those who trust in Him.'
  },
  {
    id: 49, category: 'protection',
    title_en: 'Protection from Debt', title_am: 'ከብድር',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْبُخْلِ وَضَلَعِ الدَّيْنِ',
    transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan...',
    english: 'O Allah, I seek refuge in You from worry, grief, incapacity, laziness, cowardice, miserliness, and the burden of debt.',
    amharic: 'አላህ ሆይ ከ걱정፣ ከሀዘን፣ ከብድርና ከሌሎች ክፍلات እጠበቃለሁ።',
    count: 1, reference: 'Bukhari'
  },
  {
    id: 50, category: 'protection',
    title_en: 'La hawla wa la quwwata', title_am: 'ላa ሐውላ',
    arabic: 'لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    english: 'There is no power and no strength except with Allah.',
    amharic: 'ከአላህ በስተቀር ኃይልና ብርቱይነት የለም።',
    count: 33, reference: 'Hisn al-Muslim #88 — Jami\' at-Tirmidhi 3524', reward: 'A treasure from the treasures of Paradise.'
  },
  ...AZKAR_EXTENDED,
];

export const AZKAR_CATEGORIES = [
  { id: 'morning' as const, label: 'Morning', label_am: 'ጠዋት' },
  { id: 'evening' as const, label: 'Evening', label_am: 'ምሽት' },
  { id: 'after_prayer' as const, label: 'After Prayer', label_am: 'ከصلat' },
  { id: 'sleep' as const, label: 'Sleep', label_am: 'እንቅልፍ' },
  { id: 'ramadan' as const, label: 'Ramadan', label_am: 'ረማዳን' },
  { id: 'daily' as const, label: 'Daily Life', label_am: 'ዕለታዊ' },
  { id: 'protection' as const, label: 'Protection', label_am: 'መከላከlia' },
];
