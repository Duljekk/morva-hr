'use client';

import { memo } from 'react';
import RoleBadge, { RoleBadgeVariant } from '@/components/shared/RoleBadge';

export interface EmployeesGroupingRowProps {
  /**
   * The role variant for this grouping
   * @default "Intern"
   */
  role?: RoleBadgeVariant;

  /**
   * The number of employees in this group
   */
  count: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employees Grouping Row Component
 *
 * A grouping row for the employee table that displays a role badge
 * and the count of employees in that group.
 *
 * Figma specs (node 557:2348):
 * - Container: bg-[rgba(250,250,250,0.4)], border-b border-neutral-200
 * - Height: 49px total (48px content + 1px border)
 * - Padding: pl-[48px] pr-[10px] py-[10px]
 * - Gap: gap-[8px] between badge and text
 * - Role Badge: Uses RoleBadge component
 * - Text: "X employees" with neutral-600 color, text-xs, Mona Sans Medium
 *
 * Features:
 * - Displays role badge and employee count
 * - Consistent styling with table design
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <EmployeesGroupingRow role="Intern" count={5} />
 * <EmployeesGroupingRow role="Full-time" count={12} />
 * ```
 */
const EmployeesGroupingRow = memo(function EmployeesGroupingRow({
  role = 'Intern',
  count,
  className = '',
}: EmployeesGroupingRowProps) {
  return (
    <div
      className={`
        bg-[rgba(250,250,250,0.4)]
        border-b border-neutral-200 border-solid
        flex gap-[8px] items-center
        pl-[48px] pr-[10px] py-[10px] relative w-full h-[49px]
        ${className}
      `.trim()}
      data-name="Grouping Row"
      data-node-id="557:2348"
      role="row"
      aria-label={`${role} group: ${count} employee${count !== 1 ? 's' : ''}`}
    >
      <RoleBadge
        role={role}
        className="shrink-0"
      />
      <p
        className="font-sans font-medium leading-[16px] relative shrink-0 text-neutral-600 text-[12px] text-nowrap whitespace-pre"
        data-node-id="557:2350"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {count} employee{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
});

EmployeesGroupingRow.displayName = 'EmployeesGroupingRow';

export default EmployeesGroupingRow;

