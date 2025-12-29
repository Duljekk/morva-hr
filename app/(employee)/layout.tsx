import type { Metadata } from "next";
import PreloadDashboard from "./_components/PreloadDashboard";
import FloatingNavbar from "@/components/employee/FloatingNavbar";

export const metadata: Metadata = {
  title: "Employee Dashboard | MorvaHR",
  description: "Employee dashboard for MorvaHR",
};

// Force dynamic rendering for employee pages
export const dynamic = 'force-dynamic';

/**
 * Employee-specific layout
 * 
 * PERFORMANCE OPTIMIZATION: Includes data preloader
 * - PreloadDashboard warms the SWR cache when entering employee routes
 * - Data is ready when dashboard component mounts
 * - Uses requestIdleCallback to avoid blocking main thread
 * 
 * NAVIGATION: Includes FloatingNavbar
 * - Pill-shaped floating navigation bar at bottom center
 * - Provides navigation to Home, Attendance, Payslip, and Profile
 * - Page content should have bottom padding (pb-20+) to avoid overlap
 */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preload dashboard data in the background */}
      <PreloadDashboard />
      {children}
      {/* Floating navigation bar - fixed at bottom center */}
      <FloatingNavbar />
    </>
  );
}

