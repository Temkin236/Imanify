import { Surah, Verse } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranService = {
  async getAllSurahs(): Promise<Surah[]> {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    return data.data.map((s: any) => ({
      id: s.number,
      name: s.name,
      englishName: s.englishName,
      versesCount: s.numberOfAyahs,
      revelationType: s.revelationType,
      verses: []
    }));
  },

  async getSurahDetails(id: number): Promise<Surah> {
    // Fetch Arabic
    const arRes = await fetch(`${BASE_URL}/surah/${id}/ar.alafasy`);
    const arData = await arRes.json();
    
    // Fetch English
    const enRes = await fetch(`${BASE_URL}/surah/${id}/en.sahih`);
    const enData = await enRes.json();
    
    let amData: any = { ayahs: [] };
    try {
      const amRes = await fetch(`${BASE_URL}/surah/${id}/am.sadiq`);
      if (amRes.ok) amData = await amRes.json();
    } catch (e) {
      // Amharic fallback
    }

    const verses: Verse[] = arData.data.ayahs.map((ayah: any, index: number) => ({
      id: ayah.number,
      number: ayah.numberInSurah,
      arabic: ayah.text,
      english: enData.data.ayahs[index].text,
      amharic: amData.data?.ayahs?.[index]?.text || "Amharic translation coming soon...",
      audioUrl: ayah.audio
    }));

    return {
      id: arData.data.number,
      name: arData.data.name,
      englishName: arData.data.englishName,
      versesCount: arData.data.numberOfAyahs,
      revelationType: arData.data.revelationType,
      verses
    };
  },

  async getJuz(juzNumber: number): Promise<Verse[]> {
    const response = await fetch(`${BASE_URL}/juz/${juzNumber}/quran-uthmani`);
    const data = await response.json();
    
    const enRes = await fetch(`${BASE_URL}/juz/${juzNumber}/en.sahih`);
    const enData = await enRes.json();

    return data.data.ayahs.map((ayah: any, index: number) => ({
      id: ayah.number,
      number: ayah.numberInSurah,
      arabic: ayah.text,
      english: enData.data.ayahs[index].text,
      amharic: "Amharic translation coming soon...",
      audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
    }));
  }
};
