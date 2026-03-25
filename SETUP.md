# 🚀 Imanify - Full Stack Setup Guide

Complete setup instructions for the Imanify Islamic application frontend and backend.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)

## 🖥️ System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 (or yarn >= 3.0.0)
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: 500MB+

### Verify Installation

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

## 📁 Project Structure

```
imanify/
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── constants.ts       # Constants
│   │   ├── types.ts           # TypeScript types
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Business logic
│   │   ├── services/          # Data services
│   │   ├── middleware/        # Express middleware
│   │   ├── utils/             # Utilities
│   │   ├── types.ts           # TypeScript types
│   │   ├── server.ts          # Main server file
│   │   └── data/              # JSON data files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── README.md
```

## 🔧 Environment Setup

### 1. Clone/Create the Project

```bash
# If cloning from Git
git clone https://github.com/yourusername/imanify.git
cd imanify

# Or navigate to existing project
cd c:\Users\Huawei\OneDrive\Documents\projects\Imanify
```

### 2. Create Environment Files

#### Backend Environment File

```bash
# Navigate to backend directory
cd backend

# Copy example environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
ALQURAN_API_TIMEOUT=5000
API_CACHE_TTL_HOURS=24
LOG_FILE_PATH=./logs/server.log
```

#### Frontend Environment File (Optional)

```bash
# Navigate to frontend directory
cd ../frontend

# Create .env if needed for API URL
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

## ⚙️ Backend Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Build Backend (Optional - for production)

```bash
npm run build
```

### 3. Start Backend Development Server

```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║     🕌 IMANIFY QURAN API SERVER 🕌    ║
╚════════════════════════════════════════╝

✨ Server running on http://localhost:5000
```

### 4. Test Backend Health

Open your browser or use curl:
```bash
curl http://localhost:5000/api/quran/health
```

Expected response:
```json
{
  "success": true,
  "status": "Quran API is running",
  "version": "1.0.0"
}
```

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Start Frontend Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Verify Frontend

- Open http://localhost:5173 in your browser
- You should see the Imanify application UI

## ▶️ Running the Application

### Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Both servers will now be running:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Production Build

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 👨‍💻 Development Workflow

### Backend Development

#### 1. Running Linter
```bash
cd backend
npm run lint           # Check code
npm run lint:fix       # Auto-fix issues
```

#### 2. Type Checking
```bash
npm run type-check
```

#### 3. Running Tests
```bash
npm test
npm run test:coverage
```

#### 4. Common Tasks

**API Testing with curl:**
```bash
# Get a single verse
curl http://localhost:5000/api/quran/1/1

# Get entire surah
curl http://localhost:5000/api/quran/surah/1

# Search verses
curl "http://localhost:5000/api/quran/search?keyword=light"

# Clear cache
curl -X POST http://localhost:5000/api/quran/cache/clear
```

### Frontend Development

#### 1. Code Formatting
```bash
cd frontend
npm run lint           # Check code
npm run lint:fix       # Auto-fix issues
```

#### 2. Type Checking
```bash
npm run type-check
```

#### 3. Building for Production
```bash
npm run build
```

## 🐛 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

#### Dependencies Not Installing
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
npm run type-check
```

### Frontend Issues

#### Port Already in Use
```bash
# Specify different port
npm run dev -- --port 3000
```

#### Vite Cache Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### API Connection Issues

#### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/health

# Check backend logs for errors
```

#### CORS Errors
1. Verify `CORS_ORIGIN` in `backend/.env`
2. Ensure frontend URL is in the list
3. Clear browser cache

#### External API Issues

**AlQuran Cloud API Down:**
- Check service status: https://alquran.cloud
- The application will continue to work with cached data

### Database/Cache Issues

#### Clear Application Cache
```bash
curl -X POST http://localhost:5000/api/quran/cache/clear
```

## 📚 Useful Commands

### Backend
```bash
npm run dev          # Development with hot-reload
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code quality
npm test             # Run tests
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run type-check   # TypeScript check
```

## 🔗 Useful Links

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [AlQuran Cloud API](https://alquran.cloud/api)

## 📝 Notes

- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Both can be changed in configuration files or environment variables
- Development servers support hot-reload
- Production builds are optimized and minified

## 🆘 Getting Help

1. Check the [Backend README](./backend/README.md)
2. Check the [Frontend README](./frontend/README.md)
3. Review error logs
4. Check console for JavaScript errors
5. Open an issue on the project repository

---

**Happy Developing! 🚀**
