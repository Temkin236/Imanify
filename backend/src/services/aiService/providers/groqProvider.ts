/**
 * Groq Provider
 * Groq's ultra-fast LLM inference API
 * Best for: Speed-optimized responses (~100ms)
 */

import BaseAIProvider, {
  AIResponse,
  AIMessage
} from './baseProvider.js';

interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface GroqResponseChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
  index: number;
}

interface GroqResponseUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqResponseChoice[];
  usage: GroqResponseUsage;
}

export class GroqProvider extends BaseAIProvider {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(apiKey: string) {
    super({
      apiKey,
      model: 'llama-3.3-70b-versatile',
      maxTokens: 2000,
      temperature: 0.7,
      timeout: 20000 // Groq is very fast, use shorter timeout
    });
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string
  ): Promise<AIResponse> {
    if (!this.validateApiKey()) {
      throw new Error('Groq API key not configured');
    }

    const startTime = Date.now();

    try {
      const groqMessages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const requestBody: GroqRequest = {
        model: this.model,
        messages: groqMessages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        top_p: 0.9
      };

      const response = await this.callWithTimeout(
        fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestBody)
        }),
        this.timeout
      );

      if (!response.ok) {
        const errorData = await response.text();

        // Handle specific Groq errors
        if (response.status === 429) {
          throw new Error('Groq rate limit exceeded');
        }
        if (response.status === 401) {
          throw new Error('Groq API key invalid');
        }

        throw new Error(
          `Groq API error: ${response.status} - ${errorData}`
        );
      }

      const data = (await response.json()) as GroqResponse;

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('No response from Groq API');
      }

      const text = data.choices[0].message.content;
      const responseTime = Date.now() - startTime;

      return {
        text,
        provider: 'Groq',
        tokensUsed: data.usage?.total_tokens || 0,
        responseTime,
        model: this.model
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Groq provider failed: ${errorMsg}`);
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
          Authorization: `Bearer ${this.apiKey}`
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

export default GroqProvider;
