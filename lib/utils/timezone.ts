/**
 * Centralized Timezone Utility for GMT+7 (Asia/Bangkok)
 * 
 * This module provides consistent date/time handling across the entire application,
 * ensuring all operations use GMT+7 timezone regardless of server or client location.
 * 
 * Best Practices Applied:
 * - Uses Intl.DateTimeFormat for reliable timezone formatting (recommended by MDN)
 * - Stores timestamps in UTC for database consistency
 * - Displays dates in user's target timezone (GMT+7)
 * - Uses IANA timezone names (e.g., 'Asia/Bangkok') instead of fixed offsets
 * - No external dependencies (uses native JavaScript APIs)
 * 
 * Key Principles:
 * 1. STORE in UTC - Always store timestamps as ISO 8601 UTC strings
 * 2. DISPLAY in GMT+7 - Convert to GMT+7 only when displaying to users
 * 3. COMPARE dates using UTC timestamps to avoid timezone confusion
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * @see https://dev.to/kcsujeet/how-to-handle-date-and-time-correctly-to-avoid-timezone-bugs-4o03
 */

// Application timezone constant - IANA timezone name (recommended over fixed offsets)
export const APP_TIMEZONE = 'Asia/Bangkok';
export const APP_LOCALE = 'en-US'; // Default locale for formatting

// Internal helper to get parts using Intl (more reliable than manual calculation)
function getDatePartsInTimezone(date: Date, timeZone: string): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
} {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const getValue = (type: string): number => {
        const part = parts.find(p => p.type === type);
        return part ? parseInt(part.value, 10) : 0;
    };

    return {
        year: getValue('year'),
        month: getValue('month'),
        day: getValue('day'),
        hour: getValue('hour') === 24 ? 0 : getValue('hour'), // Handle midnight edge case
        minute: getValue('minute'),
        second: getValue('second'),
    };
}

/**
 * Get current date parts in GMT+7 timezone
 * Uses Intl.DateTimeFormat for accurate timezone conversion
 * 
 * @returns Object with year, month, day, hour, minute, second in GMT+7
 */
export function getNowPartsInGMT7(): {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
} {
    return getDatePartsInTimezone(new Date(), APP_TIMEZONE);
}

/**
 * Get today's date in YYYY-MM-DD format (GMT+7)
 * Uses Intl.DateTimeFormat for accurate timezone handling
 * 
 * @returns Date string in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
    const parts = getNowPartsInGMT7();
    return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

/**
 * Get current time in HH:MM:SS format (GMT+7)
 * 
 * @returns Time string in HH:MM:SS format
 */
export function getCurrentTimeString(): string {
    const parts = getNowPartsInGMT7();
    return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:${String(parts.second).padStart(2, '0')}`;
}

/**
 * Get current ISO timestamp in GMT+7
 * Returns format: YYYY-MM-DDTHH:MM:SS+07:00
 * 
 * Note: For database storage, use createTimestamp() which returns UTC
 * 
 * @returns ISO timestamp string with GMT+7 offset
 */
export function getISOTimestampGMT7(): string {
    const parts = getNowPartsInGMT7();
    return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}T${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:${String(parts.second).padStart(2, '0')}+07:00`;
}

/**
 * Create an ISO timestamp string for database storage
 * Always returns UTC format for consistency
 * 
 * Best Practice: Store dates in UTC, display in local timezone
 * 
 * @returns ISO timestamp string in UTC (e.g., "2024-12-15T10:00:00.000Z")
 */
export function createTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Format any date to YYYY-MM-DD in GMT+7 timezone
 * Uses Intl.DateTimeFormat for accuracy
 * 
 * @param date - Date to format (can be Date object, ISO string, or timestamp)
 * @returns Date string in YYYY-MM-DD format (in GMT+7)
 */
