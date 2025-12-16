/**
 * Time Engine - Timezone-Safe Date/Time Operations
 * 
 * This module provides timezone-safe utilities for handling dates and times
 * in the Asia/Jakarta (WIB / GMT+7) timezone while keeping the server in UTC.
 * 
 * CORE PRINCIPLES:
 * 1. Server remains in UTC - NO TZ environment variable
 * 2. All database timestamps are stored in UTC
 * 3. Timezone is applied ONLY for:
 *    - Date boundaries (start/end of day)
 *    - UI formatting (separate module)
 * 4. Logic comparisons use this engine, NOT raw Date objects
 * 
 * @see Timezone-Safe-Execution-Plan.md
 */

import { fromZonedTime } from 'date-fns-tz';

// Application timezone constant - IANA timezone name
export const APP_TIMEZONE = 'Asia/Jakarta';

/**
 * Get absolute current time in UTC
 * 
 * This returns the actual current moment in time.
 * NEVER manipulate this Date for logical comparisons.
 * Use this ONLY for:
 * - Creating timestamps for database storage
 * - Duration calculations (end - start)
 * 
 * @returns Date object representing current UTC time
 */
export function nowUTC(): Date {
    return new Date();
}

/**
 * Create an ISO timestamp string for database storage
 * Always returns UTC format for consistency
 * 
 * @returns ISO timestamp string in UTC (e.g., "2024-12-15T10:00:00.000Z")
 */
export function createTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Get today's date in YYYY-MM-DD format in APP_TIMEZONE
 * 
 * This is the local "calendar day" in WIB timezone.
 * Use this for:
 * - Database date column comparisons (eq('date', todayLocal()))
 * - Display purposes
 * 
 * @returns Date string in YYYY-MM-DD format (e.g., "2024-12-16")
 */
export function todayLocal(): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: APP_TIMEZONE,
        dateStyle: 'short',
    }).format(new Date());
}

/**
 * Convert local calendar day to UTC range for database queries
 * 
 * This is the CORRECT way to query "today's" records from the database.
 * It converts the local timezone's day boundaries to UTC.
 * 
 * Example: For WIB (GMT+7) on 2024-12-16:
 * - start = 2024-12-15T17:00:00.000Z (midnight WIB in UTC)
 * - end = 2024-12-16T16:59:59.000Z (23:59:59 WIB in UTC)
 * 
 * Usage:
 * ```typescript
 * const { start, end } = getLocalDayRangeUTC();
 * supabase.from('records')
 *   .gte('created_at', start.toISOString())
 *   .lte('created_at', end.toISOString())
 * ```
 * 
 * @param date - Date string in YYYY-MM-DD format (defaults to today)
 * @returns Object with start and end Date objects in UTC
 */
export function getLocalDayRangeUTC(date: string = todayLocal()): {
    start: Date;
    end: Date;
} {
    return {
        start: fromZonedTime(`${date} 00:00:00`, APP_TIMEZONE),
        end: fromZonedTime(`${date} 23:59:59`, APP_TIMEZONE),
    };
}

/**
 * Internal helper to get current time parts in APP_TIMEZONE
 */
function getCurrentTimeParts(): { hour: number; minute: number; second: number } {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const getValue = (type: string): number => {
        const part = parts.find(p => p.type === type);
        return part ? parseInt(part.value, 10) : 0;
    };

    return {
        hour: getValue('hour') === 24 ? 0 : getValue('hour'),
        minute: getValue('minute'),
        second: getValue('second'),
    };
}

/**
 * Get current hour in APP_TIMEZONE (0-23)
 * 
 * @returns Current hour number
 */
export function getCurrentHourLocal(): number {
    return getCurrentTimeParts().hour;
}

/**
 * Get current minutes since midnight in APP_TIMEZONE
 * 
 * This is useful for comparing against shift times.
 * 
 * @returns Number of minutes since midnight (0-1439)
 */
export function getCurrentMinutesSinceMidnight(): number {
    const { hour, minute } = getCurrentTimeParts();
    return hour * 60 + minute;
}

/**
 * Compare current time against a shift hour
 * 
 * This is the SAFE way to determine check-in/check-out status.
 * It compares the current time in APP_TIMEZONE against the shift hour.
 * 
 * @param shiftHour - Shift hour (0-23) in APP_TIMEZONE
 * @param toleranceMinutes - Minutes of tolerance for "on time" (default: 1)
 * @returns -1 if before shift, 0 if on time (within tolerance), 1 if after shift
 */
export function compareToShiftTime(
    shiftHour: number,
    toleranceMinutes: number = 1
): -1 | 0 | 1 {
    const currentMinutes = getCurrentMinutesSinceMidnight();
    const shiftMinutes = shiftHour * 60;
    const shiftWithTolerance = shiftMinutes + toleranceMinutes;

    if (currentMinutes < shiftMinutes) return -1;  // Before shift
    if (currentMinutes <= shiftWithTolerance) return 0;  // On time (within tolerance)
    return 1;  // After shift (late for check-in, overtime for check-out)
}

/**
 * Get date parts in APP_TIMEZONE
 * 
 * @returns Object with year, month (1-12), day
 */
export function getNowPartsLocal(): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
} {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const getValue = (type: string): number => {
        const part = parts.find(p => p.type === type);
        return part ? parseInt(part.value, 10) : 0;
    };

    return {
        year: getValue('year'),
        month: getValue('month'),
        day: getValue('day'),
        hour: getValue('hour') === 24 ? 0 : getValue('hour'),
        minute: getValue('minute'),
        second: getValue('second'),
    };
}
