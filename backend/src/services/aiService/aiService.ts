/**
 * Unified AI Service
 * Main orchestrator for all AI providers with intelligent fallback and caching
 */

import config from '../../utils/config.js';
import { AppError } from '../../utils/errors.js';
import GeminiProvider from './providers/geminiProvider.js';
import GroqProvider from './providers/groqProvider.js';
import OpenRouterProvider from './providers/openrouterProvider.js';
import type BaseAIProvider from './providers/baseProvider.js';
import type { AIResponse, AIMessage } from './providers/baseProvider.js';
import promptManager, { type AssistantMode } from './promptManager.js';

interface CacheEntry {
  response: AIResponse;
  timestamp: number;
}

interface ProviderError {
  provider: string;
  error: string;
}

class UnifiedAIService {
  private providers: BaseAIProvider[] = [];
  private providerNames: string[] = [];
  private responseCache: Map<string, CacheEntry> = new Map();
  private readonly cacheTimeoutMs = 24 * 60 * 60 * 1000; // 24 hours
  private readonly requestTimeoutMs = 30000; // 30 seconds
  private lastUsedProvider = 0;

  constructor() {
    this.initializeProviders();
    this.cleanupCache();
  }

  /**
   * Initialize all configured providers
   */
  private initializeProviders(): void {
    console.log('[AIService] Initializing AI providers...');

    // Priority 1: Groq (Fastest)
    const groqKey = config.get('groqApiKey');
    if (typeof groqKey === 'string' && groqKey.length > 0) {
      this.providers.push(new GroqProvider(groqKey));
      this.providerNames.push('Groq');
      console.log('[AIService] ✓ Groq configured (priority 1)');
    } else {
      console.log('[AIService] ⚠ Groq not configured');
    }

    // Priority 2: Gemini (Reliable)
    const geminiKey = config.get('geminiApiKey');
    if (typeof geminiKey === 'string' && geminiKey.length > 0) {
      this.providers.push(new GeminiProvider(geminiKey));
      this.providerNames.push('Gemini');
      console.log('[AIService] ✓ Gemini configured (priority 2)');
    } else {
      console.log('[AIService] ⚠ Gemini not configured');
    }

    // Priority 3: OpenRouter (Most models)
    const openrouterKey = config.get('openrouterApiKey');
    if (typeof openrouterKey === 'string' && openrouterKey.length > 0) {
      this.providers.push(new OpenRouterProvider(openrouterKey));
      this.providerNames.push('OpenRouter');
      console.log('[AIService] ✓ OpenRouter configured (priority 3)');
    } else {
      console.log('[AIService] ⚠ OpenRouter not configured');
    }

    if (this.providers.length === 0) {
      console.error(
        '[AIService] ❌ CRITICAL: No AI providers configured'
      );
      throw new Error(
        'No AI providers configured. Please set at least one API key.'
      );
    }

    console.log(
      `[AIService] ✓ Ready with ${this.providers.length} provider(s): ${this.providerNames.join(', ')}`
    );
  }

  /**
   * Main chat endpoint - generates response with intelligent fallback
   */
  async generateResponse(
    messages: AIMessage[],
    mode: AssistantMode = 'general'
  ): Promise<AIResponse> {
    // Get system prompt for mode
    const systemPrompt = promptManager.getSystemPrompt(mode);

    // Check cache first
    const cacheKey = this.getCacheKey(messages, mode);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('[AIService] ✓ Returning cached response');
      return { ...cached, cached: true };
    }

    const errors: ProviderError[] = [];

    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex =
        (this.lastUsedProvider + i) % this.providers.length;
      const provider = this.providers[providerIndex];
      const providerName = this.providerNames[providerIndex];

      try {
        console.log(
          `[AIService] Attempting provider: ${providerName} (${providerIndex + 1}/${this.providers.length})`
        );

        // Check if provider is available
        const isAvailable = await this.withTimeout(
          provider.isAvailable(),
          3000
        );

        if (!isAvailable) {
          console.log(
            `[AIService] ⚠ ${providerName} not available, trying next...`
          );
          errors.push({
            provider: providerName,
            error: 'Provider not available'
          });
          continue;
        }

        // Generate response
        const response = await this.withTimeout(
          provider.generateResponse(messages, systemPrompt),
          this.requestTimeoutMs
        );

        // Update last used provider for load balancing
        this.lastUsedProvider =
          (providerIndex + 1) % this.providers.length;

        // Cache the response
        this.saveToCache(cacheKey, response);

        console.log(
          `[AIService] ✓ Response from ${providerName} (${response.responseTime}ms)`
        );
        return response;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Unknown error';
        console.warn(
          `[AIService] ✗ ${providerName} failed: ${errorMsg}`
        );
        errors.push({
          provider: providerName,
          error: errorMsg
        });
      }
    }

    // All providers failed
    const errorDetails = errors
      .map((e) => `${e.provider}: ${e.error}`)
      .join('; ');

    console.error(
      `[AIService] ❌ All providers failed: ${errorDetails}`
    );

    throw new AppError(
      `Unable to generate response. All AI providers failed. Please try again later.`,
      503
    );
  }

  /**
   * Batch generate responses for multiple messages
   */
  async generateBatch(
    messagesList: AIMessage[][],
    mode: AssistantMode = 'general'
  ): Promise<AIResponse[]> {
    return Promise.all(
      messagesList.map((messages) => this.generateResponse(messages, mode))
    );
  }

  /**
   * Get provider status for health checks
   */
  async getStatus(): Promise<{
    providers: Array<{ name: string; available: boolean }>;
    cacheSize: number;
    totalMessages: number;
  }> {
    const providerStatus = await Promise.all(
      this.providers.map(async (provider, index) => ({
        name: this.providerNames[index],
        available: await provider.isAvailable().catch(() => false)
      }))
    );

    return {
      providers: providerStatus,
      cacheSize: this.responseCache.size,
      totalMessages: this.providers.length
    };
  }

  // ============= CACHE MANAGEMENT =============

  private getCacheKey(messages: AIMessage[], mode: string): string {
    const messageText = messages
      .map((m) => `${m.role}:${m.content}`)
      .join('|');
    return Buffer.from(`${mode}:${messageText}`).toString('base64');
  }

  private getFromCache(key: string): AIResponse | null {
    const entry = this.responseCache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > this.cacheTimeoutMs) {
      this.responseCache.delete(key);
      return null;
    }

    return entry.response;
  }

  private saveToCache(key: string, response: AIResponse): void {
    // Limit cache size to 100 entries
    if (this.responseCache.size >= 100) {
      const firstKey = this.responseCache.keys().next().value as string;
      if (firstKey) {
        this.responseCache.delete(firstKey);
      }
    }

    this.responseCache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  private cleanupCache(): void {
    // Cleanup old cache entries every hour
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.responseCache) {
        if (now - entry.timestamp > this.cacheTimeoutMs) {
          this.responseCache.delete(key);
        }
      }
      console.log(
        `[AIService] Cache cleanup: ${this.responseCache.size} entries remaining`
      );
    }, 60 * 60 * 1000);
  }

  // ============= UTILITIES =============

  private async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(`Operation timed out after ${timeoutMs}ms`)
            ),
          timeoutMs
        )
      )
    ]);
  }

  /**
   * Get assistant modes
   */
  getAssistantModes(): string[] {
    return promptManager.getAvailableModes();
  }

  /**
   * Clear cache (admin only)
   */
  clearCache(): void {
    this.responseCache.clear();
    console.log('[AIService] Cache cleared');
  }
}

export default new UnifiedAIService();
