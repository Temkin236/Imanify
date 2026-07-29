# Imanify Deployment Guide - Post-Ollama Migration

Complete deployment instructions for Render, Vercel, and Docker after Ollama removal.

## 🚀 Quick Deployment Summary

| Platform | Time | Cost | Difficulty |
|----------|------|------|------------|
| **Render** | 5 min | $0-5/mo | Easy ⭐ |
| **Vercel** | 10 min | Free | Easy ⭐ |
| **Docker** | 15 min | Varies | Medium ⭐⭐ |
| **Railway** | 5 min | $0-5/mo | Easy ⭐ |

---

## 📡 Render.com (Recommended for Ethiopia)

Best option: Fast deployment, affordable, great uptime in Africa.

### Step 1: Prepare Repository

```bash
# Ensure .env.example is updated (already done)
git add .env.example backend/.env
git commit -m "chore: update AI provider configuration"
git push origin main
```

### Step 2: Create Render Account & Service

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Select the Imanify repository

### Step 3: Configure Backend Service

**Build & Start Settings:**
```
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
```

**Environment Variables:**
```
OPENROUTER_API_KEY=your-key-here
GROQ_API_KEY=your-key-here
GEMINI_API_KEY=your-existing-key
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
CORS_ORIGIN=https://your-frontend-url.com,https://www.your-frontend-url.com
```

**Instance Type:**
- Free tier: Good for testing
- Paid tier ($7/month): Recommended for production

### Step 4: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect same repo
3. Build settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
```

### Step 5: Connect Services

1. Update frontend environment to point to backend URL
2. Update backend CORS to include frontend URL
3. Test API calls

### Expected Result:
- Backend: `https://imanify-backend.onrender.com`
- Frontend: `https://imanify-frontend.onrender.com`

---

## ✈️ Vercel (Fastest for Frontend)

Best for Next.js/React frontend, serverless functions.

### Frontend Deployment

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Framework preset: **Vite** (auto-detected)

**Build & Output:**
```
Build Command: npm install && npm run build
Output Directory: dist
Development Command: npm run dev
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend Deployment (Serverless Functions)

Create `backend/api/chat.js`:

```javascript
import chatController from '../src/controllers/chatController.js';

