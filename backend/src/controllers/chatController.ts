import { NextFunction, Response } from 'express';
import ollamaService from '../services/ollamaService.js';
import ragService from '../services/ragService.js';
import { ApiResponse, ChatRequestBody, ChatResponse, CustomRequest } from '../types.js';
import { AppError } from '../utils/errors.js';

export async function sendMessage(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message } = req.body as ChatRequestBody;
    if (!message || typeof message !== 'string' || !message.trim()) {
      throw new AppError('Message is required', 400);
    }

    const context = await ragService.getContext(message);
    const prompt = ollamaService.buildRagPrompt(message.trim(), context);

    let answer = await ollamaService.generateFromPrompt(prompt);
    if (!answer.trim()) {
      answer = 'أعتذر، لا أملك معلومات كافية لأجيب على سؤالك.\n\nI apologize, I do not have enough information to answer your question.\n\nይቅርታ፣ ይህን መጠይቅ ለመመለስ በቂ ዕውቀት የለኝም።';
    }

    res.json({
      success: true,
      data: {
        answer
      }
    } as ApiResponse<ChatResponse>);
  } catch (error) {
    next(error);
  }
}

