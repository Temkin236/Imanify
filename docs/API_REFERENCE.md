# Imanify REST API Reference

Base URL: `http://localhost:5000/api` (development) or production domain.

All endpoints return JSON wrapped in a standard `ApiResponse<T>` envelope:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

---

## 1. System Endpoints

### GET `/api/health`
Returns the operational health and uptime status of the backend API.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "message": "Imanify Backend is running"
  },
  "timestamp": "2026-09-19T20:30:00.000Z"
}
```

---

## 2. Authentication & User Endpoints

### POST `/api/auth/register`
Creates a new user profile.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### POST `/api/auth/login`
Authenticates user credentials and issues an authentication token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

### GET `/api/user/profile`
Fetches the profile and streak statistics of the authenticated user.

**Headers:**
`Authorization: Bearer <token>`

---

## 3. Quran Endpoints

### GET `/api/quran/:surah/:ayah`
Retrieves a specific verse with Arabic text, transliteration, and English/Amharic translations.

**Parameters:**
- `surah` (number): Surah index (1 to 114)
- `ayah` (number): Ayah index within the Surah

**Response:**
```json
{
  "success": true,
  "data": {
    "surah": 1,
    "ayah": 1,
    "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "english": "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    "amharic": "በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው"
  }
}
```

---

## 4. Azkar & Supplications Endpoints

### GET `/api/azkar`
Retrieves the complete list of daily Azkar supplications.

### GET `/api/azkar/:category`
Filters Azkar items by category.

**Categories:**
- `morning` (የማለዳ አዝካር)
- `evening` (የምሽት አዝካር)
- `after_prayer` (ከሶላት በኋላ)
- `sleep` (የመኝታ አዝካር)

---

## 5. Prayer Times & Qibla Endpoints

### GET `/api/prayer`
Calculates daily prayer timings for a specified location.

**Query Parameters:**
- `city` (string): e.g. `Addis Ababa`
- `country` (string, optional): e.g. `Ethiopia` (default)
- `method` (number, optional): Calculation authority (default: `2` - Islamic Society of North America / ISNA)

**Response:**
```json
{
  "success": true,
  "data": {
    "city": "Addis Ababa",
    "country": "Ethiopia",
    "date": "19 Sep 2026",
    "hijriDate": "08-04-1448",
    "timings": {
      "Fajr": "04:58",
      "Dhuhr": "12:14",
      "Asr": "15:28",
      "Maghrib": "18:18",
      "Isha": "19:25"
    }
  }
}
```

### GET `/api/qibla`
Computes the exact Qibla direction in degrees relative to true north.

**Query Parameters:**
- `lat` (number): Latitude coordinate
- `lon` (number): Longitude coordinate

---

## 6. AI Assistant Chat Endpoint

### POST `/api/chat`
Interacts with the Islamic scholar assistant.

**Request Body:**
```json
{
  "message": "What are the recommended sunnah prayers before Dhuhr?",
  "history": []
}
```
