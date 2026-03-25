# ⚡ Quick Start Guide

Get Imanify running in 5 minutes!

## 🎯 Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

Verify: `node --version && npm --version`

## 🚀 Quick Setup (Development)

### Terminal 1 - Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend runs at: `http://localhost:5000`

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

## ✨ Done! The app is now running

Open http://localhost:5173 in your browser and you're good to go!

---

## 📚 Common Commands

### Backend
```bash
npm run dev          # Development with hot reload ⚡
npm run build        # Build for production 🏗️
npm start            # Run production build ▶️
npm run lint         # Check code quality 🔍
npm test             # Run tests 🧪
```

### Frontend
```bash
npm run dev          # Dev server with hot reload ⚡
npm run build        # Production build 🏗️
npm run preview      # Preview prod build 👁️
npm run lint         # Check code quality 🔍
```

## 🔧 Using Docker (Optional)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing the API

```bash
# Get a verse
curl http://localhost:5000/api/quran/1/1

# Get entire chapter
curl http://localhost:5000/api/quran/surah/1

# Search
curl "http://localhost:5000/api/quran/search?keyword=light"

# Health check
curl http://localhost:5000/api/quran/health
```

## 📁 Project Structure

```
imanify/
├── frontend/     React app (port 5173)
├── backend/      Express API (port 5000)
└── docs/         Documentation
```

## 🐛 Troubleshooting

**Cannot connect to port 5000 or 5173?**
```bash
# Find and kill process on port
# Windows: 
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Module not found errors?**
```bash
npm run type-check
```

## 📖 Full Documentation

- [Complete Setup Guide](./SETUP.md) - Detailed setup instructions
- [Backend API Docs](./backend/README.md) - API endpoints
- [Architecture](./ARCHITECTURE.md) - System design
- [Contributing](./CONTRIBUTING.md) - How to contribute

## 🎨 Frontend Routes

- `/` - Home/Landing
- `/quran` - Quran Reader
- `/ramadan` - Ramadan Hub
- `/chatbot` - AI Chatbot
- `/calendar` - Islamic Calendar
- `/azkar` - Daily Azkar
- `/settings` - Settings

## ⌨️ Keyboard Shortcuts

- `?` - Help/Shortcuts
- `Ctrl+K` - Quick search
- `Ctrl+/` - Toggle sidebar

## 🚀 Next Steps

1. ✅ Backend running? Check `/api/quran/health`
2. ✅ Frontend running? Open http://localhost:5173
3. ✅ Read a verse? Navigate to Quran Reader
4. ✅ Want to contribute? See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💡 Tips

- **Hot Reload**: Changes are reflected instantly in dev mode
- **TypeScript**: All code is type-safe
- **Cache**: API responses are cached for 1 hour
- **Offline**: Works with cached data if API is down

## 🔗 Useful Links

- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Vite Docs](https://vitejs.dev/)

## ❓ Need Help?

1. Check [SETUP.md](./SETUP.md) for detailed instructions
2. See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
3. Read [backend/README.md](./backend/README.md) for API docs
4. Open an issue on GitHub

---

<div align="center">

**Happy Coding! 🎉**

</div>
