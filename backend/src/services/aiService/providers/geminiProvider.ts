/**
 * Gemini Provider
 * Google's Gemini API implementation
 */

import BaseAIProvider, {
  AIResponse,
  AIMessage
} from './baseProvider.js';

interface GeminiContent {
  role: string;
  parts: { text: string }[];
}

interface GeminiGenerateRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: { text: string }[];
  };
  generationConfig: {
    maxOutputTokens: number;
    temperature: number;
    stopSequences?: string[];
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason: string;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiProvider extends BaseAIProvider {
  private readonly baseUrl =
    'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'gemini-1.5-flash',
      maxTokens: 2000,
      temperature: 0.7,
      timeout: 30000
    });
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string
  ): Promise<AIResponse> {
    if (!this.validateApiKey()) {
      throw new Error('Gemini API key not configured');
    }

    const startTime = Date.now();

    try {
      const requestBody: GeminiGenerateRequest = {
        contents: this.formatMessages(messages),
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          maxOutputTokens: this.maxTokens,
          temperature: this.temperature
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      const response = await this.callWithTimeout(
        fetch(
          `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          }
        ),
        this.timeout
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Gemini API error: ${response.status} - ${errorData}`
        );
      }

      const data = (await response.json()) as GeminiResponse;

      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content.parts[0]
      ) {
        throw new Error('No response from Gemini API');
      }

      const text = data.candidates[0].content.parts
        .map((part) => part.text)
        .join('');

      const responseTime = Date.now() - startTime;

      return {
        text,
        provider: 'Gemini',
        tokensUsed: data.usageMetadata?.totalTokenCount || 0,
        responseTime,
        model: this.model
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Gemini provider failed: ${errorMsg}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!this.validateApiKey()) {
        return false;
      }

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: 'health' }]
              }
            ],
            generationConfig: { maxOutputTokens: 10 }
          })
        }
      );

      return response.status !== 401 && response.status !== 403;
    } catch {
      return false;
    }
  }

  private formatMessages(messages: AIMessage[]): GeminiContent[] {
    return messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }
}

export default GeminiProvider;
