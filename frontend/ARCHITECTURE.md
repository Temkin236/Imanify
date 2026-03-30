# 🏗️ System Architecture

This document describes the overall architecture of the Imanify application, including the system design, component interactions, and data flow.

## 📋 Table of Contents

1. [High-Level Overview](#high-level-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [API Communication](#api-communication)
7. [Caching Strategy](#caching-strategy)
8. [Security Architecture](#security-architecture)

## 🎯 High-Level Overview

Imanify is a full-stack Islamic application with a clear separation of concerns:

- **Frontend**: React-based user interface
- **Backend**: Express.js REST API
- **Data Sources**: External APIs (AlQuran.cloud) and local databases
- **Deployment**: Docker containerization

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                 │  │
│  │                                                      │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │  Home    │  │  Quran   │  │ Ramadan  │  ...      │  │
│  │  │Component │  │ Component│  │Component │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │        API Service Layer (Axios)            │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP/REST
                         │
┌────────────────────────▼─────────────────────────────────┐
│          Express.js Backend Server (API)                 │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Express Middleware                       │   │
│  │  - CORS  - Authentication  - Validation         │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │         Router / Controllers                    │   │
│  │  - Route Handling                               │   │
│  │  - Request Processing                           │   │
│  └──────────────────────▼──────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │         Business Logic (Services)               │   │
│  │  - Quran Service                                │   │
│  │  - Translation Merging                          │   │
│  │  - Search & Filtering                           │   │
│  └──────────────────────▼──────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │         Cache Layer (In-Memory)                 │   │
│  └──────────────────────▼──────────────────────────┘   │
└────────────────────────┬┬───────────────────────────────┘
                         ││
                    ┌────▼────┬────────────┐
                    │          │           │
            ┌───────▼──┐  ┌────▼───┐
            │ AlQuran  │  │ Local  │
            │   API    │  │ Database  │
            │(Arabic)  │  │(Amharic)  │
            └──────────┘  └────────┘
```

## 🎨 Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── Home.tsx                 # Landing page
│   ├── QuranReader.tsx          # Quran viewing & search
│   ├── RamadanHub.tsx           # Ramadan resources
│   ├── Chatbot.tsx              # AI chatbot interface
│   ├── Calendar.tsx             # Islamic calendar
│   ├── Azkar.tsx                # Daily remembrance
│   ├── Settings.tsx             # User preferences
│   ├── Layout.tsx               # Main layout wrapper
│   └── [other components]
│
├── services/
│   ├── quranService.ts          # Quran API calls
│   └── chatbotService.ts        # Chatbot API calls
│
├── types.ts                     # Type definitions
├── constants.ts                 # App constants
└── main.tsx                     # Entry point
```

### Data Flow (Frontend)

```
User Action
    │
    ▼
React Component
    │
    ▼
Event Handler
    │
    ▼
API Service Call (Axios)
    │
    ▼
HTTP Request to Backend
    │
    ▼
Backend Response
    │
    ▼
State Update (useState/Context)
    │
    ▼
Component Re-render
    │
    ▼
User Sees Updated UI
```

### State Management

- **React Hooks**: `useState`, `useEffect`, `useContext`
- **Local Component State**: For UI state
- **Context API**: For global state (if needed)
- **No Redux**: Keeping it simple and lightweight

## 🔧 Backend Architecture

### Layered Architecture

#### 1. **Route Layer** (`routes/quranRoutes.ts`)
- Defines HTTP endpoints
- Maps routes to controllers
- Applies middleware

#### 2. **Controller Layer** (`controllers/quranController.ts`)
- Handles HTTP requests/responses
- Input validation
- Error handling
- Calls business logic

#### 3. **Service Layer** (`services/quranService.ts`)
- Core business logic
- Data fetching and transformation
- External API calls
- Caching logic

#### 4. **Middleware Layer** (`middleware/`)
- CORS handling
- Body parsing
- Validation
- Logging
- Error handling

#### 5. **Utility Layer** (`utils/`)
- Configuration management
- Logging
- Error classes
- Helper functions

### File Organization

```
backend/
├── src/
│   ├── server.ts              # Main app setup
│   ├── routes/                # Route definitions
│   │   └── quranRoutes.ts
│   ├── controllers/           # Request handlers
│   │   └── quranController.ts
│   ├── services/              # Business logic
│   │   └── quranService.ts
│   ├── middleware/            # Custom middleware
│   │   └── validation.ts
│   ├── utils/                 # Utilities
│   │   ├── config.ts          # Configuration
│   │   ├── logger.ts          # Logging
│   │   ├── errors.ts          # Error classes
│   │   └── helpers.ts         # Helper functions
│   ├── data/                  # Static data
│   │   └── amharic_quran.json
│   └── types.ts               # TypeScript types
│
├── dist/                      # Compiled JS output
├── package.json
├── tsconfig.json
└── [config files]
```

## 🔄 Data Flow

### Request-Response Flow

```
1. Client Request
   GET /api/quran/1/1
   │
   ▼
2. Express Router
   Route matched → Pass to controller
   │
   ▼
3. Middleware
   Validate parameters
   │
   ▼
4. Controller
   - Extract parameters
   - Call service
   - Handle errors
   │
   ▼
5. Service Layer
   - Check cache
   - Fetch from APIs if needed
   - Merge translations
   - Store in cache
   │
   ▼
6. External Data Sources
   - AlQuran.cloud API
   - Local Amharic database
   │
   ▼
7. Response Preparation
   - Format data
   - Add metadata
   │
   ▼
8. HTTP Response
   200 OK with JSON data
   │
   ▼
9. Client Receives Response
   Display data to user
```

### Example: Get Verse Flow

```
User clicks "Read Verse 1:1"
    │
    ▼
Frontend calls: quranService.getVerse(1, 1)
    │
    ▼
Axios GET request to: http://localhost:5000/api/quran/1/1
    │
    ▼
Backend Router receives request
    │
    ▼
Validation Middleware checks parameters (1 ≤ surah ≤ 114, ayah > 0)
    │
    ▼
Controller.getVerse() called
    │
    ▼
Service.mergeTranslations(1, 1) called
    │
    ▼
Check cache for "1:1:en"
    ├─ If cached: Return cached data
    └─ If not cached:
        ├─ Fetch Arabic from AlQuran.cloud
        ├─ Fetch English from AlQuran.cloud
        ├─ Fetch Amharic from local database
        ├─ Merge all translations
        └─ Store in cache
    │
    ▼
Return merged translation object
    │
    ▼
Controller formats response
    │
    ▼
Express sends HTTP 200 with JSON
    │
    ▼
Frontend receives response
    │
    ▼
Update component state
    │
    ▼
Re-render with verse data
    │
    ▼
User sees verse in UI
```

## 🔌 API Communication

### REST Endpoints Structure

```
/api/quran
├── GET    /:surah/:ayah              # Single verse
├── GET    /surah/:surah              # Full chapter
├── POST   /verses                    # Multiple verses
├── GET    /search                    # Search verses
├── POST   /cache/clear               # Clear cache
└── GET    /health                    # Health check
```

### Request/Response Format

**Request:**
```json
GET /api/quran/1/1

Headers:
{
  "Content-Type": "application/json"
}
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
        "text": "All praise and thanks...",
        "edition": "en.sahih"
      },
      "am": {
        "text": "ሁሉ ምስጋና...",
        "edition": "am-local"
      }
    }
  }
}
```

## 💾 Caching Strategy

### Cache Architecture

```
┌─────────────────────────────────────────┐
│        In-Memory Cache (Map)            │
│                                         │
│  Key: "surah:ayah:language"            │
│  Value: {                              │
│    data: [...],                        │
│    timestamp: Date.now()               │
│  }                                     │
└─────────────────────────────────────────┘
         │
         ├─→ Cache Hit (< 1 hour)
         │   Return cached data
         │
         └─→ Cache Miss or Expired
             ├─→ Fetch from APIs
             ├─→ Transform data
             ├─→ Store in cache
             └─→ Return data
```

### Cache Configuration

- **TTL (Time To Live)**: 1 hour
- **Strategy**: Lazy loading (fetch on miss)
- **Storage**: In-memory (Node.js process memory)
- **Clearing**: Manual via API endpoint
- **Keys**: `{surah}:{ayah}:{language}`

## 🔐 Security Architecture

### CORS Configuration

```
Allowed Origins: http://localhost:3000, http://localhost:5173
Allowed Methods: GET, POST, OPTIONS
Allowed Headers: Content-Type, Authorization
Credentials: true
```

### Input Validation

```
┌─────────────────┐
│  Client Input   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   Validation Middleware     │
│                             │
│  - Type checking            │
│  - Range validation         │
│  - Format validation        │
│  - Sanitization             │
└────────┬────────────────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
    ▼         ▼          ▼
 Valid    Invalid    Malformed
   │         │          │
   ▼         ▼          ▼
Process   Error      Error
 Data     400        400
```

### Error Handling

```
Error Hierarchy:
    AppError (base)
    ├── ValidationError
    ├── NotFoundError
    ├── UnauthorizedError
    ├── ForbiddenError
    ├── InternalServerError
    └── ServiceUnavailableError
```

## 🚀 Deployment Architecture

### Docker Containers

```
┌─────────────────────────────────────┐
│     Docker Compose Network          │
│                                     │
│  ┌──────────────┐  ┌────────────┐  │
│  │ Frontend     │  │ Backend    │  │
│  │ Container    │  │ Container  │  │
│  │ (Nginx)      │  │ (Node.js)  │  │
│  │ Port: 3000   │  │ Port: 5000 │  │
│  └──────────────┘  └────────────┘  │
│         │                  │        │
│         └──────────────────┘        │
│         imanify-network             │
└─────────────────────────────────────┘
```

### Environment Separation

```
Development           Production
├── Frontend          ├── Frontend
│   Port: 5173        │   Port: 80 (Docker)
│   Hot reload        │   Optimized build
│                     │
├── Backend           ├── Backend
│   Port: 5000        │   Port: 5000
│   Debug logging     │   Production logging
└── Local APIs        └── Managed APIs
```

## 📊 Performance Considerations

### Frontend Performance
- **Code Splitting**: Lazy loading of routes
- **Bundle Size**: Optimized dependencies
- **Caching**: Browser cache for assets
- **Rendering**: Efficient React updates

### Backend Performance
- **In-Memory Caching**: Fast data retrieval
- **Parallel Requests**: Concurrent API calls
- **Response Compression**: Gzip enabled
- **Connection Pooling**: Reused connections

## 🔄 Integration Points

### Frontend ↔ Backend
- REST API via HTTP
- JSON request/response format
- Error handling at both layers

### Backend ↔ External APIs
- AlQuran.cloud for Quran data
- Local database for Amharic

### Error Handling Flow

```
Error Occurs
    │
    ▼
Service catches error
    │
    ├─→ Operational error?
    │   └─→ Return proper HTTP status
    │
    └─→ Unexpected error?
        └─→ Log and return 500
    │
    ▼
Controller handles error
    │
    ▼
Express error middleware
    │
    ▼
HTTP response with error
    │
    ▼
Frontend receives error
    │
    ▼
User-friendly error message
```

---

## 📚 Additional Resources

- [Backend README](./backend/README.md) - API details
- [SETUP.md](./SETUP.md) - Installation guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

