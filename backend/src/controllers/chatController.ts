import { NextFunction, Response } from 'express';
import geminiService from '../services/geminiService';
import ragService from '../services/ragService';
import { ApiResponse, ChatRequestBody, ChatResponse, CustomRequest } from '../types';
import { AppError } from '../utils/errors';

function buildPrompt(question: string, context: Awaited<ReturnType<typeof ragService.getContext>>): string {
  const quranSection = context.quran.length
    ? context.quran
        .map(
          (verse) =>
            `- Surah ${verse.surah}, Ayah ${verse.ayah}\n  English: ${verse.english}\n  Amharic: ${verse.amharic}`
        )
        .join('\n')
    : '- No Quran match found.';

  const azkarSection = context.azkar.length
    ? context.azkar
        .map(
          (zikr) =>
            `- Category: ${zikr.category}\n  Arabic: ${zikr.arabic}\n  English: ${zikr.translation_en}\n  Amharic: ${zikr.translation_am}`
        )
        .join('\n')
    : '- No Azkar match found.';

  return [
    'You are an Islamic assistant.',
    'Use ONLY the provided Quran and Azkar context.',
    'If unsure, say you do not know.',
    'Keep the tone respectful, concise, and safe.',
    '',
    `User question: ${question}`,
    '',
    'Quran context:',
    quranSection,
    '',
    'Azkar context:',
    azkarSection
  ].join('\n');
}

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
    const prompt = buildPrompt(message.trim(), context);

    let answer = await geminiService.generateFromPrompt(prompt);
    if (!answer.trim()) {
      answer = 'I do not know based on the provided Quran and Azkar context.';
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

