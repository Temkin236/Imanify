/**
 * Gemini AI Provider
 * Google's free API (good fallback)
 * Free tier: 60 requests per minute
 * 
 * Models: Gemini 2.0 Flash
 * Known for: Reliability, good multilingual support
 * API: https://ai.google.dev
 */

import { BaseAIProvider, AIResponse } from './baseProvider.js';
import { AppError } from '../../utils/errors.js';

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
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
  };
}

export class GeminiProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1/models';
  protected readonly model = 'gemini-2.0-flash';

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'gemini-2.0-flash',
      maxTokens: 400, // Optimized for low bandwidth
      temperature: 0.7
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.callWithTimeout(
        fetch(
          `${this.baseUrl}?key=${this.apiKey}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ),
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    console.log('[Gemini] Sending request to Gemini...');

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await this.callWithTimeout(
        fetch(url, {
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
              temperature: this.temperature,
              topP: 0.9,
              topK: 40,
              maxOutputTokens: this.maxTokens,
              frequencyPenalty: 0.5,
              presencePenalty: 0.5
            }
          })
        }),
        15000
      );

      if (!response.ok) {
        const errorData = (await response.json()) as GeminiResponse;
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;

        if (response.status === 429) {
          throw new AppError('Gemini rate limited. Trying fallback...', 429);
        }
        if (response.status === 401 || response.status === 403) {
          throw new AppError('Invalid Gemini API key', 401);
        }

        throw new AppError(`Gemini error: ${errorMsg}`, response.status);
      }

      const data = (await response.json()) as GeminiResponse;

      if (data.error) {
        throw new AppError(`Gemini: ${data.error.message}`, 500);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        throw new AppError('Empty response from Gemini', 500);
      }

      console.log('[Gemini] ✓ Response received successfully');

      return {
        text,
        provider: 'Gemini',
        tokensUsed:
          (data.usageMetadata?.promptTokenCount || 0) +
          (data.usageMetadata?.candidatesTokenCount || 0)
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const errorMsg = this.getErrorMessage(error);

      if (
        errorMsg.includes('fetch failed') ||
        errorMsg.includes('ECONNREFUSED') ||
        errorMsg.includes('ETIMEDOUT')
      ) {
        throw new AppError('Network error. Please check your connection.', 503);
      }

      throw new AppError(`Gemini error: ${errorMsg}`, 503);
    }
  }
}
