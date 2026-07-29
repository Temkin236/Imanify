# Imanify: Ollama to Cloud AI Migration Guide

Complete migration from Ollama (local AI) to cloud-based AI providers optimized for Ethiopia's internet conditions.

## 🎯 Overview

### What Changed
- **Removed**: Ollama local AI model (heavy, 7GB+ downloads, requires GPU/RAM)
- **Added**: Cloud AI providers with intelligent fallback system
- **Benefit**: Works on limited hardware, optimized for slow internet, no model downloads

### New Architecture

```
User Message
    ↓
[Unified AI Service]
    ↓
    ├─→ Try: OpenRouter (free, excellent models)
    ├─→ Try: Groq (fastest, free tier)
    └─→ Try: Gemini (reliable, free tier)
    ↓
Cached Response (24-hour TTL)
    ↓
User Gets Answer
```

## 🚀 Setup Instructions

### Step 1: Update Environment Variables

Edit `backend/.env`:

```bash
# AI Providers - Choose at least ONE (can use multiple for redundancy)

# Option A: OpenRouter (RECOMMENDED for Ethiopia)
# Sign up: https://openrouter.ai/auth/signup
# Get free key immediately, no credit card required
OPENROUTER_API_KEY=sk-or-...

# Option B: Groq (Ultra-fast, highly recommended)
# Sign up: https://console.groq.com/auth/signup
# Free tier: 8,000 requests/day
GROQ_API_KEY=gsk_...

# Option C: Gemini (Google API)
# Already configured in .env
GEMINI_API_KEY=AIza...
```

**Easiest Path**: Get OpenRouter free key (no credit card needed, instant approval)

### Step 2: Install Dependencies

No new npm packages needed! All providers use standard `fetch()` API.

```bash
cd backend
npm install
```

### Step 3: Start the Backend

```bash
npm run dev
```

**Expected Output:**
```
[AIService] Initializing AI providers...
[AIService] ✓ OpenRouter configured
[AIService] ✓ Groq configured
[AIService] ✓ Gemini configured
[AIService] ✓ Ready with 3 provider(s): OpenRouter, Groq, Gemini
[Chat System] ✓ Fallback enabled
Imanify Backend running on port 3000
```

### Step 4: Test the Chat

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Islamic prayer?"}'
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "answer": "Islamic prayer (Salah) is...",
    "service": "OpenRouter",
    "cached": false
  }
}
```

## 📊 Provider Comparison

| Provider | Free Tier | Speed | Model Quality | Latency | Ethiopia Friendly |
|----------|-----------|-------|---------------|---------|-------------------|
| OpenRouter | 60 req/min | Fast | Excellent | ~1s | ✅ Yes |
| Groq | 8K req/day | Ultra Fast | Good | ~100ms | ✅ Yes |
| Gemini | 60 req/min | Medium | Excellent | ~2s | ✅ Yes |
| Ollama | Unlimited | Slow* | Fair | ~5s+ | ❌ No (local) |

*Ollama: Requires GPU/16GB RAM, slow on limited hardware

## 🔧 Configuration Details

### Provider Priority

The system tries providers in this order:
1. **OpenRouter** - Best models, most reliable
2. **Groq** - Fastest responses
3. **Gemini** - Reliable fallback

### Optimization for Ethiopia

All responses are optimized:
- ✅ Max 400 tokens (shorter responses = less bandwidth)
- ✅ Concise prompts (reduce token usage)
- ✅ 24-hour response caching
- ✅ Timeout handling for slow connections
- ✅ Automatic provider failover

### Response Time Examples

- OpenRouter: 1-2 seconds
- Groq: 0.5-1 second
- Gemini: 1-3 seconds
- Cached: 0 seconds (instant)

## 📝 API Changes

### New Chat Endpoint

Same endpoint, improved response:

```javascript
POST /api/chat
{
  "message": "What is Zakat?"
}

Response:
{
  "success": true,
  "data": {
    "answer": "Zakat is...",
    "service": "Groq",     // Which provider was used
    "cached": false         // Was it from cache?
  }
}
```

### New Health Check Endpoint

```javascript
GET /api/chat/health

Response:
{
  "success": true,
  "data": {
    "status": "OK",
    "ai": {
      "providers": [
        { "name": "OpenRouter", "available": true },
        { "name": "Groq", "available": true },
        { "name": "Gemini", "available": true }
      ],
      "cacheSize": 42
    }
  }
}
```

## 🔑 Getting API Keys

### OpenRouter (Recommended)

1. Go to: https://openrouter.ai/auth/signup
2. Sign up with email
3. Get key instantly (no verification needed)
4. Free credit: $5-10 usually
5. Copy to `OPENROUTER_API_KEY`

**Models used**: `meta-llama/llama-2-7b-chat:free`
- Fast, high quality
- Perfect for Islamic knowledge
- Works well with Arabic

### Groq

1. Go to: https://console.groq.com/auth/signup
2. Sign up with Google/GitHub
3. Get API key from dashboard
4. Free tier: 8,000 requests/day
5. Copy to `GROQ_API_KEY`

**Models used**: `mixtral-8x7b-32768`
- Ultra-fast (100ms response time)
- Great for chatbot interactions

### Gemini

Already configured. If needed:

1. Go to: https://ai.google.dev
2. Click "Get API key"
3. Create new API key
4. Copy to `GEMINI_API_KEY`

## ❌ Removed Files (Safe to Delete)

After migration, you can safely delete:

```
backend/src/services/ollamaService.ts (REMOVED)
backend/src/services/geminiService.ts (refactored to aiProviders/)
```

Files to keep (used by RAG):
```
backend/src/services/ragService.ts ✅ KEEP
backend/src/data/amharic_quran.json ✅ KEEP
backend/src/data/azkar.json ✅ KEEP
```

## 🧪 Testing

### Test Each Provider Individually

```bash
# Test with curl
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain Ramadan"}'

