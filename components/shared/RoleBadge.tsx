'use client';

import { memo } from 'react';
import UnifiedBadge, { type UnifiedBadgeColor } from '@/components/shared/UnifiedBadge';

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

// Map roles to UnifiedBadge colors
const roleConfig: Record<RoleBadgeVariant, UnifiedBadgeColor> = {
  Intern: 'cyan',
  'Full-time': 'sky',
};

/**
 * Role Badge Component
 *
 * A badge component specifically designed for displaying employee roles.
 * Currently supports two variants: Intern and Full-time.
 *
 * Now uses UnifiedBadge internally for consistent styling.
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
  const color = roleConfig[role];

  return (
    <div
      role="status"
      aria-label={ariaLabel || `Role: ${role}`}
    >
      <UnifiedBadge
        text={role}
        color={color}
        size="md"
        font="medium"
        className={className}
      />
    </div>
  );
});

RoleBadge.displayName = 'RoleBadge';

export default RoleBadge;

