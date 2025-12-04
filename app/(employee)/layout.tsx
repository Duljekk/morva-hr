import type { Metadata } from "next";
import PreloadDashboard from "./_components/PreloadDashboard";

export const metadata: Metadata = {
  title: "Employee Dashboard | MorvaHR",
  description: "Employee dashboard for MorvaHR",
};

/**
 * Employee-specific layout
 * 
 * PERFORMANCE OPTIMIZATION: Includes data preloader
 * - PreloadDashboard warms the SWR cache when entering employee routes
 * - Data is ready when dashboard component mounts
 * - Uses requestIdleCallback to avoid blocking main thread
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
    </>
  );
}

