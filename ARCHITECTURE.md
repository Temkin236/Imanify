# Imanify AI Chatbot - Production Architecture

## Overview
Complete production-ready AI chatbot system with multi-provider support, chat history, advanced prompting, and comprehensive error handling.

---

## 1. BACKEND ARCHITECTURE

### Core Services Layer

```
backend/src/
├── services/
│   ├── aiService/
│   │   ├── providers/
│   │   │   ├── baseProvider.ts         # Abstract base for all providers
│   │   │   ├── geminiProvider.ts        # Google Gemini implementation
│   │   │   ├── groqProvider.ts          # Groq implementation
│   │   │   └── openrouterProvider.ts    # OpenRouter implementation
│   │   ├── promptManager.ts             # System prompts & instruction templates
│   │   ├── aiService.ts                 # Main orchestrator (provider fallback, caching)
│   │   └── modelSelector.ts             # Smart model selection logic
│   │
│   ├── chat/
│   │   ├── chatService.ts               # Main chat orchestration
│   │   ├── contextManager.ts            # Conversation context window management
│   │   ├── memoryManager.ts             # Chat history & memory handling
│   │   └── messageProcessor.ts          # Message preprocessing & optimization
│   │
│   ├── storage/
│   │   ├── mongoDb.ts                   # MongoDB connection & utilities
│   │   └── schemas/
│   │       ├── chatSchema.ts            # Chat history schema
│   │       ├── userSchema.ts            # User profiles
│   │       └── conversationSchema.ts    # Multi-turn conversations
│   │
│   └── utils/
│       ├── tokenCounter.ts              # Token estimation
│       ├── cache.ts                     # Redis/in-memory caching
│       └── rateLimiter.ts               # Request rate limiting
│
├── controllers/
│   ├── chatController.ts                # Enhanced chat endpoints
│   ├── conversationController.ts        # Conversation management
│   └── assistantController.ts           # Assistant mode selection
│
├── middleware/
│   ├── authentication.ts                # JWT verification
│   ├── validation.ts                    # Input validation
│   ├── errorHandler.ts                  # Centralized error handling
│   ├── rateLimiter.ts                   # Rate limiting middleware
│   └── logger.ts                        # Request/response logging
│
├── routes/
│   ├── chatRoutes.ts                    # Chat endpoints
│   ├── conversationRoutes.ts            # Conversation management
│   └── assistantRoutes.ts               # Assistant configuration
│
└── config/
    ├── providers.ts                      # Provider configuration
    ├── models.ts                         # Model definitions & costs
    └── prompts.ts                        # System prompts
```

### Environment Variables
```
# AI Providers
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENROUTER_API_KEY=your_key

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/imanify

# Caching
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Configuration
MAX_TOKENS_PER_REQUEST=4000
MAX_CONTEXT_MESSAGES=10
RESPONSE_TIMEOUT_MS=30000

# Features
ENABLE_CONVERSATION_MEMORY=true
ENABLE_RESPONSE_CACHING=true
```

---

## 2. FRONTEND ARCHITECTURE

### Chat UI Components

```
frontend/src/components/
├── chat/
│   ├── ChatWindow.tsx               # Main chat container
│   ├── ChatInput.tsx                # Message input with formatting
│   ├── ChatMessages.tsx             # Message list with animations
│   ├── MessageBubble.tsx            # Individual message bubble
│   ├── TypingIndicator.tsx          # Typing animation
│   ├── StreamingResponse.tsx        # Real-time streaming display
│   ├── AssistantSelector.tsx        # Mode selection (Islamic, Student, Coder, etc)
│   └── ConversationHistory.tsx      # Sidebar with past conversations
│
├── shared/
│   ├── MarkdownRenderer.tsx         # Render markdown with syntax highlighting
│   ├── LoadingState.tsx             # Loading states
│   └── ErrorBoundary.tsx            # Error handling
│
└── hooks/
    ├── useChat.ts                   # Chat logic hook
    ├── useConversation.ts           # Conversation management
    └── useAssistantMode.ts          # Assistant mode selection
```

### Chat Service Architecture
```
frontend/src/services/
├── api/
│   └── chatApi.ts                   # API client for chat endpoints
├── chat/
│   ├── chatManager.ts               # Client-side chat orchestration
│   ├── messageStore.ts              # Local message caching
│   └── streamHandler.ts             # Handle streaming responses
└── ui/
    └── animationController.ts       # Animation timing & effects
```

---

## 3. DATABASE SCHEMA

### MongoDB Collections

#### Chat History
```javascript
{
  _id: ObjectId,
  userId: String,
  conversationId: String,
  role: "user" | "assistant",
  content: String,
  assistantMode: "islamic" | "student" | "coder" | "general",
  provider: "gemini" | "groq" | "openrouter",
  tokens: Number,
  cost: Number,
  metadata: {
    responseTime: Number,
    success: Boolean,
    cached: Boolean,
    model: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Conversations
```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  mode: "islamic" | "student" | "coder" | "general",
  messages: [ObjectId],  // References to messages
  summary: String,
  lastActivityAt: Date,
  createdAt: Date
}
```

#### User Profiles
```javascript
{
  _id: ObjectId,
  email: String,
  assistantPreferences: {
    defaultMode: String,
    responseLength: "concise" | "detailed",
    language: "en" | "ar",
    darkMode: Boolean
  },
  usage: {
    totalMessages: Number,
    totalTokens: Number,
    totalCost: Number
  }
}
```

---

## 4. API FLOW

### Chat Endpoint: POST /api/chat/send
```
Request:
{
  message: String,
  conversationId?: String,
  assistantMode: "islamic" | "student" | "coder" | "general",
  userId: String,
  sessionId: String
}

