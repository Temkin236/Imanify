/**
 * Enhanced Chat Controller
 * Manages chat endpoints and integrates all services
 */

import { NextFunction, Response } from 'express';
import { CustomRequest, ApiResponse } from '../types.js';
import chatService, { ChatSession } from '../services/chat/chatService.js';
import aiService from '../services/aiService/aiService.js';
import { AppError } from '../utils/errors.js';
import type { AssistantMode } from '../services/aiService/promptManager.js';

interface ChatRequestBody {
  message: string;
  conversationId: string;
  mode?: AssistantMode;
  userId: string;
}

interface ChatResponseData {
  response: string;
  provider: string;
  tokensUsed: number;
  responseTime: number;
  mode: AssistantMode;
}

/**
 * Send chat message and get AI response
 * POST /api/chat/send
 */
export async function sendMessage(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, conversationId, mode = 'islamic', userId } =
      req.body as ChatRequestBody;

    // Validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new AppError('Message is required', 400);
    }

    if (!conversationId || typeof conversationId !== 'string') {
      throw new AppError('Conversation ID is required', 400);
    }

    if (!userId || typeof userId !== 'string') {
      throw new AppError('User ID is required', 400);
    }

    if (message.length > 5000) {
      throw new AppError('Message is too long (max 5000 characters)', 400);
    }

    console.log(
      `[Chat] Message from ${userId} in conversation ${conversationId} (mode: ${mode})`
    );

    // Create session
    const session: ChatSession = {
      userId,
      conversationId,
      mode,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Validate session
    if (!chatService.validateSession(session)) {
      throw new AppError('Invalid session configuration', 400);
    }

    // Process message
    const result = await chatService.processMessage(
      message.trim(),
      session,
      [] // In production, load from MongoDB
    );

    if (!result.success || !result.data) {
      throw new AppError(result.error || 'Failed to generate response', 503);
    }

    res.json({
      success: true,
      data: {
        response: result.data.response,
        provider: result.data.provider,
        tokensUsed: result.data.tokensUsed,
        responseTime: result.data.responseTime,
        mode
      } as ChatResponseData,
      timestamp: new Date().toISOString()
    } as ApiResponse<ChatResponseData>);
  } catch (error) {
    next(error);
  }
}

/**
 * Get available assistant modes
 * GET /api/chat/modes
 */
export async function getAssistantModes(
  _req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const modes = chatService.getAvailableModes();
    const modesWithDescriptions = modes.map((mode) => ({
      id: mode,
      name: mode.charAt(0).toUpperCase() + mode.slice(1),
      description: chatService.getModeDescription(mode)
    }));

    res.json({
      success: true,
      data: modesWithDescriptions,
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

/**
 * Get AI service health status
 * GET /api/chat/health
 */
export async function getHealth(
  _req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = await aiService.getStatus();

    res.json({
      success: true,
      data: {
        status: status.providers.some((p) => p.available)
          ? 'healthy'
          : 'degraded',
        providers: status.providers,
        cacheSize: status.cacheSize,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

/**
 * Batch send multiple messages
 * POST /api/chat/batch
 */
export async function batchSendMessages(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { messages, conversationId, mode = 'general', userId } = req.body as {
      messages: string[];
      conversationId: string;
      mode?: AssistantMode;
      userId: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AppError('Messages array is required and must not be empty', 400);
    }

    if (messages.length > 10) {
      throw new AppError('Batch size limited to 10 messages', 400);
    }

    console.log(
      `[Chat] Batch request from ${userId}: ${messages.length} messages`
    );

    const session: ChatSession = {
      userId,
      conversationId,
      mode,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const results = await Promise.all(
      messages.map((msg) => chatService.processMessage(msg, session, []))
    );

    res.json({
      success: true,
      data: results.map((r) => r.data || { error: r.error }),
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

/**
 * Get conversation summary
 * GET /api/chat/conversation/:conversationId/summary
 */
export async function getConversationSummary(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new AppError('Conversation ID is required', 400);
    }

    // In production, fetch from MongoDB
    res.json({
      success: true,
      data: {
        conversationId,
        summary: 'Conversation summary would be fetched from MongoDB',
        messageCount: 0,
        duration: 0
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

/**
 * Get conversation history
 * GET /api/chat/conversation/:conversationId
 */
export async function getConversationHistory(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new AppError('Conversation ID is required', 400);
    }

    // In production, fetch from MongoDB
    res.json({
      success: true,
      data: {
        conversationId,
        messages: [],
        totalMessages: 0
      },
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete conversation
 * DELETE /api/chat/conversation/:conversationId
 */
export async function deleteConversation(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      throw new AppError('Conversation ID is required', 400);
    }

    // In production, delete from MongoDB
    res.json({
      success: true,
      data: { conversationId, deleted: true },
      timestamp: new Date().toISOString()
    } as ApiResponse<object>);
  } catch (error) {
    next(error);
  }
}

