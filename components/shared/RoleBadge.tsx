'use client';

import { memo } from 'react';

/**
 * Role Badge Variants
 * 
 * Currently supports:
 * - Intern: Light cyan background with dark cyan text
 * - Full-time: Light sky background with dark sky text
 * 
 * Can be extended with additional role types in the future.
 */
export type RoleBadgeVariant = 'Intern' | 'Full-time';

export interface RoleBadgeProps {
  /**
   * The role variant to display
   * @default "Intern"
   */
  role?: RoleBadgeVariant;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for accessibility
   * If not provided, will use the role text
   */
  'aria-label'?: string;
}

/**
 * Role Badge Component
 *
 * A badge component specifically designed for displaying employee roles.
 * Currently supports two variants: Intern and Full-time.
 *
 * Figma specs:
 * - Intern (node 556:1035):
 *   - Background: bg-[#cefafe] (cyan-100)
 *   - Text: text-[#005f78] (cyan-800)
 *   - Height: 22px
 *   - Padding: px-[8px], pb-[2px], pt-0
 *   - Border radius: rounded-[32px]
 *   - Width: auto (content-based)
 *
 * - Full-time (node 556:1038):
 *   - Background: bg-[#dff2fe] (sky-100)
 *   - Text: text-[#00598a] (sky-800)
 *   - Height: 22px
 *   - Padding: px-[8px], pb-[2px], pt-0
 *   - Border radius: rounded-[32px]
 *   - Width: w-[67px] (fixed)
 *
 * Typography:
 * - Font: Mona Sans Medium
 * - Size: 12px (text-xs)
 * - Line height: 16px
 * - Weight: 500 (medium)
 *
 * Features:
 * - Two variants (Intern, Full-time)
 * - Extensible for future role types
 * - Accessible with proper ARIA attributes
 * - Consistent styling with design system
 *
 * @example
 * ```tsx
 * // Intern badge (default)
 * <RoleBadge />
 * 
 * // Full-time badge
 * <RoleBadge role="Full-time" />
 * 
 * // With custom aria-label
 * <RoleBadge role="Intern" aria-label="Employee role: Intern" />
 * ```
 */
const RoleBadge = memo(function RoleBadge({
  role = 'Intern',
  className = '',
  'aria-label': ariaLabel,
}: RoleBadgeProps) {
  // Variant configuration matching Figma exactly
  const variantConfig = {
    Intern: {
      containerClassName: `bg-[#cefafe] content-stretch flex h-[22px] items-center justify-center px-[8px] relative rounded-[32px] ${className}`,
      dataName: 'Role=Intern',
      containerNodeId: '556:1035',
      textContainerNodeId: '556:1036',
      textNodeId: '556:1037',
      textClassName: "font-sans font-medium leading-[16px] relative shrink-0 text-[#005f78] text-[12px] text-center text-nowrap whitespace-pre",
    },
    'Full-time': {
      containerClassName: `bg-[#dff2fe] content-stretch flex h-[22px] items-center justify-center px-[8px] relative rounded-[32px] w-[67px] ${className}`,
      dataName: 'Role=Full-time',
      containerNodeId: '556:1038',
      textContainerNodeId: '556:1039',
      textNodeId: '556:1040',
      textClassName: "font-sans font-medium leading-[16px] relative shrink-0 text-[#00598a] text-[12px] text-center text-nowrap whitespace-pre",
    },
  };

  const config = variantConfig[role];

  return (
    <div
      className={config.containerClassName}
      data-name={config.dataName}
      data-node-id={config.containerNodeId}
      role="status"
      aria-label={ariaLabel || `Role: ${role}`}
    >
      <div
        className="content-stretch flex items-center justify-center relative shrink-0"
        data-name="Text Container"
        data-node-id={config.textContainerNodeId}
      >
        <p
          className={config.textClassName}
          data-node-id={config.textNodeId}
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {role}
        </p>
      </div>
    </div>
  );
});

RoleBadge.displayName = 'RoleBadge';

export default RoleBadge;

