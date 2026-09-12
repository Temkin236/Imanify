# Imanify (ኢማኒፋይ) - Islamic AI Assistant & Lifestyle Companion

> A modern, full-stack Islamic lifestyle platform featuring multi-lingual Quran services, authentic Azkar, accurate prayer times with Qibla tracking, and an intelligent Islamic AI assistant.

---

## ✨ Features

- 📖 **Holy Quran with Multi-Language Support**
  - Arabic Uthmani text with audio recitations.
  - Authentic English and Amharic (አማርኛ) translations.
  - Search by Surah, Ayah number, and keywords.

- 🤲 **Daily Azkar & Supplications (አዝካር)**
  - Morning (የማለዳ), Evening (የምሽት), Post-Prayer (ከሶላት በኋላ), and Sleep (የመኝታ) Azkar.
  - Repetition counters, Arabic text, transliteration, English, and Amharic translations.

- 🕌 **Prayer Times & Qibla Compass**
  - High-precision calculation based on geographic coordinates or city names.
  - Multiple calculation authorities (MWL, ISNA, Egypt, Umm Al-Qura, Karachi).
  - Accurate Qibla heading relative to true north.

- 🤖 **Islamic AI Assistant & Chatbot**
  - RAG-powered responses rooted in authentic Quranic and Hadith sources.
  - Multi-provider support (Gemini, Groq, Ollama, OpenRouter).
  - Contextual conversation memory with Islamic etiquette and boundaries.

- 🔥 **Habit & Streak Tracker**
  - Daily active streak monitoring and milestones.
  - Achievement badges for consistent Quran reading and Azkar recitation.

---

## 🏗️ Architecture

```
Imanify/
├── backend/                  # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/      # Route controllers (Auth, Chat, Quran, Azkar, Prayers)
│   │   ├── services/         # Business logic & external API integrations
│   │   ├── routes/           # Express router endpoints
│   │   ├── models/           # Data models and interfaces
│   │   ├── utils/            # Logging, error handling, config, auth store
│   │   └── data/             # Static Islamic data (Quran, Azkar, User state)
│   └── tests/                # Unit and integration test suites
│
├── frontend/                 # React + Vite + TypeScript Client App
│   ├── src/
│   │   ├── components/       # Reusable UI components & layouts
│   │   ├── context/          # State management (Auth, Theme, Prayers)
│   │   ├── services/         # Backend API client services
│   │   ├── hooks/            # Custom React hooks
│   │   └── data/             # Localized resources and assets
│   └── public/               # Public assets and icons
│
└── docs/                     # Architecture, deployment, and API guides
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 9.0.0

### 1. Clone the repository
```bash
git clone https://github.com/temkin236/Imanify.git
cd Imanify
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The backend API will start at `http://localhost:5000` (or `PORT` specified in `.env`).

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The frontend application will start at `http://localhost:5173`.

---

## 🌐 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and uptime |
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/register` | Create a new user account |
| `GET` | `/api/user/profile` | Retrieve authenticated user profile and streak |
| `POST` | `/api/user/activity` | Record daily activity and advance streak |
| `GET` | `/api/quran/:surah/:ayah` | Fetch specific Ayah with translations |
| `GET` | `/api/azkar` | Retrieve all Azkar items |
| `GET` | `/api/azkar/:category` | Filter Azkar by category |
| `GET` | `/api/prayer` | Calculate prayer times by coordinates or city |
| `GET` | `/api/qibla` | Get Qibla compass direction |
| `POST` | `/api/chat` | Send prompt to Islamic AI assistant |

---

## 📄 License

This project is licensed under the MIT License.
