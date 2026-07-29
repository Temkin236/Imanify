/**
 * OpenRouter Provider
 * OpenRouter aggregates multiple open-source models
 * Best for: Most model choices and compatibility
 */

import BaseAIProvider, {
  AIResponse,
  AIMessage
} from './baseProvider.js';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
}

interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenRouterResponseChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: OpenRouterResponseChoice[];
  usage: OpenRouterUsage;
}

export class OpenRouterProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly appName = 'Imanify';

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'meta-llama/llama-2-70b-chat',
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
      throw new Error('OpenRouter API key not configured');
    }

    const startTime = Date.now();

    try {
      const openrouterMessages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const requestBody: OpenRouterRequest = {
        model: this.model,
        messages: openrouterMessages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        top_p: 0.95,
        top_k: 40
      };

      const response = await this.callWithTimeout(
        fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': `https://imanify.com`, // OpenRouter requirement
            'X-Title': this.appName
          },
          body: JSON.stringify(requestBody)
        }),
        this.timeout
      );

      if (!response.ok) {
        const errorData = await response.text();

        // Handle specific OpenRouter errors
        if (response.status === 429) {
          throw new Error('OpenRouter rate limit exceeded');
        }
        if (response.status === 401) {
          throw new Error('OpenRouter API key invalid');
        }
        if (response.status === 402) {
          throw new Error('OpenRouter quota exceeded');
        }

        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorData}`
        );
      }

      const data = (await response.json()) as OpenRouterResponse;

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('No response from OpenRouter API');
      }

      const text = data.choices[0].message.content;
      const responseTime = Date.now() - startTime;

      return {
        text,
        provider: 'OpenRouter',
        tokensUsed: data.usage?.total_tokens || 0,
        responseTime,
        model: this.model
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`OpenRouter provider failed: ${errorMsg}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (!this.validateApiKey()) {
        return false;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://imanify.com',
          'X-Title': this.appName
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'health' }],
          max_tokens: 5
        })
      });

      return response.status !== 401 && response.status !== 403;
    } catch {
      return false;
    }
  }
}

export default OpenRouterProvider;
