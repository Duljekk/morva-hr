'use client';

import { memo, type ReactNode } from 'react';

/**
 * UnifiedBadge Color Variants
 * 
 * - neutral: Gray/neutral status (default)
 * - success: Green positive status
 * - warning: Amber/yellow caution status
 * - danger: Red error/negative status
 * - sky: Blue informational (e.g., Full-time role)
 * - cyan: Teal/cyan informational (e.g., Intern role)
 */
export type UnifiedBadgeColor = 'neutral' | 'success' | 'warning' | 'danger' | 'sky' | 'cyan';

/**
 * UnifiedBadge Size Variants
 * 
 * - sm: 20px height (compact)
 * - md: 22px height (standard)
 */
export type UnifiedBadgeSize = 'sm' | 'md';

/**
 * UnifiedBadge Font Weight Variants
 * 
 * - semibold: 600 weight (default)
 * - medium: 500 weight
 */
export type UnifiedBadgeFont = 'semibold' | 'medium';

/**
 * UnifiedBadge Padding Variants
 * 
 * - normal: 8px horizontal padding (default)
 * - compact: 6px horizontal padding
 */
export type UnifiedBadgePadding = 'normal' | 'compact';

export interface UnifiedBadgeProps {
    /**
     * Custom icon to display before the text
     */
    icon?: ReactNode | null;

    /**
     * Badge label text
     */
    text: string;

    /**
     * Color variant
     * @default "neutral"
     */
    color?: UnifiedBadgeColor;

    /**
     * Whether to show the icon
     * @default false
     */
    hasIcon?: boolean;

    /**
     * Font weight variant
     * @default "semibold"
     */
    font?: UnifiedBadgeFont;

    /**
     * Size variant
     * @default "md"
     */
    size?: UnifiedBadgeSize;

    /**
     * Additional CSS classes
     */
    className?: string;

    /**
     * Horizontal padding variant
     * @default "normal"
     */
    padding?: UnifiedBadgePadding;
}

// Color configuration matching Figma design exactly
const colorConfig: Record<UnifiedBadgeColor, { bg: string; text: string }> = {
    neutral: {
        bg: 'bg-[#f5f5f5]',      // neutral-100
        text: 'text-[#525252]',  // neutral-600
    },
    success: {
        bg: 'bg-[#f0fdf4]',      // green-50
        text: 'text-[#00a63e]',  // green-600
    },
    warning: {
        bg: 'bg-[#fffbeb]',      // amber-50
        text: 'text-[#e17100]',  // amber-600
    },
    danger: {
        bg: 'bg-[#fef2f2]',      // red-50
        text: 'text-[#e7000b]',  // red-600
    },
    sky: {
        bg: 'bg-[#dff2fe]',      // sky-100
        text: 'text-[#00598a]',  // sky-800
    },
    cyan: {
        bg: 'bg-[#cefafe]',      // cyan-100
        text: 'text-[#005f78]',  // cyan-800
    },
};

// Size configuration matching Figma design
const sizeConfig: Record<UnifiedBadgeSize, { height: string }> = {
    sm: { height: 'h-[20px]' },
    md: { height: 'h-[22px]' },
};

// Font configuration
const fontConfig: Record<UnifiedBadgeFont, string> = {
    semibold: 'font-semibold',
    medium: 'font-medium',
};

/**
 * UnifiedBadge Component
 * 
 * A unified badge component that consolidates multiple badge patterns
 * into a single, flexible component matching Figma design node 710-1423.
 * 
 * Features:
 * - 6 color variants (neutral, success, warning, danger, sky, cyan)
 * - 2 size variants (sm: 20px, md: 22px)
 * - 2 font weight variants (semibold, medium)
 * - Optional icon support with proper spacing
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <UnifiedBadge text="On Time" color="success" />
 * 
 * // With icon
 * <UnifiedBadge 
 *   text="On Time" 
 *   color="success" 
 *   hasIcon 
 *   icon={<CircleCheckIcon size={12} />} 
 * />
 * 
 * // Different size and font
 * <UnifiedBadge text="Intern" color="cyan" size="md" font="medium" />
 * ```
 */
const UnifiedBadge = memo(function UnifiedBadge({
    icon = null,
    text,
    color = 'neutral',
    hasIcon = false,
    font = 'semibold',
    size = 'md',
    className = '',
    padding = 'normal',
}: UnifiedBadgeProps) {
    const colors = colorConfig[color];
    const sizeStyle = sizeConfig[size];
    const fontStyle = fontConfig[font];

    // Padding differs based on whether icon is shown and padding prop
    // With icon: pl-[6px] pr-[4px] py-0
    // Without icon: px based on padding prop
    const getPaddingClass = () => {
        if (hasIcon && icon) {
            return 'pl-[6px] pr-[4px] py-0';
        }
        return padding === 'compact' ? 'px-[6px] py-0' : 'px-[8px] py-0';
    };
    const paddingClass = getPaddingClass();

    return (
        <div
            className={`
        ${colors.bg}
        ${sizeStyle.height}
        ${paddingClass}
        flex items-center justify-center
        rounded-[32px]
        ${className}
      `.trim().replace(/\s+/g, ' ')}
            data-name={`UnifiedBadge-${color}`}
        >
            {/* Icon Container */}
            {hasIcon && icon && (
                <div
                    className="overflow-clip relative shrink-0 size-[12px] flex items-center justify-center"
                    data-name="Icon Container"
                >
                    {icon}
                </div>
            )}

            {/* Text Container */}
            <div
                className="flex items-center justify-center px-[2px] py-0 shrink-0"
                data-name="Text Container"
            >
                <p
                    className={`
            font-sans
            ${fontStyle}
            leading-[16px]
            ${colors.text}
            text-[12px]
            text-center
            text-nowrap
            whitespace-pre
          `.trim().replace(/\s+/g, ' ')}
                    style={{ fontVariationSettings: "'wdth' 100" }}
                >
                    {text}
                </p>
            </div>
        </div>
    );
});

UnifiedBadge.displayName = 'UnifiedBadge';

export default UnifiedBadge;
