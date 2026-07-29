# Imanify Quick Reference - Post-Ollama Migration

## 📋 What Changed

### Removed ❌
- Ollama local AI service (7GB+ download, heavy RAM/CPU usage)
- `ollamaService.ts` file

### Added ✅
- Cloud AI providers (OpenRouter, Groq, Gemini)
- Intelligent fallback system
- Response caching (24-hour TTL)
- Health check endpoint
- Optimizations for slow internet

---

## 🔑 API Keys Required

Get at least ONE of these:

1. **OpenRouter** (Recommended)
   - Link: https://openrouter.ai/auth/signup
   - Time: Instant (no verification)
   - Free: Yes, $5-10 credit

2. **Groq**
   - Link: https://console.groq.com/auth/signup
   - Time: 2 minutes
   - Free: Yes, 8,000 requests/day

3. **Gemini**
   - Link: https://ai.google.dev
   - Time: 1 minute
   - Free: Yes, 1M tokens/day

---

## ⚙️ Setup (3 Steps)

### Step 1: Get API Key
```bash
# Visit one of the links above and copy your key
```

### Step 2: Update `.env`
```bash
# Edit backend/.env and paste:
OPENROUTER_API_KEY=sk-or-...
# or
GROQ_API_KEY=gsk_...
# or
GEMINI_API_KEY=AIza...
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

---

## 🧪 Test It

### Send a Chat Message

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Zakat?"}'
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "answer": "Zakat is one of the Five Pillars of Islam...",
    "service": "OpenRouter",
    "cached": false
  }
}
```

### Check Health

```bash
curl http://localhost:3000/api/chat/health
```

---

## 📊 Provider Comparison

| Feature | OpenRouter | Groq | Gemini |
|---------|-----------|------|--------|
| Speed | 1-2s | 0.5-1s | 1-3s |
| Quality | Excellent | Good | Excellent |
| Free Tier | Generous | 8K/day | 1M tokens |
| Setup | Instant | 2min | 1min |
| Recommended | ✅ YES | ⭐ YES | ✅ YES |

---

## 🔄 How It Works

```
User Message
    ↓
[Check Cache]
    ↓
[Try OpenRouter]
    ↓ (if fails)
[Try Groq]
    ↓ (if fails)
[Try Gemini]
    ↓ (if fails)
[Return Error]
```

---

## 📝 Environment Variables

### Required (Pick at least 1)
```
OPENROUTER_API_KEY=
GROQ_API_KEY=
GEMINI_API_KEY=
```

### Optional
```
NODE_ENV=development
LOG_LEVEL=debug
PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

## 🚀 Deployment

### Render (Easiest)
1. Push to GitHub
2. Create Render service
3. Add environment variables
4. Deploy!

### Vercel (Frontend)
```bash
# Same as before
npm run build
```

### Docker
```bash
docker build -t imanify-backend backend/
docker run -e OPENROUTER_API_KEY=... -p 3000:3000 imanify-backend
```

---

## ❓ FAQ

**Q: Do I need to change frontend code?**
A: No! Same API response format.

**Q: Can I use multiple providers?**
A: Yes! System automatically tries all configured providers.

**Q: What if an API key fails?**
A: System automatically switches to next provider.

**Q: How much will it cost?**
A: Free tier is usually sufficient. ~$0-5/month if you exceed limits.

**Q: Why remove Ollama?**
A: Heavy resource consumption, requires downloads, difficult setup on limited hardware.

**Q: Can I still use Ollama?**
A: No, removed entirely. Cloud providers are better for Ethiopia.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check error:
npm run dev

# Check if ports are free:
lsof -i :3000
```

### "All AI providers failed"
```bash
# Check API keys are set:
echo $OPENROUTER_API_KEY
echo $GROQ_API_KEY
echo $GEMINI_API_KEY

# At least one should have a value
```

### Slow responses
```bash
# Check which provider is used in response:
# "service": "Groq" = Should be ~1s
# "service": "OpenRouter" = Expected ~1-2s
# "cached": true = Instant

# If all slow, check internet speed
```

### Rate limiting (429 error)
```bash
# Normal during high usage
# System falls back to next provider
# Limit resets in 24 hours
```

---

## 📚 Files Changed

### Created ✨
```
backend/src/services/aiService.ts                    (Main service)
backend/src/services/aiProviders/baseProvider.ts
backend/src/services/aiProviders/openrouterProvider.ts
backend/src/services/aiProviders/groqProvider.ts
backend/src/services/aiProviders/geminiProvider.ts
MIGRATION_GUIDE.md                                    (Full guide)
DEPLOYMENT_GUIDE.md                                   (Deployment)
```

### Modified ✏️
```
backend/.env                                          (Updated)
backend/.env.example                                  (Updated)
backend/src/utils/config.ts                          (Added API keys)
backend/src/controllers/chatController.ts            (Refactored)
backend/src/routes/chatRoutes.ts                      (Added health endpoint)
backend/src/types.ts                                  (Updated ChatResponse)
```

### Removed ❌
```
backend/src/services/ollamaService.ts                (DELETED)
```

### Unchanged ✅
```
backend/src/services/ragService.ts                   (Still used)
backend/src/data/amharic_quran.json                   (Still used)
backend/src/data/azkar.json                           (Still used)
frontend/**                                           (No changes)
```

---

## 💡 Next Steps

1. [ ] Get API key from OpenRouter
2. [ ] Update `.env` file
3. [ ] Restart backend
4. [ ] Test with curl
5. [ ] Check logs
6. [ ] Deploy to production
7. [ ] Monitor responses

---

## 🎯 Performance Metrics

### Speed
- Cache hit: 0ms (instant)
- OpenRouter: 1-2 seconds
- Groq: 0.5-1 second
- Gemini: 1-3 seconds

### Bandwidth
- Average response: 1-2 KB
- 1,000 messages/day: ~2-4 MB
- Monthly: ~60-120 MB

### Cost (Free Tier)
- OpenRouter: Free ($5-10 credit)
- Groq: Free (8,000 requests)
- Gemini: Free (1M tokens)
- Total: $0/month if within limits

---

## 📞 Support

- **Docs**: See `MIGRATION_GUIDE.md` and `DEPLOYMENT_GUIDE.md`
- **Issues**: Check troubleshooting section
- **API Keys**: Visit provider websites
- **Logs**: Check backend console output

---

**Questions? Check the full guides or provider documentation!** 🚀