export default async (req, res) => {
  if (req.method === 'POST') {
    // Handle chat request
    const { message } = req.body;
    const response = await chatController.sendMessage(message);
    res.json(response);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
```

**Note**: Full Express server won't work on Vercel's free tier. Better to keep backend on Render.

---

## 🐳 Docker Deployment

For complete control on any platform (AWS, DigitalOcean, etc.)

### Build Docker Images

**Backend Dockerfile:**

```dockerfile
# Use official Node.js runtime
FROM node:20-alpine

# Set working directory
WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]
```

**Frontend Dockerfile:**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Build & Push to Registry

```bash
# Build images
docker build -f backend/Dockerfile -t imanify-backend:latest .
docker build -f frontend/Dockerfile -t imanify-frontend:latest .

# Tag for registry (example: Docker Hub)
docker tag imanify-backend:latest your-username/imanify-backend:latest
docker tag imanify-frontend:latest your-username/imanify-frontend:latest

# Push to registry
docker push your-username/imanify-backend:latest
docker push your-username/imanify-frontend:latest
```

### Docker Compose for Local Development

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend/src:/app/backend/src
    networks:
      - imanify

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - backend
    networks:
      - imanify

networks:
  imanify:
    driver: bridge
```

**Run:**

```bash
docker-compose up --build
```

---

## 🚀 Railway.app (Alternative to Render)

Fast deployment, pay-per-use pricing.

### Steps:

1. Go to https://railway.app
2. Login with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Select your Imanify repo
6. Add environment variables:
   ```
   OPENROUTER_API_KEY=...
   GROQ_API_KEY=...
   GEMINI_API_KEY=...
   ```
7. Set start command: `cd backend && npm start`
8. Deploy!

---

## 🔒 Environment Variables for Production

### Render / Railway / Docker

Required for production:

```env
NODE_ENV=production
LOG_LEVEL=info

# At least one AI provider (all three recommended for redundancy)
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...

# CORS - Set to your actual domain
CORS_ORIGIN=https://imanify.com,https://www.imanify.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Optional: Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=imanify
DB_USER=postgres
DB_PASSWORD=your-secure-password
```

### Never commit `.env` file!

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Use .env.example for developers
cp .env.example .env

git add .gitignore .env.example
git commit -m "docs: exclude .env from version control"
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend service running (check health endpoint)
- [ ] Frontend service running
- [ ] API keys configured in environment
- [ ] CORS properly configured
- [ ] Test chat endpoint works
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring
- [ ] Configure SSL/HTTPS (auto on Render/Vercel)
- [ ] Set up error alerting
- [ ] Test fallback providers

### Health Check Commands

```bash
# Test backend
curl https://your-backend.com/api/health

# Test chat
curl -X POST https://your-backend.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test chat health
curl https://your-backend.com/api/chat/health
```

---

## 🔍 Monitoring & Troubleshooting

### View Logs

**Render:**
```bash
# Dashboard → Logs
# Or: tail via command line
render-cli logs --service imanify-backend
```

**Vercel:**
```bash
# Dashboard → Deployments → Select deployment → View Logs
vercel logs
```

**Docker:**
```bash
docker logs <container-id> -f
```

### Common Issues

**1. "All AI providers failed"**

→ Check environment variables are set:
```bash
echo $OPENROUTER_API_KEY
echo $GROQ_API_KEY
echo $GEMINI_API_KEY
```

**2. CORS Errors**

→ Update CORS_ORIGIN to match your frontend domain:
```
CORS_ORIGIN=https://imanify.vercel.app,https://www.imanify.vercel.app
```

**3. Timeout Errors**

→ Increase timeout or check API provider status:
```bash
# Monitor provider
curl -I https://openrouter.ai
curl -I https://api.groq.com
```

**4. Rate Limiting (429)**

→ Normal during high usage. System automatically falls back to next provider.

---

## 💰 Cost Comparison

### Monthly Costs (Estimated)

| Platform | Tier | Cost | Notes |
|----------|------|------|-------|
| Render | Free | $0 | Good for testing |
| Render | Starter | $7 | Recommended |
| Vercel | Free | $0 | Frontend only |
| Railway | Pay-as-you-go | $0-15 | Based on usage |
| Docker (AWS EC2) | t2.micro | $5-15 | Manual management |
| Docker (DigitalOcean) | Basic | $6/mo | Easy deployment |

### API Costs (if free tier exceeded)

| Provider | Cost | Limit (Free) |
|----------|------|-------------|
| OpenRouter | $0.0001-0.0005/req | Generous |
| Groq | Cheap | 8K/day |
| Gemini | Free tier huge | 1M tokens/day |

---

## 🌍 Optimization for Ethiopia

### Network Optimization

1. **Use Render's global CDN**: Auto-optimized
2. **Enable response compression**: Built-in
3. **Optimize response size**: Already done (400 tokens max)
4. **Use caching**: 24-hour response cache enabled

### Bandwidth Estimates

- Average chat response: 400 tokens ≈ 1.2 KB
- 1,000 chats/day ≈ 1.2 MB traffic
- Monthly: ≈ 36 MB (minimal)

### Latency from Ethiopia

- OpenRouter: 1-2s (great)
- Groq: 0.5-1s (excellent)
- Gemini: 1-3s (good)
- Render server in Africa: +200ms (acceptable)

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_BACKEND }} \
            -H 'Content-Type: application/json' \
            -d '{"clearCache": false}'
      
      - name: Deploy Frontend
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_FRONTEND }} \
            -H 'Content-Type: application/json' \
            -d '{"clearCache": false}'
```

Add deploy hooks to GitHub secrets for auto-deployment.

---

## 📊 Analytics & Monitoring

### Recommended Tools

1. **Sentry** (Error tracking)
   ```bash
   npm install @sentry/node
   ```

2. **LogRocket** (Session replay)

3. **Datadog** (Full monitoring)

4. **Built-in logging**:
   ```bash
   # Render logs
   # Railway logs
   # Docker logs
   ```

---

## 🎓 Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Connect them
4. Monitor logs
5. Set up alerts
6. Celebrate! 🎉

---

**Deployment Complete!** Your Imanify app is now cloud-native and optimized for Ethiopia. 🚀🇪🇹
