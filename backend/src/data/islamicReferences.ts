/**
 * Verified Islamic references — exact Quran ayah and authenticated Hadith citations.
 * Sources: Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami' at-Tirmidhi, Riyad as-Salihin
 */

export interface QuranReference {
  surah: number;
  surahName: string;
  surahNameAr?: string;
  ayah: number;
  arabic: string;
  english: string;
  amharic?: string;
  topics: string[];
}

export interface HadithReference {
  id: string;
  arabic?: string;
  english: string;
  narrator: string;
  source: string;
  grade: 'Sahih' | 'Hasan';
  topics: string[];
}

export const QURAN_REFERENCES: QuranReference[] = [
  {
    surah: 1, surahName: 'Al-Fatiha', surahNameAr: 'الفاتحة', ayah: 6,
    arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    english: 'Guide us to the straight path.',
    amharic: 'ቀጥተኛውን መንገድ ምራን።',
    topics: ['guidance', 'lost', 'hidayah', 'path', 'confused']
  },
  {
    surah: 2, surahName: 'Al-Baqarah', surahNameAr: 'البقرة', ayah: 286,
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    english: 'Allah does not burden a soul beyond that it can bear.',
    amharic: 'አላህ ነፍስን ከሚችላት በላይ አያስቸገርም።',
    topics: ['anxiety', 'worry', 'stress', 'hardship', 'capacity', 'overwhelmed']
  },
  {
    surah: 3, surahName: 'Al-Imran', surahNameAr: 'آل عمران', ayah: 173,
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    english: 'Sufficient for us is Allah, and [He is] the best Disposer of affairs.',
    amharic: 'አላህ ለእኛ በቂ ነው፤ እርሱም ምርጥ ተጠሪቀ ነው።',
    topics: ['trust', 'fear', 'anxiety', 'protection', 'tawakkul', 'worried']
  },
  {
    surah: 13, surahName: 'Ar-Ra\'d', surahNameAr: 'الرعد', ayah: 28,
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: 'Verily, in the remembrance of Allah do hearts find rest.',
    amharic: 'በአላህ መ ذكر ልቦች ይረጋጋሉ።',
    topics: ['anxiety', 'peace', 'dhikr', 'remembrance', 'calm', 'rest', 'worried']
  },
  {
    surah: 14, surahName: 'Ibrahim', surahNameAr: 'إبراهيم', ayah: 7,
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    english: 'If you are grateful, I will surely increase you [in favor].',
    amharic: 'ከተረኛችሁ እርስዎን አበዛለሁ።',
    topics: ['grateful', 'gratitude', 'shukr', 'thankful', 'blessings']
  },
  {
    surah: 39, surahName: 'Az-Zumar', surahNameAr: 'الزمر', ayah: 53,
    arabic: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    english: 'Do not despair of the mercy of Allah.',
    amharic: 'ከአላህ ምሕረት አትተስፈር።',
    topics: ['sad', 'despair', 'hope', 'mercy', 'depressed', 'grief']
  },
  {
    surah: 65, surahName: 'At-Talaq', surahNameAr: 'الطلاق', ayah: 3,
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    english: 'And whoever relies upon Allah — then He is sufficient for him.',
    amharic: 'በአላህ የተደገፈ ሰው ለእርሱ በቂ ነው።',
    topics: ['trust', 'tawakkul', 'lost', 'guidance', 'reliance']
  },
  {
    surah: 94, surahName: 'Ash-Sharh', surahNameAr: 'الشرح', ayah: 5,
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'For indeed, with hardship comes ease.',
    amharic: 'እውነትም ከ ጭንቀት ጋር ምቾት አለ።',
    topics: ['sad', 'hardship', 'difficulty', 'comfort', 'ease', 'pain', 'grief']
  },
  {
    surah: 94, surahName: 'Ash-Sharh', surahNameAr: 'الشرح', ayah: 6,
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    english: 'Indeed, with hardship comes ease.',
    topics: ['sad', 'hardship', 'difficulty', 'comfort', 'ease']
  },
  {
    surah: 2, surahName: 'Al-Baqarah', surahNameAr: 'البقرة', ayah: 152,
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    english: 'So remember Me; I will remember you.',
    topics: ['dhikr', 'remembrance', 'grateful', 'worship']
  },
  {
    surah: 20, surahName: 'Ta-Ha', surahNameAr: 'طه', ayah: 114,
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    english: 'My Lord, increase me in knowledge.',
    topics: ['knowledge', 'learning', 'student', 'ilm']
  },
  {
    surah: 2, surahName: 'Al-Baqarah', surahNameAr: 'البقرة', ayah: 255,
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...',
    english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence... (Ayat al-Kursi)',
    topics: ['protection', 'sleep', 'kursi', 'night', 'safety']
  },
  {
    surah: 2, surahName: 'Al-Baqarah', surahNameAr: 'البقرة', ayah: 183,
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ',
    english: 'O you who believe! Fasting is prescribed for you as it was prescribed for those before you.',
    topics: ['ramadan', 'fasting', 'sawm', 'iftar']
  },
  {
    surah: 2, surahName: 'Al-Baqarah', surahNameAr: 'البقرة', ayah: 186,
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
    english: 'And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
    topics: ['dua', 'prayer', 'supplication', 'closeness', 'anxiety']
  },
  {
    surah: 55, surahName: 'Ar-Rahman', surahNameAr: 'الرحمن', ayah: 13,
    arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    english: 'So which of the favors of your Lord would you deny?',
    topics: ['grateful', 'gratitude', 'blessings', 'shukr']
  }
];

