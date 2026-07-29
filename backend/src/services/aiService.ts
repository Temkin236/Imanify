/**
 * Unified AI Service
 * Manages multiple AI providers with intelligent fallback
 * Optimized for low bandwidth connections in Ethiopia
 * 
 * Provider Priority:
 * 1. OpenRouter (free, excellent models)
 * 2. Groq (fastest, free tier)
 * 3. Gemini (reliable fallback)
 */

import config from '../utils/config.js';
import { AppError } from '../utils/errors.js';
import { OpenRouterProvider } from './aiProviders/openrouterProvider.js';
import { GroqProvider } from './aiProviders/groqProvider.js';
import { GeminiProvider } from './aiProviders/geminiProvider.js';
import type { BaseAIProvider, AIResponse } from './aiProviders/baseProvider.js';

interface CacheEntry {
  response: AIResponse;
  timestamp: number;
}

class UnifiedAIService {
  private providers: BaseAIProvider[] = [];
  private providerNames: string[] = [];
  private responseCache: Map<string, CacheEntry> = new Map();
  private readonly cacheTimeoutMs = 24 * 60 * 60 * 1000; // 24 hours
  private readonly requestTimeoutMs = 20000; // 20 seconds total
  private lastUsedProvider = 0;

  constructor() {
    this.initializeProviders();
    this.cleanupCache();
  }

  private initializeProviders(): void {
    console.log('[AIService] Initializing AI providers...');

    // Priority 1: OpenRouter
    const openrouterKey = config.get('openrouterApiKey') as string | undefined;
    if (openrouterKey) {
      this.providers.push(new OpenRouterProvider(openrouterKey));
      this.providerNames.push('OpenRouter');
      console.log('[AIService] ✓ OpenRouter configured');
    } else {
      console.log('[AIService] ⚠ OpenRouter not configured (set OPENROUTER_API_KEY)');
    }

    // Priority 2: Groq
    const groqKey = config.get('groqApiKey') as string | undefined;
    if (groqKey) {
      this.providers.push(new GroqProvider(groqKey));
      this.providerNames.push('Groq');
      console.log('[AIService] ✓ Groq configured');
    } else {
      console.log('[AIService] ⚠ Groq not configured (set GROQ_API_KEY)');
    }

    // Priority 3: Gemini
    const geminiKey = config.get('geminiApiKey');
    if (typeof geminiKey === 'string' && geminiKey.length > 0) {
      this.providers.push(new GeminiProvider(geminiKey));
      this.providerNames.push('Gemini');
      console.log('[AIService] ✓ Gemini configured');
    } else {
      console.log('[AIService] ⚠ Gemini not configured (set GEMINI_API_KEY)');
    }

    if (this.providers.length === 0) {
      throw new Error(
        '[CRITICAL] No AI providers configured. Please set at least one of: OPENROUTER_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY'
      );
    }

    console.log(
      `[AIService] ✓ Ready with ${this.providers.length} provider(s): ${this.providerNames.join(', ')}`
    );
  }

  /**
   * Generate response with intelligent provider selection
   * Uses fallback chain if primary provider fails
   */
  async generateResponse(prompt: string): Promise<AIResponse> {
    // Check cache first
    const cacheKey = this.getCacheKey(prompt);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('[AIService] ✓ Returning cached response');
      return { ...cached, cached: true };
    }

    const errors: Array<{ provider: string; error: string }> = [];

    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const providerIndex = (this.lastUsedProvider + i) % this.providers.length;
      const provider = this.providers[providerIndex];
      const providerName = this.providerNames[providerIndex];

      try {
        console.log(`[AIService] Attempting provider: ${providerName}`);

        // Check if provider is available
        const isAvailable = await this.withTimeout(provider.isAvailable(), 3000);
        if (!isAvailable) {
          console.log(`[AIService] ${providerName} is not available, trying next...`);
          errors.push({
            provider: providerName,
            error: 'Provider not available'
          });
          continue;
        }

        // Generate response
        const response = await this.withTimeout(
          provider.generateResponse(prompt),
          this.requestTimeoutMs
        );

        // Update last used provider for load balancing
        this.lastUsedProvider = (providerIndex + 1) % this.providers.length;

        // Cache the response
        this.saveToCache(cacheKey, response);

        console.log(`[AIService] ✓ Response from ${providerName}`);
        return response;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`[AIService] ${providerName} failed: ${errorMsg}`);
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
    throw new AppError(
      `All AI providers failed. Errors: ${errorDetails}. Please check your API keys and internet connection.`,
      503
    );
  }

  /**
   * Build optimized prompt for low bandwidth
   * Reduces context and requests concise responses
   */
  buildOptimizedPrompt(
    question: string,
    ragContext: { quran: unknown[]; azkar: unknown[] }
  ): string {
    const quranLines = Math.min(3, ragContext.quran.length);
    const azkarLines = Math.min(2, ragContext.azkar.length);

    return `Answer this question concisely (max 200 words) based on the sources below.

Question: ${question}

Islamic Sources:
${this.formatContext(ragContext, quranLines, azkarLines)}

Respond in the user's language. Be direct and helpful.`;
  }

  private formatContext(
    context: { quran: unknown[]; azkar: unknown[] },
    quranLimit: number,
    azkarLimit: number
  ): string {
    const quranItems = (context.quran || [])
      .slice(0, quranLimit)
      .map(
        (q: any) =>
          `📖 ${q.surah}:${q.ayah} - ${q.english}`
      )
      .join('\n');

    const azkarItems = (context.azkar || [])
      .slice(0, azkarLimit)
      .map((a: any) => `🤲 ${a.translation_en}`)
      .join('\n');

    return `${quranItems || 'No verses found'}\n\n${azkarItems || 'No azkar found'}`;
  }

  /**
   * Get provider status for monitoring
   */
  async getStatus(): Promise<{
    providers: Array<{ name: string; available: boolean }>;
    cacheSize: number;
  }> {
    const providerStatus = await Promise.all(
      this.providers.map(async (provider, index) => ({
        name: this.providerNames[index],
        available: await provider.isAvailable().catch(() => false)
      }))
    );

    return {
      providers: providerStatus,
      cacheSize: this.responseCache.size
    };
  }

  // Cache management
  private getCacheKey(prompt: string): string {
    return Buffer.from(prompt).toString('base64');
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
    }, 60 * 60 * 1000);
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      )
    ]);
  }
}

export default new UnifiedAIService();
