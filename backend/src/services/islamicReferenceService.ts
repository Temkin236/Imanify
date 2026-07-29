/**
 * Islamic Reference Service
 * Looks up exact Quran ayah and authenticated Hadith by topic/keywords
 */

import amharicQuranData from '../data/amharic_quran.json' with { type: 'json' };
import {
  QURAN_REFERENCES,
  HADITH_REFERENCES,
  TOPIC_PRESETS,
  quranKey,
  type QuranReference,
  type HadithReference
} from '../data/islamicReferences.js';

export interface ReferenceLookupResult {
  quran: QuranReference[];
  hadith: HadithReference[];
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'is', 'was', 'are',
  'what', 'which', 'who', 'how', 'why', 'when', 'where', 'can', 'does', 'about', 'tell', 'me',
  'feel', 'i', 'my', 'please', 'suggest', 'verse', 'dua'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u0600-\u06ff\u1200-\u137f\s]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function detectTopic(message: string): string | null {
  const lower = message.toLowerCase();
  if (/anxious|anxiety|worried|worry|stress|overwhelm/.test(lower)) return 'anxious';
  if (/grateful|gratitude|shukr|thankful|thanks/.test(lower)) return 'grateful';
  if (/sad|grief|depressed|depression|sorrow|cry/.test(lower)) return 'sad';
  if (/lost|guidance|confused|direction|hidayah/.test(lower)) return 'lost';
  if (/ramadan|fast|iftar|suhoor|sawm/.test(lower)) return 'ramadan';
  if (/prayer|salah|namaz|fajr|maghrib/.test(lower)) return 'prayer';
  if (/protect|protection|evil eye|harm|safe/.test(lower)) return 'protection';
  return null;
}

function enrichFromLocalQuran(ref: QuranReference): QuranReference {
  const local = (amharicQuranData as Array<{
    surah: number;
    ayah: number;
    surahName?: string;
    text_ar?: string;
    text_en?: string;
    text_am?: string;
  }>).find((a) => a.surah === ref.surah && a.ayah === ref.ayah);

  if (!local) return ref;

  return {
    ...ref,
    surahName: local.surahName || ref.surahName,
    arabic: local.text_ar || ref.arabic,
    english: local.text_en || ref.english,
    amharic: local.text_am || ref.amharic
  };
}

function scoreTopics(topics: string[], keywords: string[]): number {
  let score = 0;
  for (const topic of topics) {
    for (const kw of keywords) {
      if (topic.includes(kw) || kw.includes(topic)) score += 5;
    }
  }
  return score;
}

export function lookupReferences(message: string): ReferenceLookupResult {
  const keywords = tokenize(message);
  const topic = detectTopic(message);

  const quranMap = new Map<string, QuranReference>();
  const hadithMap = new Map<string, HadithReference>();

  // Topic presets (highest priority)
  if (topic && TOPIC_PRESETS[topic]) {
    const preset = TOPIC_PRESETS[topic];
    for (const key of preset.quran) {
      const [s, a] = key.split(':').map(Number);
      const ref = QURAN_REFERENCES.find((q) => q.surah === s && q.ayah === a);
      if (ref) quranMap.set(quranKey(ref.surah, ref.ayah), enrichFromLocalQuran(ref));
    }
    for (const id of preset.hadith) {
      const h = HADITH_REFERENCES.find((x) => x.id === id);
      if (h) hadithMap.set(h.id, h);
    }
  }

  // Keyword scoring
  for (const ref of QURAN_REFERENCES) {
    const score = scoreTopics(ref.topics, keywords);
    if (score > 0) {
      quranMap.set(quranKey(ref.surah, ref.ayah), enrichFromLocalQuran(ref));
    }
  }

  for (const h of HADITH_REFERENCES) {
    const score = scoreTopics(h.topics, keywords);
    if (score > 0) hadithMap.set(h.id, h);
  }

  return {
    quran: [...quranMap.values()].slice(0, 4),
    hadith: [...hadithMap.values()].slice(0, 3)
  };
}

export function formatQuranCitation(ref: QuranReference): string {
  const lines = [
    `📖 **Quran ${ref.surahName} (${ref.surahNameAr || ref.surahName}) ${ref.surah}:${ref.ayah}**`,
    `Arabic: ${ref.arabic}`,
    `English: "${ref.english}"`
  ];
  if (ref.amharic) lines.push(`Amharic: ${ref.amharic}`);
  return lines.join('\n');
}

export function formatHadithCitation(ref: HadithReference): string {
  const lines = [
    `📜 **Hadith — ${ref.source}** (${ref.grade})`,
    `Narrator: ${ref.narrator}`,
    `"${ref.english}"`
  ];
  if (ref.arabic) lines.unshift(`Arabic: ${ref.arabic}`);
  return lines.join('\n');
}

export function formatReferencesForAI(refs: ReferenceLookupResult): string {
  const parts: string[] = [
    'VERIFIED ISLAMIC SOURCES — You MUST cite these exact references in your answer. Do NOT invent or alter ayah numbers or hadith sources.'
  ];

  if (refs.quran.length > 0) {
    parts.push('\n--- QURAN (cite exactly as shown) ---');
    for (const q of refs.quran) {
      parts.push(formatQuranCitation(q));
    }
  }

  if (refs.hadith.length > 0) {
    parts.push('\n--- HADITH (cite exactly as shown) ---');
    for (const h of refs.hadith) {
      parts.push(formatHadithCitation(h));
    }
  }

  parts.push(
    '\nCITATION RULES:',
    '- Quote Arabic text exactly when provided above',
    '- Always include Surah name + chapter:ayah for Quran',
    '- Always include collection name + number for Hadith (e.g. Sahih al-Bukhari 6306)',
    '- If unsure of a source, say "Allahu Alim" — never fabricate references'
  );

  return parts.join('\n');
}

export function formatReferencesForUser(refs: ReferenceLookupResult): string {
  const parts: string[] = [];

  if (refs.quran.length > 0) {
    parts.push('**Quranic Evidence**\n');
    for (const q of refs.quran) {
      parts.push(formatQuranCitation(q));
      parts.push('');
    }
  }

  if (refs.hadith.length > 0) {
    parts.push('**Hadith Reference**\n');
    for (const h of refs.hadith) {
      parts.push(formatHadithCitation(h));
      parts.push('');
    }
  }

  return parts.join('\n');
}

export default { lookupReferences, formatReferencesForAI, formatReferencesForUser };
