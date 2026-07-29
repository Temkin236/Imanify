# AI Service Implementation Guide

## Overview

The Imanify AI Service is a unified, multi-provider system that intelligently routes requests to the best available AI provider with fallback support, caching, and batch processing capabilities.

## Architecture

### Core Components

#### 1. **AI Service** (`src/services/aiService/aiService.ts`)
Main orchestrator that manages providers, caching, and failover logic.

**Key Methods:**
- `generateResponse(messages, mode)` - Generate AI responses with intelligent provider selection
- `getStatus()` - Get health status of all providers
- `getAssistantModes()` - List available assistant modes
- `batchGenerateResponses(requests)` - Process multiple requests efficiently

**Features:**
- Intelligent provider fallback (if Gemini fails, tries Groq, then OpenRouter)
- In-memory LRU caching for responses
- Performance monitoring and logging
- Token counting and cost estimation

#### 2. **Providers**
Abstraction layer for different AI APIs:

- **Gemini Provider** (`geminiProvider.ts`)
  - Best for: Advanced reasoning tasks, multimodal capabilities
  - Model: `gemini-2.0-flash`
  - Cost: Free tier available
  - Speed: ~200ms average

- **Groq Provider** (`groqProvider.ts`)
  - Best for: Speed-critical tasks, high throughput
  - Model: `mixtral-8x7b-32768`
  - Cost: Free tier available
  - Speed: ~100ms average (fastest)

- **OpenRouter Provider** (`openrouterProvider.ts`)
  - Best for: Maximum model choice, fallback compatibility
  - Models: 100+ open-source models
  - Cost: Pay-per-use
  - Speed: Varies by model

#### 3. **Prompt Manager** (`promptManager.ts`)
Manages system prompts and configurations for different assistant modes.

**Assistant Modes:**
- `general` - General-purpose Islamic knowledge Q&A
- `quranic` - Specialized Quranic interpretation and references
- `prayer` - Prayer timing, techniques, and guidance
- `dua` - Dua and supplication guidance
- `fiqh` - Islamic jurisprudence and rulings
- `scholar` - Academic Islamic scholarship

#### 4. **Chat Service** (`src/services/chat/chatService.ts`)
High-level conversation management with context handling.

**Features:**
- Conversation history management
- Context window optimization (configurable max messages)
- Message role management (user, assistant, system)
- Token counting and optimization

### Data Flow

```
Request → Chat Service → AI Service
                            ↓
                    [Check Cache] → Return (if hit)
                            ↓
                    Provider Selection (Gemini → Groq → OpenRouter)
                            ↓
                    [API Call] → Process Response
                            ↓
                    [Update Cache] → Return Response
```

## API Endpoints

### Chat Endpoints

#### Send Single Message
```http
POST /api/chat/send
Content-Type: application/json

{
  "conversationId": "conv_123",
  "message": "What is Zakat?",
  "mode": "general"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "response": {
      "text": "Zakat is one of the Five Pillars of Islam...",
      "provider": "gemini",
      "tokensUsed": 150,
      "responseTime": 1250,
      "model": "gemini-2.0-flash",
      "cached": false
    }
  }
}
```

#### Send Batch Messages
```http
POST /api/chat/batch
Content-Type: application/json

{
  "conversationId": "conv_123",
  "messages": [
    {"content": "What is Salah?", "mode": "prayer"},
    {"content": "What is Hajj?", "mode": "general"}
  ]
}
```

#### Get Assistant Modes
```http
GET /api/chat/modes
```

**Response:**
```json
{
  "success": true,
  "data": {
    "modes": [
      {
        "id": "general",
        "name": "General Islamic Knowledge",
        "description": "General-purpose Islamic Q&A",
        "systemPrompt": "You are an Islamic knowledge assistant..."
      },
      ...
    ]
  }
}
```

#### Health Check
```http
GET /api/chat/health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "providers": [
      {
        "name": "Gemini",
        "available": true,
        "responseTime": 850
      },
      {
        "name": "Groq",
        "available": true,
        "responseTime": 120
      }
    ],
    "cacheSize": 45
  }
}
```

### Conversation Endpoints

#### Get Conversation History
```http
GET /api/chat/conversation/conv_123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "messages": [
      {
        "role": "user",
        "content": "What is Zakat?",
        "timestamp": 1704067200000
      },
      {
        "role": "assistant",
        "content": "Zakat is one of the Five Pillars...",
        "timestamp": 1704067201250
      }
    ]
  }
}
```

#### Get Conversation Summary
```http
GET /api/chat/conversation/conv_123/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "summary": "Discussion about Islamic pillars and practices",
    "keyTopics": ["Zakat", "Prayer", "Islamic Finance"],
    "messageCount": 12
  }
}
```

#### Delete Conversation
```http
DELETE /api/chat/conversation/conv_123
```

## Configuration

### Environment Variables

```bash
# Google Gemini
GEMINI_API_KEY=your_gemini_key

# Groq
GROQ_API_KEY=your_groq_key

# OpenRouter
OPENROUTER_API_KEY=your_openrouter_key

# AI Service Config
AI_SERVICE_CACHE_SIZE=100           # Max cached responses
AI_SERVICE_CACHE_TTL=3600000       # Cache TTL in ms (1 hour)
AI_SERVICE_MAX_RETRIES=2           # Provider retry attempts
AI_SERVICE_REQUEST_TIMEOUT=30000   # Request timeout in ms
```

### Runtime Configuration

