import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee Dashboard | MorvaHR",
  description: "Employee dashboard for MorvaHR",
};

/**
 * Employee-specific layout
 * This layout wraps all employee routes and provides shared UI/navigation
 * Route group ensures clean URLs (no /employee prefix in URL)
 */
export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

