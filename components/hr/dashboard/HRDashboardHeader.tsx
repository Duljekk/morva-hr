'use client';

import { useMemo } from 'react';

/**
 * HR Dashboard Header Component
 * 
 * Displays the dashboard header with:
 * - Logo (48px circle placeholder)
 * - Current date in format "Monday, 1 December 2025"
 * 
 * Figma specs (node 428:2647 "Header"):
 * - Container: flex column, centered items, gap-14px
 * - Logo: 48x48 circle
 * - Date text: Display xs/Semibold, 24px, line-height 28px, neutral-700
 * 
 * Logo format decision:
 * - The logotype.svg is complex (gradients, filters) so it should remain as SVG
 * - For the 48px circle logo, we'll use a placeholder div for now
 * - When the actual logo is available, it can be imported as SVG or Image component
 */
export default function HRDashboardHeader() {
  const formattedDate = useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }, []);

  return (
    <div 
      className="content-stretch flex flex-col gap-[14px] items-center relative size-full"
      data-name="Header"
      data-node-id="428:2647"
    >
      {/* Logo - 48px circle placeholder */}
      <div 
        className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
        data-name="Logo"
        data-node-id="428:2648"
      >
        <div className="relative shrink-0 size-[48px] rounded-full bg-neutral-200 flex items-center justify-center">
          {/* Placeholder - will be replaced with actual logo */}
          <span className="text-neutral-400 text-xs font-semibold">M</span>
        </div>
      </div>

      {/* Date Text */}
      <p 
        className="font-semibold leading-[28px] relative shrink-0 text-neutral-700 text-[24px] text-center text-nowrap whitespace-pre"
        data-node-id="428:2660"
      >
        {formattedDate}
      </p>
    </div>
  );
}



