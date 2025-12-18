/**
 * Attendance Statistics Utility Functions
 * 
 * Helper functions for formatting and displaying attendance statistics.
 * This is a pure utility file that can be used on both client and server.
 */

/**
 * Convert average check-in minutes to display format
 * 
 * @param avgMinutes - Average minutes from midnight (e.g., 665 for 11:05 AM)
 * @returns Object with formatted time and meridiem, or defaults if null
 */
export function formatCheckInTimeDisplay(avgMinutes: number | null): {
    time: string;
    meridiem: string;
} {
    if (avgMinutes === null) {
        return { time: '--', meridiem: '' };
    }

    // Clamp to valid range (0-1439 minutes in a day)
    const clampedMinutes = Math.max(0, Math.min(1439, Math.round(avgMinutes)));

    const hours24 = Math.floor(clampedMinutes / 60);
    const minutes = clampedMinutes % 60;

    // Convert to 12-hour format
    const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
    const meridiem = hours24 < 12 ? 'AM' : 'PM';

    // Format as HH:MM
    const timeStr = `${hours12}:${String(minutes).padStart(2, '0')}`;

    return { time: timeStr, meridiem };
}
