/**
 * Islamic Knowledge Fallback
 * Uses verified Quran ayah and authenticated Hadith with exact citations
 */

import ragService from '../ragService.js';
import islamicRefService from '../islamicReferenceService.js';

const MOOD_RESPONSES: Record<string, string> = {
  anxious: buildMoodResponse('anxious', `**Dua for Peace and Relief from Anxiety**

Allah is the Most Merciful. When anxiety weighs on the heart, turn to Him with this authenticated dua and the Quran's promise of rest through remembrance.`),

  grateful: buildMoodResponse('grateful', `**Dua of Gratitude (Shukr)**

Gratitude opens doors of blessing. Allah promises to increase those who are grateful — a divine guarantee from the Quran itself.`),

  sad: buildMoodResponse('sad', `**Comfort from the Quran and Sunnah**

When the heart feels heavy, the Quran offers light and the Prophet ﷺ reminded us that even our pain carries meaning.`),

  lost: buildMoodResponse('lost', `**Dua for Guidance (Hidayah)**

When the path feels unclear, ask the One who guides all hearts. The opening of Al-Fatiha itself is a daily dua for the straight path.`)
};

function buildMoodResponse(topic: string, intro: string): string {
  const refs = islamicRefService.lookupReferences(topic);
  const citations = islamicRefService.formatReferencesForUser(refs);

  const duaBlock =
    topic === 'anxious'
      ? `\n**Authenticated Dua**\n\nArabic: اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ\n\nTransliteration: Allahumma inni a'udhu bika minal-hammi wal-hazan\n\nTranslation: "O Allah, I seek refuge in You from worry and grief."\n\n*(From the dua of the Prophet ﷺ — Sahih al-Bukhari 6323)*\n`
      : topic === 'grateful'
        ? `\n**Opening of Praise**\n\nArabic: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n\nTransliteration: Alhamdulillahi rabbil 'alameen\n\nTranslation: "All praise is due to Allah, Lord of all the worlds."\n\n*(Quran Al-Fatiha 1:2)*\n`
        : topic === 'lost'
          ? `\n**Dua for Steadfast Guidance**\n\nArabic: رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا\n\nTranslation: "Our Lord, do not let our hearts deviate after You have guided us."\n\n*(Quran Al-Imran 3:8)*\n`
          : '';

  return `${intro}\n${duaBlock}\n${citations}\n**Closing Reflection**\n\n*Allahu Alim* — Allah knows best. Consult a qualified scholar for specific rulings. 🤲`;
}

function formatRagContext(context: Awaited<ReturnType<typeof ragService.getContext>>): string {
  const refs = {
    quran: context.quran.map((q) => ({
      surah: q.surah,
      surahName: `Surah ${q.surah}`,
      surahNameAr: '',
      ayah: q.ayah,
      arabic: q.arabic,
      english: q.english,
      amharic: q.amharic,
      topics: [] as string[]
    })),
    hadith: (context.hadith || []).map((h) => ({
      id: h.id,
      english: h.english,
      narrator: h.narrator,
      source: h.source,
      grade: h.grade as 'Sahih' | 'Hasan',
      topics: [] as string[],
      arabic: h.arabic
    }))
  };

  return islamicRefService.formatReferencesForUser(refs);
}

function detectMood(message: string): string | null {
  const lower = message.toLowerCase();
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worried')) return 'anxious';
  if (lower.includes('grateful') || lower.includes('gratitude') || lower.includes('shukr')) return 'grateful';
  if (lower.includes('sad') || lower.includes('grief') || lower.includes('depressed')) return 'sad';
  if (lower.includes('lost') || lower.includes('guidance') || lower.includes('confused')) return 'lost';
  return null;
}

export async function generateIslamicFallback(message: string): Promise<string> {
  const mood = detectMood(message);
  if (mood && MOOD_RESPONSES[mood]) {
    return MOOD_RESPONSES[mood];
  }

  const verified = islamicRefService.lookupReferences(message);
  if (verified.quran.length > 0 || verified.hadith.length > 0) {
    const citations = islamicRefService.formatReferencesForUser(verified);
    return `**Answer from Verified Sources**\n\n${citations}\n**Explanation**\n\nThese authentic Quranic verses and Hadith directly relate to your question. For a fuller explanation, please try again shortly.\n\n*Allahu Alim* — consult a qualified scholar for specific fatwas. 🤲`;
  }

  const context = await ragService.getContext(message);
  const formatted = formatRagContext(context);

  if (formatted.trim()) {
    return `**Relevant Islamic Sources**\n\n${formatted}\n\n**Note**\n\nThese sources relate to your question. For a detailed explanation, please try again shortly.\n\n*Allahu Alim* — Allah knows best. 🤲`;
  }

  return `**Assalamu Alaikum!**

I'm here to help with Islamic guidance based on the **Quran** and **authenticated Sunnah**.

I can help with:
- Exact Quranic verses with Surah name and ayah number
- Authenticated Hadith with collection references (Bukhari, Muslim, etc.)
- Daily Azkar and duas
- Prayer times and Qibla direction

Please try your question again, or tap a mood button above for verified guidance.

*Allahu Alim* — Allah knows best. 🤲`;
}
