'use client';

import type { CSSProperties, ComponentType, SVGProps } from 'react';

// Leave illustrations – using inline TSX components for better tree-shaking
// and reduced build complexity (no SVG loader configuration needed).
import AnnualLeaveIllustration from '@/components/icons/AnnualLeaveIllustration';
import SickLeaveIllustration from '@/components/icons/SickLeaveIllustration';
import UnpaidLeaveIllustration from '@/components/icons/UnpaidLeaveIllustration';

/**
 * Leave type variants
 */
export type LeaveVariant = 'annual' | 'sick' | 'unpaid';

/**
 * Size variants based on Figma design (node 462:713)
 * - 40: 40×40px container with 36×36px inner illustration
 * - 36: 36×36px container with ~28×28px inner illustration
 */
export type LeaveSize = 40 | 36;

export interface LeaveIllustrationProps {
  /**
   * Which leave illustration to show.
   * Determines both the default illustration and background color.
   * @default "annual"
   */
  variant?: LeaveVariant;

  /**
   * Size variant - determines container and inner illustration size.
   * - 40: 40×40px container, 36×36px illustration (default)
   * - 36: 36×36px container, ~28×28px illustration
   * @default 40
   */
  size?: LeaveSize;

  /**
   * Custom illustration component - overrides the default based on variant.
   * Use this to swap the inner illustration while keeping the container styling.
   */
  illustration?: ComponentType<SVGProps<SVGSVGElement>>;

  /**
   * Additional Tailwind / CSS classes for the outer container.
   */
  className?: string;
}

/**
 * Icon map: maps variant to default illustration component
 */
const LEAVE_ICON_MAP: Record<LeaveVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  annual: AnnualLeaveIllustration,
  sick: SickLeaveIllustration,
  unpaid: UnpaidLeaveIllustration,
};

/**
 * Size configuration based on Figma design
 * - Container: outer wrapper size
 * - Illustration: inner SVG size
 */
const SIZE_CONFIG: Record<LeaveSize, { container: number; illustration: number }> = {
  40: { container: 40, illustration: 36 },
  36: { container: 36, illustration: 32 }, // User-requested: 32px instead of Figma's ~28.444px
};

/**
 * Background color map based on variant
 */
const BACKGROUND_COLOR_MAP: Record<LeaveVariant, string> = {
  annual: 'bg-[#dff2fe]',   // sky-100 from Figma
  sick: 'bg-[#d0fae5]',     // emerald-100 from Figma
  unpaid: 'bg-[#fef3c6]',   // amber-100 from Figma
};

/**
 * LeaveIllustration Component
 *
 * Renders one of the leave SVG illustrations inside a styled container.
 * Supports two size variants and swappable illustrations.
 *
 * Figma references:
 * - Leave Illustration (node 462:713)
 * - Size=40px (node 462:714): 40×40px container, 36×36px illustration
 * - Size=36px (node 700:1495): 36×36px container, ~28×28px illustration
 *
 * Background colors:
 * - Annual Leave: sky-100 (#dff2fe)
 * - Sick Leave: emerald-100 (#d0fae5)
 * - Unpaid Leave: amber-100 (#fef3c6)
 *
 * Best practices:
 * - Use inline TSX components for illustrations (better tree-shaking)
 * - Control layout + sizing with CSS
 * - Use `illustration` prop to swap icons while keeping container styling
 *
 * @example
 * // Default annual leave, 40px size
 * <LeaveIllustration />
 *
 * @example
 * // Sick leave, 36px size
 * <LeaveIllustration variant="sick" size={36} />
 *
 * @example
 * // Custom illustration
 * <LeaveIllustration variant="annual" illustration={CustomIcon} />
 */
export default function LeaveIllustration({
  variant = 'annual',
  size = 40,
  illustration,
  className = '',
}: LeaveIllustrationProps) {
  // Get config for the requested size
  const sizeConfig = SIZE_CONFIG[size];

  // Use custom illustration if provided, otherwise use default for variant
  const IllustrationIcon = illustration ?? LEAVE_ICON_MAP[variant] ?? AnnualLeaveIllustration;

  // Get background color for variant
  const backgroundColor = BACKGROUND_COLOR_MAP[variant];

  // Container size style
  const containerStyle: CSSProperties = {
    width: `${sizeConfig.container}px`,
    height: `${sizeConfig.container}px`,
  };

  // Illustration size style
  const illustrationStyle: CSSProperties = {
    width: `${sizeConfig.illustration}px`,
    height: `${sizeConfig.illustration}px`,
  };

  return (
    <div
      className={`${backgroundColor} flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 ${className}`}
      style={containerStyle}
      aria-hidden="true"
      data-name={`Size=${size}px`}
      data-node-id={size === 40 ? '462:714' : '700:1495'}
    >
      {/* Inner illustration - sized based on variant */}
      <div className="relative shrink-0" style={illustrationStyle}>
        <IllustrationIcon className="h-full w-full" />
      </div>
    </div>
  );
}
