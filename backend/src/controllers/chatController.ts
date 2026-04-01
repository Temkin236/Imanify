import { NextFunction, Response } from 'express';
import geminiService from '../services/geminiService';
import ragService from '../services/ragService';
import { ApiResponse, ChatRequestBody, ChatResponse, CustomRequest } from '../types';
import { AppError } from '../utils/errors';

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
    const prompt = geminiService.buildRagPrompt(message.trim(), context);

    let answer = await geminiService.generateFromPrompt(prompt);
    if (!answer.trim()) {
      answer = 'أعتذر، لا أملك معلومات كافية لأجيب على سؤالك.\n\nI apologize, I do not have enough information to answer your question.\n\nይቅርታ፣ ይህን መጠይቅ ለመመለስ በቂ ዕውቀት የለኝም።';
    }

    res.json({
      success: true,
      data: {
        answer,
        context
      }
    } as ApiResponse<ChatResponse>);
  } catch (error) {
    next(error);
  }
}