Response:
{
  success: boolean,
  data: {
    id: String,
    response: String,
    provider: String,
    mode: String,
    metadata: {
      tokensUsed: Number,
      responseTime: Number,
      cached: Boolean
    }
  },
  error?: String
}
```

### Memory Management Flow
```
1. User sends message → Extract context from conversation ID
2. Load last 10 messages from MongoDB
3. Create context window (token-optimized)
4. Build system prompt for selected mode
5. Create optimized message with context
6. Send to AI provider
7. Stream response back to frontend
8. Save message + response to MongoDB
9. Update token usage & analytics
```

---

## 5. PROVIDER FALLBACK STRATEGY

### Intelligent Failover
```
Request arrives
  ↓
Try Provider 1 (Groq - fastest)
  ├─ Success? → Cache & return
  └─ Failed? → Try Provider 2
       ↓
Try Provider 2 (Gemini - reliable)
  ├─ Success? → Cache & return
  └─ Failed? → Try Provider 3
       ↓
Try Provider 3 (OpenRouter - most models)
  ├─ Success? → Cache & return
  └─ Failed? → Return fallback response
       ↓
Log error & alert admin
```

---

## 6. PERFORMANCE OPTIMIZATIONS

### Caching Strategy
- **Response Cache**: 24-hour TTL for identical prompts
- **User Context Cache**: Last 10 conversations in memory
- **Token Estimation Cache**: Pre-calculated token counts

### Token Optimization
- Context window: Max 10 messages (≈3000 tokens)
- Response limit: 2000 tokens max
- Message summarization for long conversations
- Automatic context trimming

### Request Optimization
- Request debouncing (300ms)
- Connection pooling for MongoDB
- Provider request batching
- CDN for static assets

---

## 7. SECURITY LAYER

### Input Validation
- XSS prevention (DOMPurify)
- SQL injection prevention (prepared statements)
- Prompt injection prevention (input sanitization)
- Rate limiting per user (100 requests/15min)

### Authentication
- JWT token validation
- Session management
- CORS configuration
- API key encryption

### Data Protection
- Encrypt sensitive data at rest
- HTTPS only in production
- Environment variable security
- Audit logging for all API calls

---

## 8. ASSISTANT MODES

### 1. Islamic Assistant
```
Focus: Quran, Hadith, Islamic knowledge
System Prompt: References Islamic sources, emphasizes authenticity
Context: Quran API integration, Hadith database
Response Format: Citations with sources
```

### 2. Student Productivity
```
Focus: Learning support, organization, study tips
System Prompt: Encouraging, structured responses
Context: Study materials, learning goals
Response Format: Clear objectives & action steps
```

### 3. Coding Assistant
```
Focus: Programming, debugging, best practices
System Prompt: Technical, precise responses
Context: Code snippets, syntax highlighting
Response Format: Code blocks with explanations
```

### 4. General Assistant
```
Focus: General knowledge, casual conversation
System Prompt: Helpful, friendly, informative
Context: Broad knowledge base
Response Format: Natural conversational tone
```

---

## 9. DEPLOYMENT ARCHITECTURE

### Frontend (Vercel)
```
- Static build optimization
- Edge function for API routing
- Automatic SSL/TLS
- Auto scaling
```

### Backend (Render)
```
- Docker containerization
- Environment variable management
- Automatic deployments from GitHub
- Health checks & auto-restart
```

### Database (MongoDB Atlas)
```
- Cloud-hosted MongoDB
- Automatic backups
- Encryption at rest
- IP whitelisting
```

### Caching (Redis Cloud)
```
- Response caching
- Session management
- Rate limit tracking
```

---

## 10. ERROR HANDLING STRATEGY

### Provider Errors
- Quota exceeded → Try next provider
- Timeout → Retry with increased timeout
- Invalid API key → Log & alert
- Rate limited → Queue & retry

### User Errors
- Invalid input → Return 400 with helpful message
- Unauthorized → Return 401
- Too many requests → Return 429
- Server error → Return 500 with tracking ID

### User-Friendly Messages
```javascript
{
  "quota": "Model is temporarily busy. Trying alternative...",
  "timeout": "Response took too long. Please try again.",
  "invalid_key": "API configuration error. Contact support.",
  "rate_limit": "Too many requests. Please wait a moment.",
  "generic": "Something went wrong. Please try again later."
}
```

---

## Summary

This architecture provides:
✅ Multi-provider AI support with intelligent fallback
✅ Production-grade error handling & logging
✅ Conversation memory & context management
✅ Advanced system prompts for specialized modes
✅ Comprehensive performance optimization
✅ Enterprise-grade security
✅ Scalable infrastructure
✅ User-friendly error messages
✅ Analytics & cost tracking
✅ Easy deployment & configuration
