/**
 * Debug Timezone Endpoint
 * 
 * This endpoint provides information about the server's timezone configuration.
 * Use this to verify that the Timezone-Safe Execution Plan is working correctly.
 * 
 * SUCCESS CRITERIA:
 * - timezone_offset === 0 (server is in UTC)
 * - today_local shows correct date in WIB (Asia/Jakarta)
 * - should_be_zero === true
 * 
 * @see Timezone-Safe-Execution-Plan.md
 */

import {
    todayLocal,
    getLocalDayRangeUTC,
    getCurrentMinutesSinceMidnight,
    getNowPartsLocal,
    APP_TIMEZONE,
    nowUTC,
    createTimestamp
} from '@/lib/time/time-engine';

export async function GET() {
    const range = getLocalDayRangeUTC();
    const nowParts = getNowPartsLocal();

    return Response.json({
        // Server environment
        server_tz: process.env.TZ ?? 'not set (expected for Timezone-Safe approach)',

        // UTC information
        utc_now: nowUTC().toISOString(),
        timestamp: createTimestamp(),
        timezone_offset: new Date().getTimezoneOffset(),
        should_be_zero: new Date().getTimezoneOffset() === 0,

        // Local timezone information (in APP_TIMEZONE)
        app_timezone: APP_TIMEZONE,
        today_local: todayLocal(),
        current_time_parts: nowParts,
        current_minutes_since_midnight: getCurrentMinutesSinceMidnight(),

        // UTC day range for database queries
        today_range: {
            start: range.start.toISOString(),
            end: range.end.toISOString(),
            note: 'Use these values for .gte() and .lte() database queries',
        },

        // Verification helpers
        verification: {
            is_utc_server: new Date().getTimezoneOffset() === 0,
            local_hour_correct: nowParts.hour >= 0 && nowParts.hour <= 23,
            message: new Date().getTimezoneOffset() === 0
                ? '✅ Server is in UTC as expected'
                : '⚠️ Server is NOT in UTC - timezone_offset should be 0',
        },
    });
}