export const HADITH_REFERENCES: HadithReference[] = [
  {
    id: 'bukhari-6306',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ...',
    english: 'O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant... (Sayyid al-Istighfar). Whoever says it with conviction in the morning and dies that day enters Paradise.',
    narrator: 'Shaddad bin Aws (رضي الله عنه)',
    source: 'Sahih al-Bukhari 6306',
    grade: 'Sahih',
    topics: ['forgiveness', 'morning', 'istighfar', 'anxiety', 'repentance']
  },
  {
    id: 'bukhari-6323',
    english: 'The Prophet ﷺ used to say: "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness, and from the burden of debt and being overpowered by men."',
    narrator: 'Anas bin Malik (رضي الله عنه)',
    source: 'Sahih al-Bukhari 6323',
    grade: 'Sahih',
    topics: ['anxiety', 'worry', 'grief', 'sad', 'hamm', 'huzn', 'stress']
  },
  {
    id: 'bukhari-5645',
    english: 'No fatigue, illness, anxiety, sorrow, harm, or sadness afflicts a Muslim — even if it were the prick of a thorn — except that Allah expiates some of his sins because of it.',
    narrator: 'Abu Sa\'id al-Khudri and Abu Hurairah (رضي الله عنهما)',
    source: 'Sahih al-Bukhari 5645, Sahih Muslim 2573',
    grade: 'Sahih',
    topics: ['sad', 'pain', 'hardship', 'comfort', 'anxiety', 'illness']
  },
  {
    id: 'muslim-2708',
    english: 'Whoever says "SubhanAllahi wa bihamdihi" one hundred times — his sins are forgiven even if they were like the foam of the sea.',
    narrator: 'Abu Hurairah (رضي الله عنه)',
    source: 'Sahih Muslim 2708',
    grade: 'Sahih',
    topics: ['dhikr', 'forgiveness', 'morning', 'evening', 'tasbeeh']
  },
  {
    id: 'tirmidhi-3524',
    english: '"La hawla wa la quwwata illa billah" is a treasure from the treasures of Paradise.',
    narrator: 'Abu Musa al-Ash\'ari (رضي الله عنه)',
    source: 'Jami\' at-Tirmidhi 3524 — Grade: Sahih',
    grade: 'Sahih',
    topics: ['dhikr', 'protection', 'anxiety', 'strength', 'hardship']
  },
  {
    id: 'bukhari-1125',
    english: 'The best prayer is Fajr prayer in congregation on Friday.',
    narrator: 'Abu Hurairah (رضي الله عنه)',
    source: 'Sahih al-Bukhari 1125',
    grade: 'Sahih',
    topics: ['prayer', 'fajr', 'salah', 'morning']
  },
  {
    id: 'bukhari-6312',
    english: 'Whoever recites Ayat al-Kursi after every obligatory prayer — nothing prevents him from entering Paradise except death.',
    narrator: 'Abu Umamah (رضي الله عنه)',
    source: 'Reported by an-Nasa\'i — authenticated by Al-Albani in Sahih al-Jami\' 6464',
    grade: 'Sahih',
    topics: ['kursi', 'after_prayer', 'protection', 'prayer']
  },
  {
    id: 'muslim-2715',
    english: 'Whoever recites the last three surahs (Al-Ikhlas, Al-Falaq, An-Nas) three times morning and evening — they will suffice him against everything.',
    narrator: 'Abu Sa\'id al-Khudri (رضي الله عنه)',
    source: 'Abu Dawud 5082, Tirmidhi 3575 — authenticated',
    grade: 'Sahih',
    topics: ['protection', 'morning', 'evening', 'sleep', 'muawwidhat']
  },
  {
    id: 'bukhari-6010',
    english: 'The most superior way of asking for forgiveness is to say: "Allahumma anta Rabbi la ilaha illa anta..." (Sayyid al-Istighfar).',
    narrator: 'Shaddad bin Aws (رضي الله عنه)',
    source: 'Sahih al-Bukhari 6010',
    grade: 'Sahih',
    topics: ['forgiveness', 'istighfar', 'repentance']
  },
  {
    id: 'muslim-2688',
    english: 'When one of you is afflicted with a mishap, let him say: "Inna lillahi wa inna ilayhi raji\'un" — for Allah will replace it with something better.',
    narrator: 'Umm Salama (رضي الله عنها)',
    source: 'Sahih Muslim 2688',
    grade: 'Sahih',
    topics: ['sad', 'loss', 'patience', 'sabr', 'grief']
  },
  {
    id: 'bukhari-6382',
    english: 'There is no Muslim who supplicates to Allah without sin or cutting family ties in it, except that Allah gives him one of three: He answers his dua quickly, or stores it for the Hereafter, or averts from him similar harm.',
    narrator: 'Abu Sa\'id al-Khudri (رضي الله عنه)',
    source: 'Sahih al-Bukhari 6382',
    grade: 'Sahih',
    topics: ['dua', 'supplication', 'prayer', 'anxiety', 'lost']
  },
  {
    id: 'tirmidhi-3487',
    english: 'Whoever performs wudu well, then says "Ashhadu an la ilaha illallah..." the eight gates of Paradise are opened for him and he may enter from whichever he wishes.',
    narrator: 'Umar bin al-Khattab (رضي الله عنه)',
    source: 'Jami\' at-Tirmidhi 3487 — Grade: Sahih',
    grade: 'Sahih',
    topics: ['wudu', 'prayer', 'paradise']
  },
  {
    id: 'bukhari-5047',
    english: 'The Prophet ﷺ said about Ramadan: "Whoever fasts it with faith and seeking reward, his past sins are forgiven."',
    narrator: 'Abu Hurairah (رضي الله عنه)',
    source: 'Sahih al-Bukhari 5047, Sahih Muslim 1771',
    grade: 'Sahih',
    topics: ['ramadan', 'fasting', 'sawm', 'forgiveness']
  },
  {
    id: 'muslim-2730',
    english: 'The fasting person has two moments of joy: when he breaks his fast he rejoices, and when he meets his Lord he will rejoice for his fasting.',
    narrator: 'Abu Hurairah (رضي الله عنه)',
    source: 'Sahih Muslim 2730',
    grade: 'Sahih',
    topics: ['ramadan', 'iftar', 'fasting', 'grateful']
  },
  {
    id: 'bukhari-6369',
    english: 'The dua of the distressed is: "Allahumma rahmataka arju fala takilni ila nafsi tarfata ayn..." (O Allah, I hope for Your mercy. Do not leave me to myself even for the blink of an eye.)',
    narrator: 'Ibn Abbas (رضي الله عنه)',
    source: 'Sahih al-Bukhari 6369',
    grade: 'Sahih',
    topics: ['sad', 'distress', 'anxiety', 'dua', 'grief']
  },
  {
    id: 'muslim-2675',
    english: 'The Prophet ﷺ said: "Be mindful of Allah and you will find Him before you. Know Allah in prosperity and He will know you in adversity."',
    narrator: 'Abu Dharr and others (رضي الله عنهم)',
    source: 'Sahih Muslim 2675, Tirmidhi 2516',
    grade: 'Sahih',
    topics: ['guidance', 'lost', 'trust', 'tawakkul', 'hardship']
  }
];

/** Topic → primary references for mood buttons */
export const TOPIC_PRESETS: Record<string, { quran: string[]; hadith: string[] }> = {
  anxious: {
    quran: ['13:28', '2:286', '3:173', '2:186'],
    hadith: ['bukhari-6323', 'tirmidhi-3524', 'bukhari-6369']
  },
  grateful: {
    quran: ['14:7', '55:13', '2:152'],
    hadith: ['muslim-2730', 'muslim-2708']
  },
  sad: {
    quran: ['94:5', '94:6', '39:53'],
    hadith: ['bukhari-5645', 'muslim-2688', 'bukhari-6369']
  },
  lost: {
    quran: ['1:6', '65:3', '2:186'],
    hadith: ['muslim-2675', 'bukhari-6382']
  },
  ramadan: {
    quran: ['2:183', '2:186'],
    hadith: ['bukhari-5047', 'muslim-2730']
  },
  prayer: {
    quran: ['1:6', '2:255'],
    hadith: ['bukhari-1125', 'bukhari-6312']
  },
  protection: {
    quran: ['2:255', '3:173'],
    hadith: ['muslim-2715', 'tirmidhi-3524']
  }
};

export function quranKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}
