import { AppError } from '../utils/errors.js';
import { RagContextResult } from '../types.js';

interface OllamaResponse {
  response?: string;
  error?: string;
}

class OllamaService {
  // Ollama runs locally on port 11434
  private readonly baseUrl = 'http://localhost:11434/api/generate';
  private readonly model = 'mistral'; // Fast, efficient model for Q&A
  private readonly connectionTimeoutMs = 5000;
  private readonly responseTimeoutMs = 60000; // 1 minute for longer responses
  
  private readonly systemPrompt = `You are Imanify Islamic Assistant, a knowledgeable helper about Islam based on Quran and Islamic teachings.
You respond in the user's language (English, Arabic, or Amharic).
Always base your answers on Islamic sources provided.
Be respectful, accurate, and educational.
If you don't have enough information, say so clearly.
Provide practical guidance when applicable.`;

  constructor() {
    this.validateOllamaConnection();
    console.log('[Chat System] ✓ Fallback enabled: Ollama (local) → Gemini (cloud)');
  }

  private async validateOllamaConnection(): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.connectionTimeoutMs);
      
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('[OllamaService] ✓ Connected to Ollama successfully');
        console.log(`[OllamaService] ✓ Using model: ${this.model}`);
      } else {
        console.log('[OllamaService] ⚠ Ollama is configured but not responding');
        console.log('[OllamaService] → Chat will use Gemini Cloud API as fallback');
      }
    } catch (error) {
      console.log('[OllamaService] ⚠ Ollama service not available locally');
      console.log('[OllamaService] → Chat will use Gemini Cloud API as fallback');
    }
  }

  async generateFromPrompt(prompt: string): Promise<string> {
    const fullPrompt = `${this.systemPrompt}\n\nUser Question: ${prompt}`;

    console.log(`[OllamaService] Calling: ${this.model}:generate`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.responseTimeoutMs);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Ollama API Error]', { status: response.status, message: errorBody });

        if (response.status === 404) {
          throw new AppError(
            `Ollama model '${this.model}' not found. Download it with: ollama pull ${this.model}. Ensure Ollama is running on http://localhost:11434`,
            503
          );
        }
        if (response.status === 500 || response.status === 503) {
          throw new AppError('Ollama service is unavailable. Please ensure Ollama is running with: ollama serve', 503);
        }

        throw new AppError(`Ollama API error (${response.status}): ${errorBody}`, 503);
      }

      const payload = (await response.json()) as OllamaResponse;

      if (payload.error) {
        console.error('[Ollama API Error Response]', payload.error);
        throw new AppError(payload.error, 503);
      }

      const text = payload.response?.trim();

      if (!text) {
        return 'أعتذر، لا أملك معلومات كافية لأجيب على سؤالك.\n\nI apologize, I do not have enough information to answer your question.\n\nይቅርታ፣ ይህን መጠይቅ ለመመለስ በቂ ዕውቀት የለኝም።';
      }

      console.log('[OllamaService] ✓ Response generated successfully');
      return text;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      let errorMsg = 'Unknown error';
      if (error instanceof Error) {
        errorMsg = error.message;
        // Check for common connection errors
        if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('fetch failed')) {
          throw new AppError(
            'Cannot connect to Ollama service. Please ensure Ollama is running: ollama serve',
            503
          );
        }
        if (errorMsg.includes('AbortError') || errorMsg.includes('timeout')) {
          throw new AppError(
            'Ollama request timed out. The service may be overloaded or not responding.',
            504
          );
        }
      }
      
      console.error('[Ollama Service Error]', errorMsg);
      throw new AppError(`Ollama API error: ${errorMsg}`, 503);
    }
  }

  async generateFromRagContext(ragContext: any, userPrompt: string): Promise<string> {
    // If RAG context is provided, include it in the prompt
    const contextText = ragContext?.context ? `\nContext: ${ragContext.context}` : '';
    const fullPrompt = `${this.systemPrompt}${contextText}\n\nUser Question: ${userPrompt}`;

    return this.generateFromPrompt(fullPrompt);
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

  /**
   * Check if Ollama is available and responsive
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new OllamaService();
