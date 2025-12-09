'use client';

import { memo } from 'react';

export type BarVariant = 'High' | 'Medium' | 'Low' | 'Empty';

export interface BarProps {
  /**
   * Color variant of the bar
   * @default "High"
   */
  color?: BarVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

/**
 * Variant styles configuration
 * Based on Figma design specifications
 */
const variantStyles: Record<BarVariant, { bg: string; border: string }> = {
  High: {
    bg: 'bg-[#00bc7d]', // emerald-500 fill
    border: 'border border-[rgba(0,153,102,0.5)]',
  },
  Medium: {
    bg: 'bg-[#fe9a00]', // amber-500 fill
    border: 'border border-[rgba(225,113,0,0.5)]',
  },
  Low: {
    bg: 'bg-[#fb2c36]', // red-500 fill
    border: 'border border-[rgba(231,0,11,0.5)]',
  },
  Empty: {
    bg: '', // No fill for empty variant
    border: 'border border-[#e5e5e5]', // neutral-200 border only
  },
};

/**
 * Get node ID based on variant
 * Matches Figma node IDs for each variant
 */
const getNodeId = (variant: BarVariant): string => {
  const nodeIdMap: Record<BarVariant, string> = {
    High: '562:3298',
    Medium: '562:3299',
    Low: '562:3300',
    Empty: '562:3301',
  };
  return nodeIdMap[variant];
};

/**
 * Bar Component
 *
 * A simple vertical bar component with 4 color variants representing different states.
 * Used for visual indicators, progress displays, or status representations.
 *
 * Figma specs:
 * - Height: 16px
 * - Width: 6px
 * - Border radius: 4px (rounded-[4px])
 * - Overflow: clip
 *
 * Variants:
 * - High: Green/emerald bar (#00bc7d) with semi-transparent green border
 * - Medium: Orange/amber bar (#fe9a00) with semi-transparent orange border
 * - Low: Red bar (#fb2c36) with semi-transparent red border
 * - Empty: No fill, only neutral border (#e5e5e5)
 *
 * Features:
 * - 4 color variants (High, Medium, Low, Empty)
 * - Pixel-accurate dimensions matching Figma
 * - Accessible with proper ARIA attributes
 * - Memoized for performance optimization
 *
 * @example
 * ```tsx
 * // High variant (default)
 * <Bar color="High" />
 *
 * // Medium variant
 * <Bar color="Medium" />
 *
 * // Low variant
 * <Bar color="Low" />
 *
 * // Empty variant
 * <Bar color="Empty" />
 * ```
 */
const Bar = memo(function Bar({
  color = 'High',
  className = '',
  'aria-label': ariaLabel,
}: BarProps) {
  const variant = color;
  const styles = variantStyles[variant];
  const nodeId = getNodeId(variant);

  return (
    <div
      className={`
        h-[16px]
        w-[6px]
        overflow-clip
        rounded-[4px]
        ${styles.bg}
        ${styles.border}
        border-solid
        ${className}
      `.trim()}
      data-name={`Color=${variant}`}
      data-node-id={nodeId}
      role="img"
      aria-label={ariaLabel || `Bar indicator: ${variant}`}
    />
  );
});

Bar.displayName = 'Bar';

export default Bar;

