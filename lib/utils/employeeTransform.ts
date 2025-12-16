/**
 * Employee Data Transformation Utilities
 * 
 * Utility functions for transforming database employee data to match
 * the Employee interface used by UI components.
 */

import { APP_TIMEZONE, APP_LOCALE } from './timezone';
import type { RoleBadgeVariant } from '@/components/shared/RoleBadge';

/**
 * Format a birthdate to "DD Month YYYY" format (e.g., "10 December 2001")
 * 
 * @param date - Date string in YYYY-MM-DD format or null
 * @returns Formatted date string or "Not specified" if null
 */
export function formatBirthDate(date: string | null): string {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = new Date(date + 'T00:00:00');
    return new Intl.DateTimeFormat(APP_LOCALE, {
      timeZone: APP_TIMEZONE,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return 'Not specified';
  }
}

/**
 * Format contract period to "DD MMM - DD MMM YYYY" format (e.g., "8 Sep - 8 Dec 2025")
 * 
 * @param startDate - Contract start date in YYYY-MM-DD format or null
 * @param endDate - Contract end date in YYYY-MM-DD format or null
 * @returns Formatted contract period string or "Not specified" if both null
 */
export function formatContractPeriod(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) return 'Not specified';
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'short',
  };
  
  const formatWithYear: Intl.DateTimeFormatOptions = {
    ...formatOptions,
    year: 'numeric',
  };
  
  try {
    if (startDate && endDate) {
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      
      const startFormatted = new Intl.DateTimeFormat(APP_LOCALE, formatOptions).format(start);
      const endFormatted = new Intl.DateTimeFormat(APP_LOCALE, formatWithYear).format(end);
      
      return `${startFormatted} - ${endFormatted}`;
    }
    
    if (startDate) {
      const start = new Date(startDate + 'T00:00:00');
      return `From ${new Intl.DateTimeFormat(APP_LOCALE, formatWithYear).format(start)}`;
    }
    
    if (endDate) {
      const end = new Date(endDate + 'T00:00:00');
      return `Until ${new Intl.DateTimeFormat(APP_LOCALE, formatWithYear).format(end)}`;
    }
    
    return 'Not specified';
  } catch {
    return 'Not specified';
  }
}

/**
 * Map database employment_type to RoleBadgeVariant
 * 
 * Note: RoleBadge currently only supports 'Intern' and 'Full-time'.
 * Part-time and contractor are mapped to 'Full-time' until the component is extended.
 * 
 * @param employmentType - Database employment type ('intern', 'full_time', 'part_time', 'contractor')
 * @returns RoleBadgeVariant for the UI component
 */
export function mapEmploymentTypeToRole(employmentType: string | null): RoleBadgeVariant {
  switch (employmentType) {
    case 'intern':
      return 'Intern';
    case 'full_time':
    case 'part_time':
    case 'contractor':
    default:
      return 'Full-time'; // Default to Full-time for all non-intern types
  }
}

/**
 * Determine attendance status from attendance record
 * 
 * @param attendanceRecord - Attendance record with check_in_time and check_out_time
 * @returns Status object with label and isActive flag
 */
export function getAttendanceStatus(attendanceRecord: {
  check_in_time: string | null;
  check_out_time: string | null;
} | null): { label: string; isActive: boolean } {
  if (!attendanceRecord) {
    return { label: 'Not checked in', isActive: false };
  }
  
  if (attendanceRecord.check_out_time) {
    return { label: 'Checked out', isActive: false };
  }
  
  if (attendanceRecord.check_in_time) {
    return { label: 'Checked in', isActive: true };
  }
  
  return { label: 'Not checked in', isActive: false };
}
