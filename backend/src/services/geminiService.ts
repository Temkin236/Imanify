import config from '../utils/config';
import { ServiceUnavailableError } from '../utils/errors';
import { RagContextResult } from '../types';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

class GeminiService {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly systemPrompt = `You are Imanify Islamic Assistant, a knowledgeable helper about Islam based on Quran and Islamic teachings.
You respond in the user's language (English, Arabic, or Amharic).
Always base your answers on Islamic sources provided.
Be respectful, accurate, and educational.
If you don't have enough information, say so clearly.
Provide practical guidance when applicable.`;

  async generateFromPrompt(prompt: string): Promise<string> {
    const apiKey = config.get('geminiApiKey') as string | undefined;
    if (!apiKey) {
      throw new ServiceUnavailableError('Gemini API key');
    }

    const url = `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: { text: this.systemPrompt }
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new ServiceUnavailableError('Gemini API');
      }

      const payload = (await response.json()) as GeminiResponse;
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        return 'أعتذر، لا أملك معلومات كافية لأجيب على سؤالك.\n\nI apologize, I do not have enough information to answer your question.\n\nይቅርታ፣ ይህን መጠይቅ ለመመለስ በቂ ዕውቀት የለኝም።';
      }

      return text;
    } catch (error) {
      if (error instanceof ServiceUnavailableError) {
        throw error;
      }
      throw new ServiceUnavailableError('Gemini API');
    }
  }

  buildRagPrompt(question: string, context: RagContextResult): string {
    const quranContext = context.quran
      .map((q) => `📖 Quran ${q.surah}:${q.ayah}\nArabic: ${q.arabic}\nEnglish: ${q.english}\nAmharic: ${q.amharic}`)
      .join('\n\n');

    const azkarContext = context.azkar
      .map((a) => `🤲 Dhikr: ${a.arabic}\nEnglish: ${a.translation_en}\nAmharic: ${a.translation_am}`)
      .join('\n\n');

    return `Based on the following Islamic sources, answer this question comprehensively in English, Arabic, and Amharic when appropriate:

Question: ${question}

📚 Relevant Quranic Verses:
${quranContext || 'No specific verses found'}

🤲 Related Dhikrs (Remembrances):
${azkarContext || 'No related dhikrs found'}

Please provide an answer that:
1. Directly addresses the question
2. Cites the Islamic sources provided
3. Is respectful and educational
4. Uses simple, clear language
5. Includes practical guidance when applicable
6. Provides the answer in multiple languages if helpful`;
  }
}

export default new GeminiService();
