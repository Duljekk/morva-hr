# Timezone-Safe Execution Plan
## Supabase + Vercel + Next.js (Asia/Jakarta / WIB)

### PURPOSE
Fix production timezone inconsistencies **without forcing server timezone** and ensure:
- Correct daily logic (attendance, notifications, payroll)
- Identical behavior in Dev & Prod
- Long-term safety for Supabase + Vercel infrastructure

---

## NON-NEGOTIABLE RULES

1. ❌ DO NOT set `TZ` anywhere (Dashboard, package.json, vercel.json, next.config.ts)
2. ❌ DO NOT rely on server local time
3. ✅ Supabase remains **UTC (`timestamptz`)**
4. ✅ Vercel remains **UTC**
5. ✅ Timezone is applied ONLY for:
   - Date boundaries (start/end of day)
   - UI formatting

> If logic breaks when server timezone changes, the logic is wrong.

---

## PHASE 1 — CODE AUDIT

### SEARCH FOR THESE PATTERNS
```
new Date()
Date.now()
startOfDay
endOfDay
isToday
toDateString
current_date
created_at::date
```

### CLASSIFY EACH USAGE
| Type | Meaning | Action |
|----|----|----|
| WRITE | Insert / Update timestamp | Allowed |
| DISPLAY | UI formatting | Allowed |
| LOGIC | “Today”, comparisons, grouping | MUST FIX |

---

## PHASE 2 — CREATE TIME ENGINE (CORE FIX)

### FILE
```
lib/time/time-engine.ts
```

### IMPLEMENTATION
```ts
import { zonedTimeToUtc } from 'date-fns-tz';

export const APP_TIMEZONE = 'Asia/Jakarta';

/** Absolute current time (UTC) */
export function nowUTC(): Date {
  return new Date();
}

/** YYYY-MM-DD in APP_TIMEZONE */
export function todayLocal(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: APP_TIMEZONE,
    dateStyle: 'short',
  }).format(new Date());
}

/** Convert local calendar day → UTC range */
export function getLocalDayRangeUTC(date = todayLocal()) {
  return {
    start: zonedTimeToUtc(`${date} 00:00:00`, APP_TIMEZONE),
    end: zonedTimeToUtc(`${date} 23:59:59`, APP_TIMEZONE),
  };
}
```

⚠️ ALL date logic must use this file.

---

## PHASE 3 — DATABASE QUERY FIXES (CRITICAL)

### ❌ FORBIDDEN PATTERNS
```sql
created_at::date = current_date
```

```ts
isToday(date)
startOfDay(new Date())
```

---

### ✅ REQUIRED PATTERN
```ts
import { getLocalDayRangeUTC } from '@/lib/time/time-engine';

const { start, end } = getLocalDayRangeUTC();

supabase
  .from('attendance')
  .select('*')
  .gte('created_at', start.toISOString())
  .lte('created_at', end.toISOString());
```

Apply this to:
- Attendance
- Notifications
- Payroll
- Daily reports
- “Already checked in today” checks

---

## PHASE 4 — TIMESTAMP WRITES (SAFE ZONE)

### ALLOWED
```ts
new Date().toISOString()
```

### OPTIONAL WRAPPER
```ts
export function createTimestamp() {
  return new Date().toISOString();
}
```

Use for:
- created_at
- updated_at
- read_at
- audit logs

⚠️ This does NOT fix “today” logic — Phase 3 does.

---

## PHASE 5 — UI DISPLAY ONLY

### FILE
```
lib/time/format.ts
```

```ts
export function formatWIB(date: string | Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}
```

❌ Never use for logic  
✅ UI only

---

## PHASE 6 — REMOVE BAD FIXES

Ensure NONE of the following exist:
- `TZ=` in package.json
- `process.env.TZ`
- vercel.json timezone hacks
- next.config.ts timezone enforcement

Delete if found.

---

## PHASE 7 — VERIFICATION (TEMPORARY)

### OPTIONAL DEBUG ROUTE
```ts
export async function GET() {
  return Response.json({
    utc_now: new Date().toISOString(),
    timezone_offset: new Date().getTimezoneOffset(), // MUST be 0
    today_local: todayLocal(),
    today_range: getLocalDayRangeUTC(),
  });
}
```

### SUCCESS CRITERIA
- `timezone_offset === 0`
- UI shows WIB correctly
- “Today” logic works at WIB midnight

---

## PHASE 8 — MIDNIGHT EDGE TEST (MANDATORY)

Test between **23:59 → 00:01 WIB**:
- No duplicate attendance
- No missing records
- Correct daily rollover

---

## PHASE 9 — LOCKDOWN

### ADD COMMENT WHERE NECESSARY
```ts
// DO NOT use server local time
// All date logic must go through time-engine.ts
```

---

## FINAL CHECKLIST

- [ ] Supabase UTC only
- [ ] Vercel UTC only
- [ ] No TZ hacks
- [ ] Time engine implemented
- [ ] All “today” logic refactored
- [ ] UI formatting isolated

---

## CORE PRINCIPLE (DO NOT FORGET)

> **A Date is a moment in time.  
> “Today” is a timezone-dependent business rule.**

This architecture matches Stripe, Google, Supabase, and Vercel best practices.
