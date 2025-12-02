'use client';

import type { CSSProperties } from 'react';

// Leave illustrations – complex SVGs kept as assets (with gradients, filters, etc.)
// These are treated similarly to other complex illustrations in the app.
import IlustAnnual from '@/app/assets/icons/ilust-annual.svg';
import IlustUnpaid from '@/app/assets/icons/ilust-unpaid.svg';
import IlustSick from '@/app/assets/icons/ilust-sick.svg';

export type LeaveVariant = 'annual' | 'unpaid' | 'sick';

export interface LeaveIllustrationProps {
  /**
   * Which leave illustration to show.
   * @default "annual"
   */
  variant?: LeaveVariant;

  /**
   * Width/height of the outer container (the rounded square with background).
   * Accepts a number (pixels) or any CSS size string (e.g. "40px", "2.5rem").
   * @default 40 (matches Figma design 40x40px)
   */
  size?: number | string;

  /**
   * Additional Tailwind / CSS classes for the outer container.
   */
  className?: string;
}

const LEAVE_ICON_MAP: Record<LeaveVariant, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  annual: IlustAnnual,
  unpaid: IlustUnpaid,
  sick: IlustSick,
};

/**
 * Get background color based on leave variant
 */
function getBackgroundColor(variant: LeaveVariant): string {
  switch (variant) {
    case 'unpaid':
      return 'bg-[#fef3c6]'; // amber-100 from Figma
    case 'sick':
      return 'bg-[#d0fae5]'; // emerald-100 from Figma
    case 'annual':
    default:
      return 'bg-[#dff2fe]'; // sky-100 from Figma
  }
}

/**
 * LeaveIllustration Component
 *
 * Renders one of the complex leave SVG illustrations (annual, unpaid, sick).
 *
 * Figma references:
 * - Leave Illustration container (node 465:1188): 40x40px, rounded-8px, 2px padding
 * - Background colors:
 *   - Annual Leave: sky-100 (#dff2fe)
 *   - Unpaid Leave: amber-100 (#fef3c6)
 *   - Sick Leave: emerald-100 (#d0fae5)
 * - Inner SVG illustration: 36x36px, centered
 *
 * The leave SVGs in `app/assets/icons` already include the detailed illustration.
 * This wrapper recreates the container using CSS so the same SVGs can be reused
 * in other contexts without being locked into a specific background.
 *
 * Best practices:
 * - Keep complex visual effects (multiple gradients, filters) inside the SVG file.
 * - Control layout + sizing with a lightweight React wrapper.
 * - Use this component inside a higher-level card/container for additional styling,
 *   padding, or hover states instead of baking those into the SVG.
 */
export default function LeaveIllustration({
  variant = 'annual',
  size = 40,
  className = '',
}: LeaveIllustrationProps) {
  const IllustrationIcon = LEAVE_ICON_MAP[variant] ?? IlustAnnual;
  const backgroundColor = getBackgroundColor(variant);

  const sizeStyle: CSSProperties =
    typeof size === 'number'
      ? { width: `${size}px`, height: `${size}px` }
      : { width: size, height: size };

  return (
    <div
      className={`${backgroundColor} box-border content-stretch flex gap-[10px] items-center overflow-clip p-[2px] relative rounded-[8px] ${className}`}
      style={sizeStyle}
      aria-hidden="true"
      data-name="Leave Illustration"
      data-node-id="465:1188"
    >
      {/* Inner illustration 36x36px, centered as in Figma design */}
      <div className="relative shrink-0 size-[36px]">
        <IllustrationIcon className="h-full w-full" />
      </div>
    </div>
  );
}

