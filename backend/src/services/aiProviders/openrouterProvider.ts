/**
 * OpenRouter AI Provider
 * Free API with excellent models optimized for Ethiopia
 * Supports: Llama 2, Mistral, and other open models
 * 
 * Free tier: Great for testing, handles slow connections well
 * No credit card required for free models
 * API: https://openrouter.ai
 */

import { BaseAIProvider, AIResponse } from './baseProvider.js';
import { AppError } from '../../utils/errors.js';

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
    code?: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export class OpenRouterProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly httpReferer = 'https://imanify.vercel.app'; // Required by OpenRouter
  private readonly appName = 'Imanify/1.0.0'; // Identifies your app to OpenRouter

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'meta-llama/llama-2-7b-chat:free', // Fast, free model
      maxTokens: 400, // Shorter responses for slow connections
      temperature: 0.7
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.callWithTimeout(
        fetch(`${this.baseUrl.replace('/chat/completions', '/models')}`, {
          headers: this.getHeaders()
        }),
        5000
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateResponse(prompt: string): Promise<AIResponse> {
    console.log('[OpenRouter] Sending request to OpenRouter...');

    try {
      const response = await this.callWithTimeout(
        fetch(this.baseUrl, {
          method: 'POST',
          headers: this.getHeaders(),
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
            frequency_penalty: 0.5, // Reduce repetition
            presence_penalty: 0.5
          })
        }),
        15000
      );

      if (!response.ok) {
        const errorData = (await response.json()) as OpenRouterResponse;
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;

        if (response.status === 429) {
          throw new AppError('OpenRouter rate limited. Trying fallback...', 429);
        }
        if (response.status === 401) {
          throw new AppError('Invalid OpenRouter API key', 401);
        }

        throw new AppError(`OpenRouter error: ${errorMsg}`, response.status);
      }

      const data = (await response.json()) as OpenRouterResponse;

      if (data.error) {
        throw new AppError(`OpenRouter: ${data.error.message}`, 500);
      }

      const text = data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new AppError('Empty response from OpenRouter', 500);
      }

      console.log('[OpenRouter] ✓ Response received successfully');

      return {
        text,
        provider: 'OpenRouter',
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

      throw new AppError(`OpenRouter error: ${errorMsg}`, 503);
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': this.httpReferer, // Required by OpenRouter
      'X-Title': this.appName // Identifies your app
    };
  }
}
