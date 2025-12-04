/**
 * Dashboard Shell (Server Component)
 * 
 * PERFORMANCE OPTIMIZATION: Static layout rendered on the server
 * This component provides the static structure/shell of the dashboard
 * that doesn't require client-side JavaScript.
 * 
 * Benefits:
 * - Zero JavaScript for static parts
 * - Faster initial page load
 * - Better Core Web Vitals (FCP, LCP)
 * - SEO-friendly static content
 */

import { ReactNode } from 'react';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-neutral-50">
      {/* Main Content Container - Mobile First (375px base) */}
      <div className="mx-auto w-full max-w-[402px] pb-20">
        {/* Content wrapper with consistent padding */}
        <div className="flex flex-col items-center gap-3 px-6 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
