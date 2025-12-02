/**
 * Typography Utility Functions
 * 
 * Standard typography rules:
 * - Font sizes 12px-30px: 0 letter spacing (default)
 * - Regular (400): line-height = font-size + 8px
 * - Medium (500), Semibold (600), Bold (700): line-height = font-size + 4px
 */

export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '30';

const fontSizeMap: Record<FontSize, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '30': 30,
};

/**
 * Calculate line height based on font size and weight
 */
export function getLineHeight(size: FontSize, weight: FontWeight): string {
  const fontSize = fontSizeMap[size];
  
  if (weight === 'normal') {
    // Regular (400): font-size + 8px
    return `${fontSize + 8}px`;
  } else {
    // Medium (500), Semibold (600), Bold (700): font-size + 4px
    return `${fontSize + 4}px`;
  }
}

/**
 * Get Tailwind classes for typography
 * Returns text size, font weight, and line height classes
 */
export function getTypographyClasses(
  size: FontSize,
  weight: FontWeight = 'normal'
): string {
  const sizeClass = size === '30' ? 'text-[30px]' : `text-${size}`;
  const weightClass = 
    weight === 'normal' ? 'font-normal' :
    weight === 'medium' ? 'font-medium' :
    weight === 'semibold' ? 'font-semibold' :
    'font-bold';
  
  // Line height class based on weight
  const lineHeightClass = 
    weight === 'normal' 
      ? `leading-regular-${size}`
      : `leading-bold-${size}`;
  
  return `${sizeClass} ${weightClass} ${lineHeightClass}`;
}

/**
 * Typography class mappings for common combinations
 */
export const typography = {
  // Regular (400)
  regular: {
    xs: 'text-xs font-normal leading-regular-xs',
    sm: 'text-sm font-normal leading-regular-sm',
    base: 'text-base font-normal leading-regular-base',
    lg: 'text-lg font-normal leading-regular-lg',
    xl: 'text-xl font-normal leading-regular-xl',
    '2xl': 'text-2xl font-normal leading-regular-2xl',
    '30': 'text-[30px] font-normal leading-regular-30',
  },
  // Medium (500)
  medium: {
    xs: 'text-xs font-medium leading-bold-xs',
    sm: 'text-sm font-medium leading-bold-sm',
    base: 'text-base font-medium leading-bold-base',
    lg: 'text-lg font-medium leading-bold-lg',
    xl: 'text-xl font-medium leading-bold-xl',
    '2xl': 'text-2xl font-medium leading-bold-2xl',
    '30': 'text-[30px] font-medium leading-bold-30',
  },
  // Semibold (600)
  semibold: {
    xs: 'text-xs font-semibold leading-bold-xs',
    sm: 'text-sm font-semibold leading-bold-sm',
    base: 'text-base font-semibold leading-bold-base',
    lg: 'text-lg font-semibold leading-bold-lg',
    xl: 'text-xl font-semibold leading-bold-xl',
    '2xl': 'text-2xl font-semibold leading-bold-2xl',
    '30': 'text-[30px] font-semibold leading-bold-30',
  },
  // Bold (700)
  bold: {
    xs: 'text-xs font-bold leading-bold-xs',
    sm: 'text-sm font-bold leading-bold-sm',
    base: 'text-base font-bold leading-bold-base',
    lg: 'text-lg font-bold leading-bold-lg',
    xl: 'text-xl font-bold leading-bold-xl',
    '2xl': 'text-2xl font-bold leading-bold-2xl',
    '30': 'text-[30px] font-bold leading-bold-30',
  },
};













