/**
 * Employee Dashboard Components
 * 
 * This barrel file exports all employee dashboard sub-components.
 * Components are organized here for:
 * - Clean imports from parent components
 * - Server/Client component separation
 * - Better code organization
 */

// Server Components (zero JS overhead)
export { default as DashboardShell } from './DashboardShell';
export { default as SectionHeader } from './SectionHeader';

// Client Components (interactive)
export { default as EmployeeDashboardClient } from './EmployeeDashboardClient';

// Data Fetching Hooks (SWR-based)
export { useDashboardData, useAttendance, useAnnouncements, useLeaveStatus, useActivities } from './useDashboardData';

// Data Preloading
export { preloadDashboardData, preloadAttendance } from './preloadDashboardData';
export { default as PreloadDashboard } from './PreloadDashboard';

// Future component exports:
// export { default as CheckInSection } from './CheckInSection';
// export { default as AttendanceLogSection } from './AttendanceLogSection';
// export { default as ActivitiesSection } from './ActivitiesSection';