```typescript
// Customize assistant mode prompts
promptManager.updateSystemPrompt('quranic', 'Your custom prompt here');

// Adjust cache settings
aiService.setCacheSize(200);

// Configure provider priority
aiService.setProviderPriority(['groq', 'gemini', 'openrouter']);
```

## Usage Examples

### Basic Chat Interaction

```typescript
import aiService from './services/aiService/aiService.js';
import chatService from './services/chat/chatService.js';

// Initialize conversation
const session = chatService.createSession('user_123', 'conv_456');

// Send message
const response = await chatService.addMessage(
  session,
  'What are the pillars of Islam?',
  'general'
);

console.log(response.text);
// Output: "The Five Pillars of Islam are: 1. Shahada..."
```

### Using Specific Provider

```typescript
// Force Groq (fastest)
const response = await aiService.generateResponse(
  [{ role: 'user', content: 'Quick question?', content: 'test' }],
  'general'
);

// Groq will be tried first due to speed
console.log(response.provider); // 'groq'
```

### Batch Processing

```typescript
const requests = [
  { content: 'What is Zakat?', mode: 'general' },
  { content: 'Prayer times for today?', mode: 'prayer' },
  { content: 'Islamic finance rules?', mode: 'fiqh' }
];

const responses = await aiService.batchGenerateResponses(requests);
responses.forEach((r, i) => {
  console.log(`Q${i + 1}: ${r.text}`);
});
```

## Performance Tuning

### Cache Optimization

```typescript
// Monitor cache hit rate
const status = await aiService.getStatus();
console.log(`Cache hits: ${status.cacheStats.hits}`);
console.log(`Hit rate: ${(status.cacheStats.hitRate * 100).toFixed(2)}%`);

// Clear cache periodically
aiService.clearCache();
```

### Provider Selection Strategy

**Latency-Critical Tasks:**
```typescript
// Groq is fastest, set as priority
aiService.setProviderPriority(['groq', 'gemini', 'openrouter']);
```

**Quality-Critical Tasks:**
```typescript
// Gemini has best reasoning, set as priority
aiService.setProviderPriority(['gemini', 'groq', 'openrouter']);
```

**Cost-Optimization:**
```typescript
// Use cached responses and batch processing
const cached = await aiService.getFromCache(cacheKey);
if (cached) return cached;
```

## Error Handling

### Provider Failures

All providers support automatic failover:

```typescript
try {
  const response = await aiService.generateResponse(messages, 'general');
  // If Gemini fails, automatically tries Groq, then OpenRouter
  console.log(`Response from: ${response.provider}`);
} catch (error) {
  if (error.message.includes('All providers failed')) {
    // All providers are down
    return 'Service temporarily unavailable';
  }
}
```

### Rate Limiting

Each provider has built-in rate limit handling:

```typescript
// Groq: 30 requests/minute free tier
// Gemini: 15 requests/minute free tier
// OpenRouter: Depends on account

// Implement retry logic with exponential backoff
const maxRetries = 3;
let attempt = 0;
while (attempt < maxRetries) {
  try {
    return await aiService.generateResponse(messages, mode);
  } catch (error) {
    attempt++;
    await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
  }
}
```

## Monitoring & Logging

### Debug Mode

```bash
# Enable detailed logging
DEBUG=imanify:* npm start
```

### Metrics

```typescript
// Get provider statistics
const stats = await aiService.getProviderStats();
stats.providers.forEach(p => {
  console.log(`${p.name}:`);
  console.log(`  - Requests: ${p.requestCount}`);
  console.log(`  - Avg Response: ${p.avgResponseTime}ms`);
  console.log(`  - Error Rate: ${(p.errorRate * 100).toFixed(2)}%`);
});
```

## Migration from Old ChatController

### Before (Old Implementation)
```typescript
const response = await sendChatMessage(req, res, next);
```

### After (New Implementation)
```typescript
const response = await chatController.sendMessage(req, res, next);
// Automatically uses best available provider with caching
```

## Troubleshooting

### No Response from AI Service
1. Check `GET /api/chat/health` endpoint
2. Verify API keys are set correctly
3. Check rate limits for each provider
4. Review error logs in console

### Slow Responses
1. Check cache hit rate (`GET /api/chat/health`)
2. Enable Groq for speed-critical tasks
3. Reduce context window if too many messages
4. Consider batch processing for multiple requests

### Cache Not Working
1. Verify `AI_SERVICE_CACHE_SIZE > 0`
2. Check that messages are identical (for cache hits)
3. Monitor cache statistics in `/health` endpoint
4. Clear cache if behavior is unexpected

## Best Practices

1. **Use Assistant Modes** - Select appropriate mode for better responses
2. **Implement Batch Processing** - Process multiple requests together
3. **Monitor Cache** - Keep cache hit rate > 40% for optimal performance
4. **Handle Failures** - Always implement retry logic with exponential backoff
5. **Log Responses** - Track provider selection for monitoring
6. **Rate Limit** - Implement client-side rate limiting
7. **Cache Invalidation** - Clear cache after updates to reference data
8. **Use Appropriate Provider** - Gemini for quality, Groq for speed, OpenRouter for fallback

## Future Enhancements

- [ ] Database persistence for conversations
- [ ] User-specific prompt customization
- [ ] Advanced RAG with Quranic context
- [ ] Real-time streaming responses
- [ ] Advanced caching strategies (Redis)
- [ ] Provider load balancing based on historical performance
- [ ] Cost tracking and optimization
- [ ] A/B testing of different prompts
