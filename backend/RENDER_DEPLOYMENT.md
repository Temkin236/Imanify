# Imanify Backend - Render Deployment Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Render account (https://render.com)

## Deployment Steps

### 1. Environment Setup
Create a `.env` file in the backend directory with:
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend.onrender.com
GEMINI_API_KEY=your_key_here
DATABASE_URL=file:./data/app.db
```

### 2. Render Configuration
The `render.yaml` file in the root directory specifies the deployment configuration:
- Service: Node.js web service
- Build: `npm install && npm run build` in backend directory
- Start: `npm run start` in backend directory
- Region: Oregon (free tier)

### 3. Deploy to Render
**Option A: Using Render Dashboard**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `imanify-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Region**: Oregon (free)
   - **Plan**: Free
5. Add environment variables from `.env`
6. Click "Deploy"

**Option B: Using render.yaml (Recommended)**
1. Push your repository with `render.yaml`
2. Go to https://dashboard.render.com
3. Click "New +" → "Infrastructure from Code"
4. Connect your GitHub repository
5. Select branch and region
6. Render will auto-detect and deploy

### 4. Health Check
After deployment, verify health endpoint:
```
https://your-service-name.onrender.com/api/health
```

### 5. API Endpoints
- **Root**: `https://your-service-name.onrender.com/`
- **Documentation**: `https://your-service-name.onrender.com/api`
- **Quran**: `https://your-service-name.onrender.com/api/quran/:surah/:ayah`
- **Azkar**: `https://your-service-name.onrender.com/api/azkar`
- **Prayer Times**: `https://your-service-name.onrender.com/api/prayer?city=YourCity`
- **Chat**: `POST https://your-service-name.onrender.com/api/chat`

## Troubleshooting

### Build Fails
- Ensure `npm run build` works locally
- Check Node version compatibility (18+)
- Verify all dependencies are in `package.json`

### Service Won't Start
- Check logs in Render dashboard
- Verify PORT environment variable (should be 3000)
- Ensure `.env` has all required variables

### CORS Issues
- Update `CORS_ORIGIN` env variable with your frontend URL
- Format: `https://domain.onrender.com` (no trailing slash)

### Database Issues
- SQLite database is stored in `backend/data/app.db`
- Data persists between restarts on Render
- For production, consider using PostgreSQL

## Environment Variables Required

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Environment type |
| PORT | 3000 | Server port |
| CORS_ORIGIN | * | Allowed origins |
| GEMINI_API_KEY | - | Google Gemini API key |
| DATABASE_URL | file:./data/app.db | Database URL |

## Performance Tips
1. Enable caching headers (already in middleware)
2. Use CDN for frontend (Render provides free CDN)
3. Monitor logs for slow endpoints
4. Optimize database queries

## Security Notes
- Keep `GEMINI_API_KEY` secret (use Render's environment variables)
- Enable HTTPS (automatic on Render)
- Rate limiting is enabled (100 requests per 15 seconds)
- CORS is properly configured

## Support
For issues, check:
- Render documentation: https://render.com/docs
- Imanify GitHub: https://github.com/Temkin236/Imanify
