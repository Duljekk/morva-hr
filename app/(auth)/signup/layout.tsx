import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | MorvaHR",
  description: "Complete your account setup",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
