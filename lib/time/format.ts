/**
 * Time Formatting - UI Display Only
 * 
 * This module provides timezone-aware formatting for UI display.
 * 
 * IMPORTANT: NEVER use these functions for logic or comparisons.
 * Use time-engine.ts for any date/time logic.
 * 
 * @see Timezone-Safe-Execution-Plan.md
 */

// Application timezone constant - IANA timezone name
export const APP_TIMEZONE = 'Asia/Jakarta';

/**
 * Format timestamp for UI display in WIB
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted datetime string (e.g., "16 Des 2024, 13:45")
 */
export function formatWIB(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('id-ID', {
        timeZone: APP_TIMEZONE,
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(inputDate);
}

/**
 * Format time only (HH:MM) in WIB
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Time string in HH:MM format (e.g., "13:45")
 */
export function formatTimeWIB(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(inputDate);
}

/**
 * Format time with AM/PM indicator in WIB
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Time string with AM/PM (e.g., "1:45 PM")
 */
export function formatTimeWIB12(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(inputDate);
}

/**
 * Format date only in WIB (YYYY-MM-DD)
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateISO(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('en-CA', {
        timeZone: APP_TIMEZONE,
        dateStyle: 'short',
    }).format(inputDate);
}

/**
 * Format date for display (e.g., "December 16, 2024")
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string
 */
export function formatDateLong(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(inputDate);
}

/**
 * Format date for display (e.g., "Dec 16, 2024")
 * 
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted date string
 */
export function formatDateMedium(date: string | Date | number): string {
    const inputDate = typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;

    return new Intl.DateTimeFormat('en-US', {
        timeZone: APP_TIMEZONE,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(inputDate);
}

/**
 * Format date range for display (e.g., "14-15 Nov" or "30 Nov - 2 Dec")
 * 
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

    // If same month, show "14-15 Nov", otherwise "30 Nov - 2 Dec"
    if (startMonth === endMonth) {
        if (startDay === endDay) {
            return `${startDay} ${startMonth}`;
        }
        return `${startDay}-${endDay} ${startMonth}`;
    } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }
}
