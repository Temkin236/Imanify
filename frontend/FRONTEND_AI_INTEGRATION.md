# Frontend AI Integration Guide

## Quick Start

### 1. Initialize Chat Service

```typescript
import { chatbotClient } from '@/services/chatbotClient';

// Initialize conversation
const conversationId = await chatbotClient.initializeConversation();
```

### 2. Send a Message

```typescript
const response = await chatbotClient.sendMessage({
  conversationId,
  message: 'What is Zakat?',
  mode: 'general'
});

console.log(response.text); // "Zakat is one of the Five Pillars of Islam..."
```

### 3. Handle Responses

```typescript
const response = await chatbotClient.sendMessage({
  conversationId,
  message: 'Tell me about prayer',
  mode: 'prayer'
});

// Response includes:
// - text: The AI response
// - provider: Which AI provider was used
// - tokensUsed: Tokens consumed
// - responseTime: Time taken in ms
// - cached: Whether response was cached
// - model: Model used
```

## Chat Modes

Different modes optimize responses for specific topics:

```typescript
// General Islamic knowledge
await chatbotClient.sendMessage({
  conversationId,
  message: 'Question here',
  mode: 'general'
});

// Quranic studies and references
await chatbotClient.sendMessage({
  conversationId,
  message: 'Quranic question',
  mode: 'quranic'
});

// Prayer guidance
await chatbotClient.sendMessage({
  conversationId,
  message: 'How do I pray?',
  mode: 'prayer'
});

// Dua and supplications
await chatbotClient.sendMessage({
  conversationId,
  message: 'Which dua for...',
  mode: 'dua'
});

// Islamic jurisprudence
await chatbotClient.sendMessage({
  conversationId,
  message: 'Is this halal?',
  mode: 'fiqh'
});

// Islamic scholarship
await chatbotClient.sendMessage({
  conversationId,
  message: 'Academic question',
  mode: 'scholar'
});
```

## React Components

### Basic Chat Component

```typescript
import { useState, useCallback } from 'react';
import { chatbotClient } from '@/services/chatbotClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatComponent() {
  const [conversationId, setConversationId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'general' | 'quranic' | 'prayer'>('general');

  // Initialize conversation on mount
  const initChat = useCallback(async () => {
    const id = await chatbotClient.initializeConversation();
    setConversationId(id);
  }, []);

  // Send message
  const handleSendMessage = useCallback(async (text: string) => {
    if (!conversationId || !text.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      timestamp: new Date()
    }]);

    setLoading(true);
    try {
      const response = await chatbotClient.sendMessage({
        conversationId,
        message: text,
        mode
      });

      // Add assistant response to UI
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, mode]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Islamic Assistant</h2>
        <select value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="general">General Knowledge</option>
          <option value="quranic">Quranic Studies</option>
          <option value="prayer">Prayer Guidance</option>
        </select>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}
```

### Mode Selector Component

```typescript
import { useEffect, useState } from 'react';
import { chatbotClient } from '@/services/chatbotClient';

export function ModeSelector() {
  const [modes, setModes] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState('general');

  useEffect(() => {
    chatbotClient.getAssistantModes().then(setModes);
  }, []);

  return (
    <div className="mode-selector">
      <label>Select Topic:</label>
      <div className="modes">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={selectedMode === mode.id ? 'active' : ''}
            onClick={() => setSelectedMode(mode.id)}
            title={mode.description}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Conversation History Component

```typescript
import { useEffect, useState } from 'react';
import { chatbotClient } from '@/services/chatbotClient';

