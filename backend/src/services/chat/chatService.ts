/**
 * Chat Service
 * Handles conversation management, context, and message processing
 */

import aiService from '../aiService/aiService.js';
import type { AIMessage } from '../aiService/providers/baseProvider.js';
import type { AssistantMode } from '../aiService/promptManager.js';
import promptManager from '../aiService/promptManager.js';
import ragService from '../ragService.js';
import { generateIslamicFallback } from './islamicFallback.js';
import islamicRefService from '../islamicReferenceService.js';
import type { RagContextResult } from '../../types.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokenCount?: number;
}

export interface ChatSession {
  userId: string;
  conversationId: string;
  mode: AssistantMode;
  messages: ChatMessage[];
  summary?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatServiceResponse {
  success: boolean;
  data?: {
    response: string;
    provider: string;
    tokensUsed: number;
    responseTime: number;
  };
  error?: string;
}

class ChatService {
  private maxContextMessages = 10;
  private maxTokensPerRequest = 4000;

  /**
   * Process user message and generate AI response
   */
  async processMessage(
    userMessage: string,
    session: ChatSession,
    contextMessages: ChatMessage[] = []
  ): Promise<ChatServiceResponse> {
    try {
      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        return {
          success: false,
          error: 'Message cannot be empty'
        };
      }

      if (userMessage.length > 5000) {
        return {
          success: false,
          error: 'Message is too long (max 5000 characters)'
        };
      }

      // Build conversation context with RAG for Islamic mode
      const ragContext =
        session.mode === 'islamic' || session.mode === 'general'
          ? await ragService.getContext(userMessage)
          : null;

      const messages = this.buildContextMessages(
        contextMessages,
        userMessage,
        session.mode,
        ragContext
      );

      console.log(
        `[ChatService] Processing message for mode: ${session.mode} (${messages.length} messages)`
      );

      // Generate response
      const aiResponse = await aiService.generateResponse(
        messages,
        session.mode
      );

      return {
        success: true,
        data: {
          response: aiResponse.text,
          provider: aiResponse.provider,
          tokensUsed: aiResponse.tokensUsed,
          responseTime: aiResponse.responseTime
        }
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('[ChatService] Error:', errorMsg);

      // Fallback to curated Islamic knowledge when AI providers fail
      try {
        const fallbackResponse = await generateIslamicFallback(userMessage);
        return {
          success: true,
          data: {
            response: fallbackResponse,
            provider: 'Islamic Knowledge Base',
            tokensUsed: 0,
            responseTime: 0
          }
        };
      } catch {
        return {
          success: false,
          error: this.getUserFriendlyError(errorMsg)
        };
      }
    }
  }

  /**
   * Build optimized context messages for AI
   */
  private buildContextMessages(
    contextMessages: ChatMessage[],
    userMessage: string,
    _mode: AssistantMode,
    ragContext?: RagContextResult | null
  ): AIMessage[] {
    const result: AIMessage[] = [];

    // Inject verified Quran + Hadith references for Islamic responses
    if (ragContext && (ragContext.quran.length > 0 || ragContext.hadith?.length || ragContext.azkar.length > 0)) {
      const verified = islamicRefService.lookupReferences(userMessage);
      const verifiedBlock = islamicRefService.formatReferencesForAI(verified);

      const contextParts: string[] = [verifiedBlock];

      if (ragContext.azkar.length > 0) {
        contextParts.push('\n--- RELATED AZKAR ---');
        for (const a of ragContext.azkar) {
          contextParts.push(`Dhikr: ${a.arabic} — ${a.translation_en}`);
        }
      }

      result.push({ role: 'system', content: contextParts.join('\n') });
    }

    // Add context messages (limited to max context)
    const messagesToInclude = contextMessages.slice(
      -this.maxContextMessages
    );

    for (const msg of messagesToInclude) {
      result.push({
        role: msg.role,
        content: msg.content
      });
    }

    // Add current user message
    result.push({
      role: 'user',
      content: userMessage
    });

    return result;
  }

  /**
   * Summarize conversation for context when it gets too long
   */
  summarizeConversation(messages: ChatMessage[]): string {
    const recentMessages = messages.slice(-5);
    const summary = recentMessages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join(' → ');

    return summary.substring(0, 200);
  }

  /**
   * Validate conversation session
   */
  validateSession(session: ChatSession): boolean {
    if (!session.userId || !session.conversationId) {
      return false;
    }

    const validModes: AssistantMode[] = promptManager.getAvailableModes();
    if (!validModes.includes(session.mode)) {
      return false;
    }

    return true;
  }

  /**
   * Format user-friendly error messages
   */
  private getUserFriendlyError(error: string): string {
    if (error.includes('timeout')) {
      return 'The request took too long. Please try again.';
    }

    if (error.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (error.includes('API key')) {
      return 'Service configuration error. Please contact support.';
    }

    if (error.includes('quota')) {
      return 'Service quota exceeded. Please try again later.';
    }

    if (error.includes('not available')) {
      return 'Service is temporarily unavailable. Please try again later.';
    }

    if (error.includes('All providers failed')) {
      return 'Unable to process request. All AI services are temporarily unavailable.';
    }

    return 'Something went wrong. Please try again.';
  }

  /**
   * Get token estimate for message
   */
  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if context needs summarization
   */
  shouldSummarize(messages: ChatMessage[]): boolean {
    const totalTokens = messages.reduce(
      (sum, msg) => sum + (msg.tokenCount || this.estimateTokens(msg.content)),
      0
    );

    return totalTokens > this.maxTokensPerRequest * 0.8;
  }

  /**
   * Get available assistant modes
   */
  getAvailableModes(): AssistantMode[] {
    return promptManager.getAvailableModes();
  }

  /**
   * Get mode description
   */
  getModeDescription(mode: AssistantMode): string {
    const descriptions: Record<AssistantMode, string> = {
      islamic:
        'Islamic Knowledge Assistant - Answers based on Quran and Hadith',
      student:
        'Student Productivity Assistant - Learning support and time management',
      coder: 'Senior Software Engineer - Code review and technical guidance',
      general: 'General Knowledge Assistant - Friendly and informative',
      productivity: 'Productivity Coach - Goal setting and workflow optimization'
    };

    return descriptions[mode] || descriptions.general;
  }
}

export default new ChatService();
