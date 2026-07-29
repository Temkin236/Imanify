/**
 * Base AI Provider
 * Abstract base class for all AI providers (Gemini, Groq, OpenRouter)
 */

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface AIResponse {
  text: string;
  provider: string;
  tokensUsed: number;
  responseTime: number;
  model: string;
  cached?: boolean;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export abstract class BaseAIProvider {
  protected apiKey: string;
  protected model: string;
  protected maxTokens: number;
  protected temperature: number;
  protected timeout: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.maxTokens = config.maxTokens || 2000;
    this.temperature = config.temperature ?? 0.7;
    this.timeout = config.timeout || 30000;
  }

  abstract generateResponse(
    messages: AIMessage[],
    systemPrompt: string
  ): Promise<AIResponse>;

  abstract isAvailable(): Promise<boolean>;

  protected async callWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Request timeout after ${timeoutMs}ms`)),
          timeoutMs
        )
      )
    ]);
  }

  protected estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  protected validateApiKey(): boolean {
    return !!(this.apiKey && this.apiKey.length > 0);
  }
}

export default BaseAIProvider;
