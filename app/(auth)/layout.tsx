import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | MorvaHR",
  description: "Sign in to MorvaHR",
};

/**
 * Auth-specific layout
 * Minimal layout for authentication pages (login, register, etc.)
 * Route group ensures clean URLs (no /auth prefix in URL)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

