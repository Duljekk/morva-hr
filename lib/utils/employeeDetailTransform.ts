/**
 * Employee Detail Data Transformation Utilities
 * 
 * Utility functions for transforming database employee data to match
 * the EmployeeLeftSectionData interface used by UI components.
 */

import { APP_TIMEZONE, APP_LOCALE } from './timezone';
import type { RoleBadgeVariant } from '@/components/shared/RoleBadge';
import type { EmployeeLeftSectionData } from '@/components/hr/employee/EmployeeDetailsLeftSection';

/**
 * Database user row type for employee detail queries
 */
export interface DbUserDetail {
  id: string;
  email: string;
  full_name: string;
  profile_picture_url: string | null;
  role: string;
  employment_type: string | null;
  birthdate: string | null;
  salary: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
}

/**
 * Format a birthdate to "DD Month, YYYY" format (e.g., "10 December, 2001")
 */
export function formatDetailBirthDate(date: string | null): string {
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
 * Format salary to IDR currency format (e.g., "IDR 6.500.000")
 */
export function formatCurrencyIDR(amount: number | null): string {
  if (amount === null || amount === undefined) return '-';
  
  // Format with Indonesian locale for proper thousand separators
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  return `IDR ${formatted}`;
}


/**
 * Format contract period to "DD MMM - DD MMM YYYY" format (e.g., "8 Sep - 8 Dec 2025")
 */
export function formatDetailContractPeriod(startDate: string | null, endDate: string | null): string {
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
    
    if (startDate && !endDate) {
      return 'Permanent';
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
 */
export function mapDetailEmploymentTypeToRole(employmentType: string | null): RoleBadgeVariant {
  switch (employmentType) {
    case 'intern':
      return 'Intern';
    case 'full_time':
    case 'part_time':
    case 'contractor':
    default:
      return 'Full-time';
  }
}

/**
 * Build default leave balance
 */
export function buildDefaultLeaveBalance(): { current: number; total: number } {
  return { current: 0, total: 10 };
}

/**
 * Build placeholder bank details
 */
export function buildPlaceholderBankDetails(employeeName: string): {
  bankName: string;
  recipientName: string;
  accountNumber: string;
} {
  return {
    bankName: 'Bank Central Asia (BCA)',
    recipientName: employeeName.toUpperCase(),
    accountNumber: '4640286879',
  };
}

/**
 * Transform database user row to EmployeeLeftSectionData
 */
export function toEmployeeLeftSectionData(
  userRow: DbUserDetail,
  leaveBalance?: { current: number; total: number }
): EmployeeLeftSectionData {
  return {
    name: userRow.full_name,
    email: userRow.email,
    imageUrl: userRow.profile_picture_url,
    role: mapDetailEmploymentTypeToRole(userRow.employment_type),
    birthDate: formatDetailBirthDate(userRow.birthdate),
    salary: formatCurrencyIDR(userRow.salary),
    leaveBalance: leaveBalance ?? buildDefaultLeaveBalance(),
    contractPeriod: formatDetailContractPeriod(userRow.contract_start_date, userRow.contract_end_date),
    bankDetails: buildPlaceholderBankDetails(userRow.full_name),
  };
}
