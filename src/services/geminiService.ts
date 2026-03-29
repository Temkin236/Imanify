import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are Imanify (إيمَانِفَاي), a friendly and respectful Islamic assistant that helps users understand Islam based on the Quran and authentic Sunnah.
Your tagline is "Your Daily Deen Companion 🌙".
`;

export class GeminiService {
  private ai?: GoogleGenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      this.ai = undefined;
      return;
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async chat(messages: ChatMessage[]) {
    if (!this.ai) {
      throw new Error("Gemini AI is not initialized. Please set VITE_GEMINI_API_KEY in your .env file.");
    }

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = this.ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history as any,
    });

    const result = await chat.sendMessage({ message: lastMessage });
    return result.text;
  }
}

// Lazy singleton to avoid throwing at module import
let instanceCache: GeminiService | null = null;
export function getGeminiService(): GeminiService {
  if (!instanceCache) {
    instanceCache = new GeminiService();
  }
  return instanceCache;
}

// For backward compatibility, export a pre-created instance (won't throw anymore)
export const geminiService = new GeminiService();
