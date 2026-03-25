# 🕌 Imanify - Islamic Application Platform

<div align="center">

![Imanify](https://img.shields.io/badge/Imanify-Islamic%20App-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)
![React](https://img.shields.io/badge/React-18%2B-61dafb)
![Express](https://img.shields.io/badge/Express-4.18%2B-90c53f)

**A comprehensive Islamic application providing Quran access with multi-language support (Arabic, English, and Amharic), Islamic resources, and community features.**

[Getting Started](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📱 Features

### 🕯️ Quran Access
- **Multi-Language Support**: Arabic (Uthmani), English (Sahih International), and Amharic translations
- **Verse Viewing**: Read individual verses or entire chapters
- **Smart Caching**: Fast response times with intelligent caching
- **Search Functionality**: Full-text search across all verses
- **Bookmarking**: Save favorite verses for later reading

### 📅 Islamic Features  
- **Ramadan Hub**: Comprehensive Ramadan tracking and resources
- **Ramadan Tracker**: Monitor your daily Quran reading and prayers
- **Islamic Calendar**: View important Islamic dates and events
- **Azkar (Dhikr)**: Daily Islamic remembrance phrases
- **Prayer Times**: (Coming soon)

### 🤖 Smart Features
- **AI Chatbot**: Ask questions about Islam and get answers using Gemini AI
- **Settings**: Customize language, theme, and preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with responsive design
- **State Management**: React Context/Hooks
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: JSON-based (Amharic) + External APIs
- **APIs**: AlQuran.cloud, Google Gemini API

### DevOps
- **Containerization**: Docker & Docker Compose
- **Linting**: ESLint
- **Testing**: Vitest
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/imanify.git
cd imanify
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

3. **Setup Frontend** (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Docs: http://localhost:5000/api/quran/health

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📖 Documentation

### Directory Structure
```
imanify/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── types.ts      # TypeScript types
│   │   └── constants.ts  # Application constants
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── services/     # Data services
│   │   ├── middleware/   # Custom middleware
│   │   ├── utils/        # Utility functions
│   │   └── types.ts      # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
├── SETUP.md             # Full setup guide
└── docker-compose.yml   # Docker configuration
```

### Key Documentation Files
- [Backend README](./backend/README.md) - API documentation and setup
- [Frontend Setup Guide](./SETUP.md) - Development environment setup
- [API Endpoints](./backend/README.md#-api-endpoints) - Available API endpoints

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api/quran
```

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quran/:surah/:ayah` | Get specific verse |
| GET | `/api/quran/surah/:surah` | Get entire chapter |
| POST | `/api/quran/verses` | Get multiple verses |
| GET | `/api/quran/search` | Search verses |
| POST | `/api/quran/cache/clear` | Clear cache |
| GET | `/api/quran/health` | Health check |

### Example Requests

**Get Verse 1:1**
```bash
curl http://localhost:5000/api/quran/1/1
```

**Search for "light"**
```bash
curl "http://localhost:5000/api/quran/search?keyword=light&limit=5"
```

For more examples, see [API Documentation](./backend/README.md)

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Containers

```bash
# Build backend image
docker build -t imanify-backend ./backend

# Run backend
docker run -p 5000:5000 imanify-backend

# Build frontend image
docker build -t imanify-frontend ./frontend

# Run frontend
docker run -p 3000:80 imanify-frontend
```

## 📝 Components

### Frontend Components
- **Home**: Landing page with quick access
- **Quran Reader**: Read and search Quran verses
- **Ramadan Hub**: Ramadan resources and tracking
- **Chatbot**: AI-powered question answering
- **Settings**: User preferences and configuration
- **Calendar**: Islamic calendar view
- **Azkar**: Islamic remembrance phrases

### Backend Services
- **Quran Service**: Fetches and merges multiple translations
- **Validation Middleware**: Validates API requests
- **Error Handling**: Comprehensive error management
- **Caching Layer**: Improves performance

## 🔐 Security Features

- CORS configuration for secure cross-origin requests
- Environment variable management
- Input validation on all endpoints
- Error handling with appropriate HTTP status codes
- Rate limiting support (configurable)

## 🚦 Environment Variables

### Backend

```env
# Server
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# API
ALQURAN_API_TIMEOUT=5000
API_CACHE_TTL_HOURS=24

# Gemini API (for chatbot)
GEMINI_API_KEY=your_key_here
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                  # Run tests
npm run test:coverage     # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                  # Run tests
npm run test:coverage     # Coverage report
```

## 📊 Performance

- **Response Time**: < 500ms for cached requests
- **Cache Duration**: 1 hour per verse
- **Concurrent Requests**: Up to 5
- **API Timeout**: 5 seconds
- **Compression**: Gzip enabled

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write clean, maintainable code
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Use meaningful commit messages

## 📋 Code of Conduct

This project is dedicated to providing an Islamic-focused community. We ask all contributors to:
- Respect Islamic values and principles
- Be respectful and inclusive
- Maintain professional communication
- Report concerns through appropriate channels

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment details

## 💡 Feature Requests

Have an idea? We'd love to hear it! Please open an issue with:
- Feature description
- Use cases and benefits
- Suggested implementation (optional)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AlQuran.cloud** - Providing reliable Quran API
- **Islamic Community** - Knowledge and inspiration
- **Contributors** - Making this project possible
- [Font Awesome](https://fontawesome.com/) - Icons
- The open-source community

## 📞 Contact & Support

- **Email**: [support@imanify.app](mailto:support@imanify.app)
- **Issues**: [GitHub Issues](https://github.com/yourusername/imanify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/imanify/discussions)

## 🔗 Useful Links

- [Project Repository](https://github.com/yourusername/imanify)
- [Documentation](./SETUP.md)
- [API Reference](./backend/README.md)
- [Islamic Resources](https://www.islamicqa.org/)

## 📈 Roadmap

- [ ] Prayer times integration
- [ ] Offline mode
- [ ] Multi-user accounts
- [ ] Community features
- [ ] Mobile app
- [ ] More language support

---

<div align="center">

**Made with ❤️ for the Islamic Community**

⭐ If you find this project helpful, please consider giving it a star!

</div>

