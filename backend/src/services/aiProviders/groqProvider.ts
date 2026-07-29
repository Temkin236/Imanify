/**
 * Groq AI Provider
 * Ultra-fast inference API (perfect for slow connections)
 * Free tier available: 8,000 requests per day
 * 
 * Models: Llama 2, Mistral 7B
 * Latency: ~100ms (very fast)
 * API: https://console.groq.com
 */

import { BaseAIProvider, AIResponse } from './baseProvider.js';
import { AppError } from '../../utils/errors.js';

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
    type?: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export class GroqProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'llama-3.3-70b-versatile',
      maxTokens: 400, // Optimized for low bandwidth
      temperature: 0.7
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Quick check using list models endpoint
      const response = await this.callWithTimeout(
        fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }),
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    console.log('[Groq] Sending request to Groq...');

    try {
      const response = await this.callWithTimeout(
        fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: this.systemPrompt
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: this.temperature,
            max_tokens: this.maxTokens,
            top_p: 0.9,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
          })
        }),
        15000
      );

      if (!response.ok) {
        const errorData = (await response.json()) as GroqResponse;
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;

        if (response.status === 429) {
          throw new AppError('Groq rate limited. Trying fallback...', 429);
        }
        if (response.status === 401) {
          throw new AppError('Invalid Groq API key', 401);
        }

        throw new AppError(`Groq error: ${errorMsg}`, response.status);
      }

      const data = (await response.json()) as GroqResponse;

      if (data.error) {
        throw new AppError(`Groq: ${data.error.message}`, 500);
      }

      const text = data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new AppError('Empty response from Groq', 500);
      }

      console.log('[Groq] ✓ Response received successfully');

      return {
        text,
        provider: 'Groq',
        tokensUsed: (data.usage?.prompt_tokens || 0) + (data.usage?.completion_tokens || 0)
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

      throw new AppError(`Groq error: ${errorMsg}`, 503);
    }
  }
}
