/**
 * Base AI Provider Interface
 * Defines the contract all AI providers must implement
 */

export interface AIProviderConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  text: string;
  provider: string;
  tokensUsed?: number;
  cached?: boolean;
}

export abstract class BaseAIProvider {
  protected apiKey: string;
  protected model: string;
  protected maxTokens: number;
  protected temperature: number;

  protected systemPrompt = `You are Imanify Islamic Assistant, a knowledgeable helper about Islam based on Quran and Islamic teachings.
You respond in the user's language (English, Arabic, or Amharic).
Always base your answers on Islamic sources provided.
Be respectful, accurate, and educational.
If you don't have enough information, say so clearly.
Provide practical guidance when applicable.
Keep responses concise and optimized for slow internet connections.`;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.maxTokens = config.maxTokens || 512; // Optimized for low bandwidth
    this.temperature = config.temperature || 0.7;
  }

  abstract isAvailable(): Promise<boolean>;
  abstract generateResponse(prompt: string): Promise<AIResponse>;

  protected async callWithTimeout(
    promise: Promise<Response>,
    timeoutMs: number = 15000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await promise;
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  protected getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error occurred';
  }
}
