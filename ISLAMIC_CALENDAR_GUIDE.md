# Islamic Calendar Feature - Usage Guide

A complete Hijri (Islamic) calendar feature for Imanify built with React, TypeScript, and Tailwind CSS.

## Features

✨ **Core Features:**
- 🌙 Real Hijri date fetching via Aladhan API
- 📅 Gregorian to Hijri conversion utility
- 🎨 Beautiful, responsive React component
- 🔄 Built-in API caching (24-hour TTL)
- ⚡ Loading, error, and success states
- 🌟 Ramadan mode detection
- 🕌 Friday (Jumu'ah) highlighting
- 📱 Mobile responsive design
- 🎯 Dark mode with gold accents

## Installation

No additional packages required! The feature uses existing dependencies:
- `react` (already installed)
- `lucide-react` (already installed for icons)
- `tailwind-css` (already installed for styling)

## Files Created

1. **`src/services/hijriService.ts`** - Core service for Hijri date conversion
2. **`src/components/IslamicCalendarCard.tsx`** - React component displaying the calendar
3. **`src/components/Calendar.tsx`** - Updated to include IslamicCalendarCard

## Usage

### Basic Usage (in any React component)

```tsx
import { IslamicCalendarCard } from '@/components/IslamicCalendarCard';

export function MyComponent() {
  return <IslamicCalendarCard />;
}
```

### With Props

```tsx
// Display for a specific date
<IslamicCalendarCard date={new Date('2026-03-25')} />

// Show prayer time placeholder (optional)
<IslamicCalendarCard showPrayerTime={true} />

// Combined
<IslamicCalendarCard date={new Date()} showPrayerTime={true} />
```

### Service Usage - Direct API Calls

```tsx
import { getTodayHijriDate, formatHijriDate, getHijriDate } from '@/services/hijriService';

// Get today's Hijri date
const hijriData = await getTodayHijriDate();

// Get Hijri date for a specific date
const hijriData = await getHijriDate(new Date('2026-03-25'));

// Or using DD-MM-YYYY string
const hijriData = await getHijriDate('25-03-2026');

// Format the date nicely
const formatted = formatHijriDate(hijriData);
// Output: "15 Ramadan 1447 AH"
```

## API Response Structure

```typescript
interface HijriDateData {
  hijriDay: number;          // Day of month (1-30)
  hijriMonthEn: string;      // Month name in English (e.g., "Ramadan")
  hijriMonthAr: string;      // Month name in Arabic (e.g., "رمضان")
  hijriYear: number;         // Hijri year
  gregorianDate: string;     // Gregorian date (DD-MM-YYYY)
  isRamadan: boolean;        // Is it Ramadan?
  isFriday: boolean;         // Is it Friday?
  nextPrayerName?: string;   // Next prayer name (optional)
}
```

## Component Props

```typescript
interface IslamicCalendarCardProps {
  date?: Date;              // Date to fetch (default: today)
  showPrayerTime?: boolean; // Show prayer time placeholder (default: false)
}
```

## Advanced Examples

### Example 1: Custom Date Selection

```tsx
import { useState } from 'react';
import { IslamicCalendarCard } from '@/components/IslamicCalendarCard';

export function CalendarSelector() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <input 
        type="date" 
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      <IslamicCalendarCard date={selectedDate} />
    </div>
  );
}
```

### Example 2: Integration with Home Screen

```tsx
import { IslamicCalendarCard } from '@/components/IslamicCalendarCard';

export function Home() {
  return (
    <main className="space-y-6">
      <h1>Welcome to Imanify</h1>
      
      {/* Show Islamic Calendar */}
      <div className="max-w-md">
        <IslamicCalendarCard />
      </div>
      
      {/* Rest of home content */}
    </main>
  );
}
```

### Example 3: Using the Service Directly

```tsx
import { useState, useEffect } from 'react';
import { getTodayHijriDate, HijriDateData } from '@/services/hijriService';

export function HijriDisplay() {
  const [hijri, setHijri] = useState<HijriDateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const data = await getTodayHijriDate();
        setHijri(data);
      } finally {
        setLoading(false);
      }
    };

    fetchHijri();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!hijri) return <p>Error loading date</p>;

  return (
    <div>
      <p>Today: {hijri.hijriDay} {hijri.hijriMonthEn}</p>
      {hijri.isRamadan && <p>🌙 It's Ramadan!</p>}
      {hijri.isFriday && <p>🕌 Today is Friday (Jumu'ah)</p>}
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS with custom color variables defined in your theme:

```css
/* From index.css @theme section */
--color-islamic-green-950: #051a14;
--color-islamic-green-900: #0f3d2e;
--color-islamic-green-800: #1a5241;
--color-gold-500: #d4af37;
--color-gold-400: #e5c76b;
```

## Caching Behavior

The service includes automatic caching:
- **Cache Duration:** 24 hours
- **Cache Key:** Date string (DD-MM-YYYY format)
- **Clear Cache:** Call `clearHijriCache()` manually if needed

```tsx
import { clearHijriCache } from '@/services/hijriService';

// Clear cache when user settings change
clearHijriCache();
```

## Error Handling

The component gracefully handles errors:

```tsx
// Component shows error state with AlertCircle icon
// Service throws catchable errors

try {
  const hijri = await getHijriDate('invalid-date');
} catch (error) {
  console.error('Failed to get Hijri date:', error);
}
```

## Mobile Responsiveness

The component is fully responsive:
- **Desktop:** Full card with all details expanded
- **Tablet:** Adjusted padding and font sizes
- **Mobile:** Compact layout with readable text (`text-3xl sm:text-4xl`)

Breakpoints used: `sm`, `md` (default Tailwind breakpoints)

## Special Features

### Ramadan Detection

```tsx
if (hijri.isRamadan) {
  // Show Ramadan badge
  // Display special message
  // Highlight Ramadan content
}
```

### Friday (Jumu'ah) Detection

```tsx
if (hijri.isFriday && hijri.nextPrayerName === 'Jumu\'ah') {
  // Show Friday badge
  // Highlight prayer time for Jumu'ah
}
```

## Performance Tips

1. **Use Component Over Direct API Calls** - The component handles caching automatically
2. **Batch Requests** - If fetching multiple dates, the cache will prevent redundant requests
3. **Lazy Load** - Import with `React.lazy()` for code splitting
4. **Memoize Results** - Use `useMemo()` for derived computations

```tsx
import { useMemo } from 'react';

const memoizedHijri = useMemo(() => hijri, [hijri]);
```

## API Endpoint

Uses Aladhan's free API:
- **Endpoint:** `https://api.aladhan.com/v1/gToH?date=DD-MM-YYYY`
- **Rate Limit:** No strict limit (public API)
- **Response Time:** ~200-500ms typically
- **Fallback:** None (ensure stable connection)

## Future Enhancements

Potential improvements:
- [ ] Prayer times integration (fetch from Aladhan `/timingsByCity`)
- [ ] Islamic holidays highlighting
- [ ] Month view with all Hijri dates
- [ ] Time to next Islamic holiday countdown
- [ ] Qibla direction display
- [ ] Sunrise/sunset times
- [ ] Sunrise/sunset based daily reminders

## Troubleshooting

**Issue:** Component shows loading indefinitely
- **Solution:** Check network tab - API request may be failing. Verify URL is correct.

**Issue:** Wrong Hijri date displayed
- **Solution:** Verify your system date/time is correct. API uses your date input.

**Issue:** Cache not clearing between tests
- **Solution:** Call `clearHijriCache()` between tests or restart dev server.

**Issue:** Styling looks broken
- **Solution:** Ensure `@tailwindcss/vite` is configured and `src/index.css` imports Tailwind.

## License

Part of Imanify - Islamic learning companion app.

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Verify all files are created correctly
3. Ensure npm dependencies are installed: `npm install`
4. Restart dev server: `npm run dev`
