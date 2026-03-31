import config from '../utils/config';
import { ServiceUnavailableError } from '../utils/errors';

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
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new ServiceUnavailableError('Gemini API');
      }

      const payload = (await response.json()) as GeminiResponse;
      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        return 'I do not know based on the provided Quran and Azkar context.';
      }

      return text;
    } catch (error) {
      if (error instanceof ServiceUnavailableError) {
        throw error;
      }
      throw new ServiceUnavailableError('Gemini API');
    }
  }
}

export default new GeminiService();
