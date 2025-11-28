'use client';

import HRSidebar from '@/components/hr/HRSidebar';

/**
 * HR Dashboard Page
 * 
 * Main dashboard page for HR admins with sidebar navigation.
 * The main content area is left empty as requested.
 * 
 * Layout:
 * - Sidebar (275px) on the left
 * - Main content area on the right (empty for now)
 * 
 * Route: /hr
 * Note: The 'hr' folder name creates the URL segment, while (hr) route group
 * provides organization and shared layout without affecting the URL.
 */
export default function HRDashboard() {
  return (
    <div className="bg-neutral-50 flex items-start relative h-screen w-full">
      {/* Sidebar */}
      <HRSidebar />

      {/* Main Content Area - Empty for now */}
      <div className="box-border flex flex-col gap-[10px] h-screen items-start px-0 py-[24px] relative shrink-0 flex-1">
        <div className="basis-0 bg-white grow min-h-px min-w-px rounded-bl-[16px] rounded-tl-[16px] shadow-[-1px_0px_2px_0px_rgba(229,229,229,0.75),0px_0px_0px_1px_#e5e5e5] shrink-0 w-full">
          {/* Main content will be added here */}
        </div>
      </div>
    </div>
  );
}
