import SettingsPageClient from '@/components/hr/settings/SettingsPageClient';

/**
 * HR Settings Page (Server Component)
 * 
 * Route: /admin/settings
 * 
 * This page is automatically wrapped by the HR layout which provides:
 * - Sidebar navigation
 * - Main content area wrapper
 * - Consistent styling
 * 
 * Contains three tabs:
 * - Company: Company-wide settings
 * - Office Hours: Work schedule configuration
 * - Time Off & Holidays: Leave and holiday management
 */
export default function SettingsPage() {
  return <SettingsPageClient />;
}
