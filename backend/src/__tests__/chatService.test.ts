import { describe, it, expect } from 'vitest';
import chatService, { ChatSession, ChatMessage } from '../services/chat/chatService.js';
import promptManager from '../services/aiService/promptManager.js';

describe('Chat Service & Session Management', () => {
  it('validates a correct chat session configuration', () => {
    const session: ChatSession = {
      userId: 'user_123',
      conversationId: 'conv_456',
      mode: 'islamic',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    expect(chatService.validateSession(session)).toBe(true);
  });

  it('rejects a session missing user ID or conversation ID', () => {
    const invalidSession1: ChatSession = {
      userId: '',
      conversationId: 'conv_456',
      mode: 'islamic',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const invalidSession2: ChatSession = {
      userId: 'user_123',
      conversationId: '',
      mode: 'islamic',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    expect(chatService.validateSession(invalidSession1)).toBe(false);
    expect(chatService.validateSession(invalidSession2)).toBe(false);
  });

  it('summarizes conversation context accurately from recent user messages', () => {
    const messages: ChatMessage[] = [
      { role: 'user', content: 'What is Ramadan?', timestamp: Date.now() },
      { role: 'assistant', content: 'Ramadan is the 9th Islamic month...', timestamp: Date.now() },
      { role: 'user', content: 'What is Laylatul Qadr?', timestamp: Date.now() },
      { role: 'assistant', content: 'It is the Night of Decree...', timestamp: Date.now() },
      { role: 'user', content: 'How to make dua?', timestamp: Date.now() }
    ];

    const summary = chatService.summarizeConversation(messages);
    expect(summary).toContain('What is Ramadan?');
    expect(summary).toContain('What is Laylatul Qadr?');
    expect(summary).toContain('How to make dua?');
    expect(summary).toContain('→');
  });

  it('provides available assistant modes including islamic, student, coder, and general', () => {
    const modes = promptManager.getAvailableModes();
    expect(modes).toContain('islamic');
    expect(modes).toContain('student');
    expect(modes).toContain('general');
  });
});