export function ConversationHistory({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatbotClient.getConversationHistory(conversationId);
        setMessages(history.messages);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [conversationId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="conversation-history">
      {messages.map((msg, idx) => (
        <div key={idx} className={`history-item ${msg.role}`}>
          <div className="role">{msg.role}</div>
          <div className="content">{msg.content}</div>
          <div className="time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );
}
```

## Service Integration

### Extended Chat Service

```typescript
import { chatbotClient } from '@/services/chatbotClient';

// Get chat modes for UI
export async function getChatModes() {
  const modes = await chatbotClient.getAssistantModes();
  return modes.map(m => ({
    id: m.id,
    label: m.name,
    description: m.description
  }));
}

// Send chat message
export async function sendChatMessage(
  conversationId: string,
  message: string,
  mode: string
) {
  const response = await chatbotClient.sendMessage({
    conversationId,
    message,
    mode
  });

  return {
    text: response.text,
    provider: response.provider,
    cached: response.cached,
    responseTime: response.responseTime
  };
}

// Get conversation summary
export async function getConversationSummary(conversationId: string) {
  return await chatbotClient.getConversationSummary(conversationId);
}

// Load full conversation
export async function loadConversation(conversationId: string) {
  return await chatbotClient.getConversationHistory(conversationId);
}

// Delete conversation
export async function deleteConversation(conversationId: string) {
  return await chatbotClient.deleteConversation(conversationId);
}
```

## Performance Optimization

### Implement Caching in UI

```typescript
const conversationCache = new Map<string, any>();

export async function sendMessageWithCache(
  conversationId: string,
  message: string,
  mode: string
) {
  const cacheKey = `${conversationId}:${message}:${mode}`;

  // Check local cache
  if (conversationCache.has(cacheKey)) {
    console.log('Cache hit!');
    return conversationCache.get(cacheKey);
  }

  // Fetch from server
  const response = await chatbotClient.sendMessage({
    conversationId,
    message,
    mode
  });

  // Cache result if not already from server cache
  if (!response.cached) {
    conversationCache.set(cacheKey, response);
  }

  return response;
}
```

### Batch Message Processing

```typescript
export async function sendBatchMessages(
  conversationId: string,
  messages: Array<{ text: string; mode: string }>
) {
  // Send all messages at once for efficiency
  const responses = await Promise.all(
    messages.map(msg =>
      chatbotClient.sendMessage({
        conversationId,
        message: msg.text,
        mode: msg.mode
      })
    )
  );

  return responses;
}
```

## Error Handling

```typescript
import { useCallback, useState } from 'react';
import { chatbotClient } from '@/services/chatbotClient';

export function useChatWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const sendMessage = useCallback(
    async (conversationId: string, message: string, mode: string) => {
      setError(null);
      let lastError;

      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const response = await chatbotClient.sendMessage({
            conversationId,
            message,
            mode
          });
          setRetryCount(0);
          return response;
        } catch (err: any) {
          lastError = err;
          if (i < MAX_RETRIES - 1) {
            // Exponential backoff
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
          }
        }
      }

      const errorMsg = lastError?.message || 'Failed to send message. Please try again.';
      setError(errorMsg);
      setRetryCount(MAX_RETRIES);
      throw lastError;
    },
    []
  );

  return { sendMessage, error, retryCount };
}
```

## Types & Interfaces

```typescript
// Message types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Response from AI service
export interface AIResponse {
  text: string;
  provider: 'gemini' | 'groq' | 'openrouter';
  tokensUsed: number;
  responseTime: number;
  model: string;
  cached?: boolean;
}

// Chat request
export interface ChatRequest {
  conversationId: string;
  message: string;
  mode: 'general' | 'quranic' | 'prayer' | 'dua' | 'fiqh' | 'scholar';
}

// Assistant mode info
export interface AssistantMode {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
}

// Conversation data
export interface Conversation {
  conversationId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}
```

## Testing

### Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatbotClient } from '@/services/chatbotClient';

describe('Chat Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send message successfully', async () => {
    const response = await chatbotClient.sendMessage({
      conversationId: 'test-123',
      message: 'Hello',
      mode: 'general'
    });

    expect(response).toHaveProperty('text');
    expect(response).toHaveProperty('provider');
    expect(response.text.length).toBeGreaterThan(0);
  });

  it('should get assistant modes', async () => {
    const modes = await chatbotClient.getAssistantModes();

    expect(Array.isArray(modes)).toBe(true);
    expect(modes.length).toBeGreaterThan(0);
    expect(modes[0]).toHaveProperty('id');
    expect(modes[0]).toHaveProperty('name');
  });

  it('should handle errors gracefully', async () => {
    expect(async () => {
      await chatbotClient.sendMessage({
        conversationId: '',
        message: '',
        mode: 'general'
      });
    }).rejects.toThrow();
  });
});
```

### Integration Tests

```typescript
describe('Chat Integration', () => {
  it('should create conversation and send messages', async () => {
    // Initialize
    const convId = await chatbotClient.initializeConversation();
    expect(convId).toBeDefined();

    // Send message
    const response = await chatbotClient.sendMessage({
      conversationId: convId,
      message: 'What is Islam?',
      mode: 'general'
    });

    expect(response.text).toContain('Islam');

    // Get history
    const history = await chatbotClient.getConversationHistory(convId);
    expect(history.messages.length).toBeGreaterThan(0);

    // Cleanup
    await chatbotClient.deleteConversation(convId);
  });
});
```

## API Client Implementation

```typescript
// src/services/chatbotClient.ts
export const chatbotClient = {
  async sendMessage(request: ChatRequest) {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    return response.json();
  },

  async getAssistantModes() {
    const response = await fetch('/api/chat/modes');
    const data = await response.json();
    return data.data.modes;
  },

  async getConversationHistory(conversationId: string) {
    const response = await fetch(`/api/chat/conversation/${conversationId}`);
    return response.json();
  },

  async getConversationSummary(conversationId: string) {
    const response = await fetch(
      `/api/chat/conversation/${conversationId}/summary`
    );
    return response.json();
  },

  async deleteConversation(conversationId: string) {
    const response = await fetch(
      `/api/chat/conversation/${conversationId}`,
      { method: 'DELETE' }
    );
    return response.json();
  },

  async initializeConversation() {
    // Generate unique ID (in production, get from backend)
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
```

## Common Patterns

### Streaming Responses

```typescript
// For real-time streaming (future enhancement)
export async function* streamChatMessage(
  conversationId: string,
  message: string,
  mode: string
) {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    body: JSON.stringify({ conversationId, message, mode })
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value);
  }
}
```

### Auto-Save Conversations

```typescript
export function useAutoSaveConversation(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      await fetch('/api/chat/conversation/save', {
        method: 'POST',
        body: JSON.stringify({ conversationId, messages })
      });
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(saveTimer);
  }, [messages, conversationId]);

  return { messages, setMessages };
}
```

## Deployment Checklist

- [ ] Set all required API keys (.env)
- [ ] Test with multiple chat modes
- [ ] Verify caching is working
- [ ] Monitor provider response times
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Test offline functionality
- [ ] Set up conversation persistence
- [ ] Configure CORS if needed
- [ ] Test batch message processing
