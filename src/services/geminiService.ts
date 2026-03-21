import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are Imanify (إيمَانِفَاي), a friendly and respectful Islamic assistant that helps users understand Islam based on the Quran and authentic Sunnah.
Your tagline is "Your Daily Deen Companion 🌙".
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async chat(messages: ChatMessage[]) {
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

export const geminiService = new GeminiService();