# Check which provider responded
# Look in response: "service": "OpenRouter" or "Groq" or "Gemini"
```

### Monitor Backend Logs

```bash
# Terminal logs show provider attempts:
[AIService] Attempting provider: OpenRouter
[AIService] ✓ Response from OpenRouter

# If provider fails:
[AIService] OpenRouter failed: Network error
[AIService] Attempting provider: Groq
[AIService] ✓ Response from Groq
```

### Test Fallback Chain

1. Disable OpenRouter key in `.env`
2. Restart backend
3. Send message
4. Should automatically use Groq

## 📱 Frontend No Changes Needed

Frontend code works without changes:

```javascript
// Same as before
const response = await chatbotClient.sendMessage(text);
setMessages(prev => [...prev, { role: 'assistant', content: response }]);
```

Response format is backward compatible.

## 🚀 Production Deployment

### Render.com (Recommended)

1. Update `backend/.env` with real API keys
2. Push to GitHub
3. Connect Render service
4. Set environment variables:
   ```
   OPENROUTER_API_KEY=your-key
   GROQ_API_KEY=your-key
   GEMINI_API_KEY=your-key
   ```
5. Deploy!

### Vercel

1. Set environment variables in dashboard
2. Deploy
3. Done!

### Docker

```dockerfile
# Dockerfile (no changes needed, just update .env)
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
RUN npm run build
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t imanify-backend .
docker run -e OPENROUTER_API_KEY=... -e GROQ_API_KEY=... -p 3000:3000 imanify-backend
```

## 💰 Cost Analysis

### Free Tier Limits (All Providers)

| Provider | Daily Limit | Monthly Equiv. |
|----------|------------|-----------------|
| OpenRouter | Unlimited* | ~500k requests |
| Groq | 8,000 | ~240,000 |
| Gemini | ~1,800 (60 req/min) | ~54,000 |

*OpenRouter: Free tier generous, ~5-10 usually

### Estimated Costs (If Free Tier Exceeded)

- OpenRouter: $0.0001 - $0.0005 per request
- Groq: $0.005 per 1M tokens (very cheap)
- Gemini: Free up to 1M tokens/day

**Example**: 10,000 chats/month:
- OpenRouter: $0-2/month
- Groq: $0-3/month
- Gemini: Free!

## 🐛 Troubleshooting

### "All AI providers failed"

**Cause**: API keys not set or invalid

**Fix**:
```bash
# Check .env file:
cat backend/.env | grep -E "OPENROUTER|GROQ|GEMINI"

# All should have values
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
```

### Slow Response Time

**Cause**: Using slow provider or network timeout

**Fix**:
```bash
# Check response header:
# "service": "OpenRouter" = 1-2s
# "service": "Groq" = 0.5-1s
# "cached": true = instant

# If all are slow, check internet speed
# Ethiopia average: 5-10 Mbps
```

### Rate Limited (429 Error)

**Cause**: Hit free tier quota

**Options**:
1. Wait (quota resets in 24 hours)
2. Add credit card to OpenRouter
3. Try different provider
4. Upgrade tier

## 📚 Architecture Files

New service structure:

```
backend/src/services/
├── aiService.ts                 (Main unified service) ✅ NEW
├── aiProviders/
│   ├── baseProvider.ts          (Base class) ✅ NEW
│   ├── openrouterProvider.ts    (OpenRouter) ✅ NEW
│   ├── groqProvider.ts          (Groq) ✅ NEW
│   └── geminiProvider.ts        (Gemini) ✅ NEW
├── ragService.ts                (Local context) ✅ KEEP
├── azkarService.ts              (Azkar data) ✅ KEEP
├── quranService.ts              (Quran data) ✅ KEEP
└── [other services...]          ✅ KEEP
```

## ✅ Migration Checklist

- [ ] Update `.env` with at least one API key
- [ ] Test backend starts without errors
- [ ] Send test message via `/api/chat`
- [ ] Verify response includes `service` field
- [ ] Check provider logs in console
- [ ] Test health endpoint `/api/chat/health`
- [ ] Test provider fallback (disable one key, verify next works)
- [ ] Update frontend if needed (usually not needed)
- [ ] Deploy to production
- [ ] Monitor logs for errors
- [ ] Set up alerts for rate limiting

## 🎓 Key Concepts

### RAG (Retrieval Augmented Generation)

- Uses local Quran + Azkar data as context
- Reduces token usage
- Improves answer quality
- Works offline for context retrieval

### Intelligent Fallback

- Tries providers in order
- Skips unavailable providers
- Automatic retry
- Never breaks for users

### Response Caching

- 24-hour cache for identical questions
- Instant response from cache
- Saves API quota
- Improves UX

### Optimization for Ethiopia

- Shorter responses (400 tokens max)
- Concise prompts
- Timeout handling
- Provider load balancing

## 🤝 Support

- **Issues?** Check troubleshooting section
- **API Keys?** Visit provider websites
- **Errors?** Check backend logs
- **Performance?** Monitor response times

## 📄 License

Same as main project (MIT)

---

**Migration Complete!** Your app is now optimized for Ethiopia with zero local AI overhead. 🇪🇹
