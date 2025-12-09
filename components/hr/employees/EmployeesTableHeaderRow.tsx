'use client';

import { memo } from 'react';
import TableHeader from '@/components/shared/TableHeader';

export interface EmployeesTableHeaderRowProps {
  /**
   * Whether all rows are selected
   */
  allSelected?: boolean;

  /**
   * Callback when select all checkbox changes
   */
  onSelectAllChange?: (selected: boolean) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employees Table Header Row Component
 *
 * Header row for the employee table containing:
 * - Checkbox for selecting all rows
 * - Name column
 * - Employment column
 * - Birthdate column
 * - Leave Balance column
 * - Contract Period column
 * - Status column
 * - CTA column (empty in header)
 *
 * Column widths (synchronized with EmployeeTableRow):
 * - Checkbox: 48px (fixed)
 * - Name: flex-1 (grow, min 200px, left-aligned) - LONGEST
 * - Employment: 100px (fixed, left-aligned)
 * - Birthdate: 130px (fixed, left-aligned)
 * - Leave Balance: 200px (fixed, left-aligned) - SECOND LONGEST
 * - Contract Period: 140px (fixed, left-aligned)
 * - Status: 110px (fixed, left-aligned)
 * - CTA: 60px (fixed, empty in header)
 *
 * Features:
 * - Select all checkbox functionality
 * - Consistent column widths matching data rows
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <EmployeesTableHeaderRow
 *   allSelected={isAllSelected}
 *   onSelectAllChange={setIsAllSelected}
 * />
 * ```
 */
const EmployeesTableHeaderRow = memo(function EmployeesTableHeaderRow({
  allSelected = false,
  onSelectAllChange,
  className = '',
}: EmployeesTableHeaderRowProps) {
  return (
    <div
      className={`
        border-t border-b border-neutral-200 border-solid
        content-stretch flex items-center relative w-full h-[48px]
        ${className}
      `.trim()}
      data-name="Table Header Row"
      data-node-id="545:3515"
      role="row"
    >
      {/* Checkbox Column - 48px fixed */}
      <div
        className="flex h-full items-center justify-center shrink-0 w-[48px]"
        role="columnheader"
      >
        <TableHeader
          type="Checkbox"
          checked={allSelected}
          onCheckedChange={onSelectAllChange}
          className="flex items-center justify-center"
        />
      </div>

      {/* Name Column - flex-1 grow, left-aligned (LONGEST) */}
      <div
        className="flex grow h-full items-center px-[8px] min-w-[200px]"
        data-name="Table Header"
        data-node-id="545:3517"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          data-node-id="I545:3517;682:3341"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Name
        </p>
      </div>

      {/* Employment Column - 100px fixed, left-aligned */}
      <div
        className="flex h-full items-center shrink-0 w-[100px] px-[8px]"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Employment
        </p>
      </div>

      {/* Birthdate Column - 130px fixed, left-aligned */}
      <div
        className="flex h-full items-center shrink-0 w-[130px] px-[8px]"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Birthdate
        </p>
      </div>

      {/* Leave Balance Column - 200px fixed, left-aligned (SECOND LONGEST) */}
      <div
        className="flex h-full items-center shrink-0 w-[200px] px-[8px]"
        data-name="Table Header"
        data-node-id="545:3520"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          data-node-id="I545:3520;682:3341"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Leave Balance
        </p>
      </div>

      {/* Contract Period Column - 140px fixed, left-aligned */}
      <div
        className="flex h-full items-center shrink-0 w-[140px] px-[8px]"
        data-name="Table Header"
        data-node-id="545:3521"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          data-node-id="I545:3521;682:3341"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Contract Period
        </p>
      </div>

      {/* Status Column - 110px fixed, left-aligned */}
      <div
        className="flex h-full items-center shrink-0 w-[110px] px-[8px]"
        role="columnheader"
      >
        <p
          className="font-sans font-medium leading-[16px] text-neutral-600 text-xs text-nowrap whitespace-pre"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Status
        </p>
      </div>

      {/* CTA Column - 60px fixed (empty in header for alignment) */}
      <div
        className="flex h-full items-center justify-center shrink-0 w-[60px]"
        role="columnheader"
        aria-label="Actions"
      />
    </div>
  );
});

EmployeesTableHeaderRow.displayName = 'EmployeesTableHeaderRow';

export default EmployeesTableHeaderRow;

