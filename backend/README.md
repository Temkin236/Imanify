# Imanify Backend API

Backend server for the Imanify Islamic application, providing multi-language Quran API with support for Arabic, English, and Amharic translations.

## 🌟 Features

- **Multi-language Support**: Arabic (Uthmani), English (Sahih International), and Amharic translations
- **RESTful API**: Easy-to-use endpoints for accessing Quran data
- **Caching**: Efficient response caching to reduce API calls
- **Search**: Full-text search capabilities across verses
- **Error Handling**: Comprehensive error messages and validation
- **CORS Support**: Configured for cross-origin requests from the frontend

## 🛠️ Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **Axios**: HTTP client for API calls
- **dotenv**: Environment configuration

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
The server will start at `http://localhost:5000` with hot-reload enabled.

### Production Mode
```bash
npm run build
npm start
```

### Building Only
```bash
npm run build
```

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:coverage # Run tests with coverage
```

## 📖 API Endpoints

### Base URL
```
http://localhost:5000/api/quran
```

### 1. Get a Specific Verse
```
GET /api/quran/:surah/:ayah?language=en
```

**Parameters:**
- `surah` (number): Surah number (1-114)
- `ayah` (number): Ayah (verse) number
- `language` (optional): `en`, `ar`, `am` (default: `en`)

**Example:**
```bash
curl http://localhost:5000/api/quran/1/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "surah": 1,
    "ayah": 1,
    "translations": {
      "ar": {
        "text": "الحمد لله رب العالمين",
        "edition": "quran-uthmani"
      },
      "en": {
        "text": "All praise and thanks are due to Allah, Lord of the worlds",
        "edition": "en.sahih"
      },
      "am": {
        "text": "ሁሉ ምስጋና እና ምስጋና አላህ፣ አለም ወደ ሩብ",
        "edition": "am-local"
      }
    }
  }
}
```

### 2. Get Entire Surah
```
GET /api/quran/surah/:surah?language=en
```

**Parameters:**
- `surah` (number): Surah number (1-114)
- `language` (optional): `en`, `ar`, `am` (default: `en`)

**Example:**
```bash
curl http://localhost:5000/api/quran/surah/1
```

**Response:**
```json
{
  "success": true,
  "surah": 1,
  "totalAyahs": 7,
  "data": [
    { /* verse 1 */ },
    { /* verse 2 */ },
    ...
  ]
}
```

### 3. Get Multiple Verses
```
POST /api/quran/verses
```

**Request Body:**
```json
{
  "verses": [
    { "surah": 1, "ayah": 1 },
    { "surah": 1, "ayah": 2 },
    { "surah": 2, "ayah": 255 }
  ],
  "language": "en"
}
```

**Constraints:**
- Maximum 20 verses per request
- Each verse must have `surah` and `ayah`

### 4. Search Verses
```
GET /api/quran/search?keyword=light&limit=10
```

**Query Parameters:**
- `keyword` (required): Search term (minimum 2 characters)
- `limit` (optional): Number of results (max 50, default 10)

**Example:**
```bash
curl "http://localhost:5000/api/quran/search?keyword=light&limit=5"
```

### 5. Clear Cache
```
POST /api/quran/cache/clear
```

**Request Body (optional):**
```json
{
  "surah": 1,
  "ayah": 1
}
```

If no body is provided, all cache is cleared.

### 6. Health Check
```
GET /api/quran/health
```

**Response:**
```json
{
  "success": true,
  "status": "Quran API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-20T10:30:00.000Z"
}
```

## 🔄 Data Sources

- **Arabic & English**: [AlQuran.cloud API](https://alquran.cloud/api)
  - Arabic: Uthmani script
  - English: Sahih International translation

- **Amharic**: Local JSON database at `backend/data/amharic_quran.json`

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── server.ts                 # Main Express app
│   ├── routes/
│   │   └── quranRoutes.ts        # Quran API routes
│   ├── controllers/
│   │   └── quranController.ts    # Business logic
│   ├── services/
│   │   └── quranService.ts       # Data fetching & merging
│   ├── middleware/
│   │   └── validation.ts         # Request validation
│   └── data/
│       └── amharic_quran.json    # Amharic translation
├── dist/                          # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .env.example
└── README.md
```

## 🔐 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "code": 400
}
```

Common HTTP Status Codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: Server error

## 💾 Caching Strategy

- **Duration**: 1 hour per verse
- **Cache Keys**: `{surah}:{ayah}:{language}`
- **Management**: Can be cleared via `/api/quran/cache/clear`

## 🚀 Performance Considerations

1. **Parallel Requests**: Verses are fetched in parallel when possible
2. **Concurrency Limit**: 5 concurrent requests to external APIs
3. **Response Compression**: Enabled by default
4. **Timeout**: 5 seconds per external API call

## 📝 Logging

- Development: Console logging
- Production: File-based logging to `./logs/server.log`

## 🤝 Contributing

1. Follow TypeScript best practices
2. Run `npm run lint` before committing
3. Use meaningful commit messages
4. Test your changes with `npm test`

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **AlQuran.cloud** for providing reliable Quran API
- **Islamic community** for Quranic knowledge resources
- **Contributors** to this project

---

**Need Help?** Check the [main project README](../README.md) or open an issue.
