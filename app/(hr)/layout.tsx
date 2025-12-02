import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR Dashboard | MorvaHR",
  description: "HR dashboard for MorvaHR",
};

/**
 * HR-specific layout
 * This layout wraps all HR routes and provides shared UI/navigation
 * Route group (hr) organizes routes without affecting URLs
 * HR routes are accessible at /hr, /hr/leaves, /hr/payslips
 */
export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