export function formatDateISO(date: Date | string | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const parts = getDatePartsInTimezone(inputDate, APP_TIMEZONE);
    return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

/**
 * Format any date's time to HH:MM:SS in GMT+7 timezone
 * 
 * @param date - Date to format
 * @returns Time string in HH:MM:SS format
 */
export function formatTimeISO(date: Date | string | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const parts = getDatePartsInTimezone(inputDate, APP_TIMEZONE);
    return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:${String(parts.second).padStart(2, '0')}`;
}

/**
 * Format time to HH:MM (short time format) in GMT+7
 * 
 * @param date - Date to format
 * @returns Time string in HH:MM format
 */
export function formatTimeShort(date: Date | string | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const parts = getDatePartsInTimezone(inputDate, APP_TIMEZONE);
    return `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`;
}

/**
 * Format date for display using Intl.DateTimeFormat with Asia/Bangkok timezone
 * This is the RECOMMENDED way to format dates for display
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateDisplay(
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: APP_TIMEZONE,
        ...options,
    };

    return new Intl.DateTimeFormat(APP_LOCALE, defaultOptions).format(inputDate);
}

/**
 * Format date as "Month Day, Year" (e.g., "December 15, 2024")
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateLong(date: Date | string | number): string {
    return formatDateDisplay(date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format date as "MMM DD, YYYY" (e.g., "Dec 15, 2024")
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateMedium(date: Date | string | number): string {
    return formatDateDisplay(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format date as "MM/DD/YYYY" (e.g., "12/15/2024")
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateShort(date: Date | string | number): string {
    return formatDateDisplay(date, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * Format time for display using Intl.DateTimeFormat
 * 
 * @param date - Date to format
 * @param hour12 - Use 12-hour format (default: false for 24-hour)
 * @returns Formatted time string
 */
export function formatTimeDisplay(
    date: Date | string | number,
    hour12: boolean = false
): string {
    return formatDateDisplay(date, {
        hour: '2-digit',
        minute: '2-digit',
        hour12,
    });
}

/**
 * Format datetime for display
 * 
 * @param date - Date to format
 * @param options - Additional options
 * @returns Formatted datetime string
 */
export function formatDateTimeDisplay(
    date: Date | string | number,
    options: {
        showSeconds?: boolean;
        hour12?: boolean;
        dateStyle?: 'long' | 'medium' | 'short';
    } = {}
): string {
    const { showSeconds = false, hour12 = false, dateStyle = 'medium' } = options;

    const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: APP_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12,
    };

    if (showSeconds) {
        dateOptions.second = '2-digit';
    }

    if (dateStyle === 'long') {
        dateOptions.year = 'numeric';
        dateOptions.month = 'long';
        dateOptions.day = 'numeric';
    } else if (dateStyle === 'medium') {
        dateOptions.year = 'numeric';
        dateOptions.month = 'short';
        dateOptions.day = 'numeric';
    } else {
        dateOptions.year = 'numeric';
        dateOptions.month = '2-digit';
        dateOptions.day = '2-digit';
    }

    return formatDateDisplay(date, dateOptions);
}

/**
 * Get current year in GMT+7
 * 
 * @returns Current year number
 */
export function getCurrentYear(): number {
    return getNowPartsInGMT7().year;
}

/**
 * Get current month in GMT+7 (1-indexed for consistency, 1 = January)
 * Note: This returns 1-12, not 0-11 like JavaScript Date.getMonth()
 * 
 * @returns Current month number (1-12)
 */
export function getCurrentMonth(): number {
    return getNowPartsInGMT7().month;
}

/**
 * Get current day of month in GMT+7
 * 
 * @returns Current day of month (1-31)
 */
export function getCurrentDay(): number {
    return getNowPartsInGMT7().day;
}

/**
 * Get current hour in GMT+7 (24-hour format)
 * 
 * @returns Current hour (0-23)
 */
export function getCurrentHour(): number {
    return getNowPartsInGMT7().hour;
}

/**
 * Get current minute in GMT+7
 * 
 * @returns Current minute (0-59)
 */
export function getCurrentMinute(): number {
    return getNowPartsInGMT7().minute;
}

/**
 * Check if a given date is today (in GMT+7)
 * 
 * @param date - Date to check
 * @returns true if the date is today in GMT+7
 */
export function isToday(date: Date | string | number): boolean {
    const today = getTodayDateString();
    const checkDate = formatDateISO(date);
    return today === checkDate;
}

/**
 * Check if a given date is yesterday (in GMT+7)
 * 
 * @param date - Date to check
 * @returns true if the date is yesterday in GMT+7
 */
export function isYesterday(date: Date | string | number): boolean {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const yesterdayStr = formatDateISO(yesterday);
    const checkDate = formatDateISO(date);
    return yesterdayStr === checkDate;
}

/**
 * Get relative time description (Today, Yesterday, or formatted date)
 * 
 * @param date - Date to describe
 * @returns Relative time string
 */
export function getRelativeTimeLabel(date: Date | string | number): string {
    if (isToday(date)) {
        return 'Today';
    }
    if (isYesterday(date)) {
        return 'Yesterday';
    }
    return formatDateMedium(date);
}

/**
 * Compare two dates (ignoring time) in GMT+7
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(
    date1: Date | string | number,
    date2: Date | string | number
): -1 | 0 | 1 {
    const d1 = formatDateISO(date1);
    const d2 = formatDateISO(date2);

    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
}

/**
 * Get days difference between two dates
 * Uses date strings in GMT+7 for accurate day counting
 * 
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (can be negative)
 */
export function getDaysDifference(
    date1: Date | string | number,
    date2: Date | string | number
): number {
    const d1Str = formatDateISO(date1);
    const d2Str = formatDateISO(date2);

    // Parse as dates at midnight UTC for consistent calculation
    const d1 = new Date(d1Str + 'T00:00:00Z');
    const d2 = new Date(d2Str + 'T00:00:00Z');

    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// LEGACY COMPATIBILITY FUNCTIONS
// These are kept for backward compatibility with existing code
// ============================================================================

/**
 * @deprecated Use getNowPartsInGMT7() instead for accurate timezone handling
 * This function is kept for backward compatibility
 */
export function getNowInGMT7(): Date {
    const parts = getNowPartsInGMT7();
    // Create a date object with these values (note: this is in local timezone)
    return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

/**
 * @deprecated Use formatDateISO() directly with the date
 * Convert isn't needed when using Intl.DateTimeFormat-based functions
 */
export function toGMT7(date: Date | string | number): Date {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    const parts = getDatePartsInTimezone(inputDate, APP_TIMEZONE);
    return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}

/**
 * Get the start of today in GMT+7 (midnight)
 * 
 * @returns Date object representing midnight today
 */
export function getStartOfToday(): Date {
    const parts = getNowPartsInGMT7();
    return new Date(parts.year, parts.month - 1, parts.day, 0, 0, 0, 0);
}

/**
 * Get the end of today in GMT+7 (23:59:59.999)
 * 
 * @returns Date object representing end of today
 */
export function getEndOfToday(): Date {
    const parts = getNowPartsInGMT7();
    return new Date(parts.year, parts.month - 1, parts.day, 23, 59, 59, 999);
}

/**
 * Parse a date string and return Date parts in GMT+7
 * 
 * @param dateString - Date string to parse (YYYY-MM-DD or ISO format)
 * @returns Object with date parts in GMT+7
 */
export function parseDateInGMT7(dateString: string): {
    year: number;
    month: number;
    day: number;
} {
    // For YYYY-MM-DD format, parse directly
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return { year, month, day };
    }

    // For ISO strings or other formats, convert through Date
    const parts = getDatePartsInTimezone(new Date(dateString), APP_TIMEZONE);
    return {
        year: parts.year,
        month: parts.month,
        day: parts.day,
    };
}
