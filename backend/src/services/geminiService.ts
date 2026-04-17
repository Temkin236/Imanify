import config from '../utils/config.js';
import { AppError } from '../utils/errors.js';
import { RagContextResult } from '../types.js';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

class GeminiService {
  // Use v1 API with Gemini 2.0 Flash (stable & highly available)
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1/models';
  private readonly model = 'gemini-2.0-flash';
  
  private readonly systemPrompt = `You are Imanify Islamic Assistant, a knowledgeable helper about Islam based on Quran and Islamic teachings.
You respond in the user's language (English, Arabic, or Amharic).
Always base your answers on Islamic sources provided.
Be respectful, accurate, and educational.
If you don't have enough information, say so clearly.
Provide practical guidance when applicable.`;

  constructor() {
    this.validateApiKey();
  }

  private validateApiKey(): void {
    const apiKey = config.get('geminiApiKey') as string | undefined;
    if (!apiKey) {
      throw new Error('[CRITICAL] GEMINI_API_KEY environment variable is not set. Please check your .env file.');
    }
    if (apiKey.length < 20) {
      throw new Error('[CRITICAL] GEMINI_API_KEY appears to be invalid (too short). Please verify your API key.');
    }
    console.log(`[GeminiService] ✓ API key loaded successfully (length: ${apiKey.length})`);
    console.log(`[GeminiService] ✓ Using model: ${this.model}`);
    console.log(`[GeminiService] ✓ Using API version: v1`);
  }

  async generateFromPrompt(prompt: string): Promise<string> {
    const apiKey = config.get('geminiApiKey') as string | undefined;
    if (!apiKey) {
      throw new AppError('GEMINI_API_KEY is not configured', 503);
    }

    // Correct endpoint format for Gemini 2.5 Flash with v1 API
    const url = `${this.baseUrl}/${this.model}:generateContent?key=${apiKey}`;

    console.log(`[GeminiService] Calling: ${this.model}:generateContent`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${this.systemPrompt}\n\nUser Question: ${prompt}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `Gemini API returned status ${response.status}`;

        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error?.message || JSON.stringify(errorJson);
          console.error('[Gemini API Error]', { status: response.status, error: errorJson });
        } catch {
          console.error('[Gemini API Error]', { status: response.status, message: errorBody });
        }

        // Map HTTP status codes to meaningful messages
        if (response.status === 400) {
          throw new AppError(
            `Invalid request to Gemini API (${this.model}). Ensure model exists and API key has access. Error: ${errorMessage}`,
            503
          );
        }
        if (response.status === 401 || response.status === 403) {
          throw new AppError(
            'Gemini API authentication failed. Your API key may be invalid, expired, or lack necessary permissions.',
            503
          );
        }
        if (response.status === 404) {
          throw new AppError(
            `Model ${this.model} not found or not available for this API key. Verify the model name is correct.`,
            503
          );
        }
        if (response.status === 429) {
          throw new AppError('Gemini API quota exceeded. Please try again later.', 429);
        }
        if (response.status === 500 || response.status === 503) {
          throw new AppError('Gemini API is temporarily unavailable. Please try again later.', 503);
        }

        throw new AppError(errorMessage, response.status >= 500 ? 503 : response.status);
      }

      const payload = (await response.json()) as GeminiResponse;

      // Handle error response in success status
      if (payload.error) {
        console.error('[Gemini API Error Response]', payload.error);
        throw new AppError(payload.error.message, 503);
      }

      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        return 'أعتذر، لا أملك معلومات كافية لأجيب على سؤالك.\n\nI apologize, I do not have enough information to answer your question.\n\nይቅርታ፣ ይህን መጠይቅ ለመመለስ በቂ ዕውቀት የለኝም።';
      }

      console.log('[GeminiService] ✓ Response generated successfully');
      return text;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Gemini Service Error]', message);
      throw new AppError(`Gemini API error: ${message}`, 503);
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
