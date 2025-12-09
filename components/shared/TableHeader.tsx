'use client';

import React, { useState } from 'react';
import Checkbox from '@/components/shared/Checkbox';

/**
 * TableHeader Component
 * 
 * A table header cell component with two variants:
 * - Default: Shows a text label
 * - Checkbox: Shows a checkbox for selecting all rows
 * 
 * Features:
 * - Hover state support
 * - Accessible keyboard navigation
 * - Customizable styling
 * - Sortable support with direction indicators
 * 
 * @example
 * ```tsx
 * // Default variant
 * <TableHeader text="Name" />
 * 
 * // Checkbox variant
 * <TableHeader type="Checkbox" checked={isAllSelected} onCheckedChange={setIsAllSelected} />
 * 
 * // Sortable header
 * <TableHeader text="Email" sortable={true} sortDirection="asc" onClick={handleSort} />
 * ```
 */

export type TableHeaderType = 'Default' | 'Checkbox';

export interface TableHeaderProps {
  /** The text label to display (only for Default type) */
  text?: string;
  /** The type of table header */
  type?: TableHeaderType;
  /** Additional CSS classes */
  className?: string;
  /** Checkbox checked state (only for Checkbox type) */
  checked?: boolean;
  /** Checkbox change handler (only for Checkbox type) */
  onCheckedChange?: (checked: boolean) => void;
  /** Click handler for the header (e.g., for sorting) */
  onClick?: () => void;
  /** Whether the header is sortable */
  sortable?: boolean;
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc' | null;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  text = 'Label',
  type = 'Default',
  className = '',
  checked = false,
  onCheckedChange,
  onClick,
  sortable = false,
  sortDirection = null,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (type === 'Checkbox') {
    return (
      <div
        className={`content-stretch flex items-center justify-center px-[8px] py-[10px] relative size-[40px] ${className}`}
        data-name="Type=Checkbox"
        data-node-id="549:1033"
      >
        <Checkbox 
          checked={checked}
          onChange={onCheckedChange}
          aria-label="Select all rows"
        />
      </div>
    );
  }

  return (
    <div
      className={`content-stretch flex gap-[6px] h-[40px] items-center px-[8px] py-[10px] relative w-auto ${
        sortable || onClick ? 'cursor-pointer hover:bg-neutral-50' : ''
      } ${className}`}
      data-name="Type=Default"
      data-node-id="549:1030"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={sortable ? 'button' : undefined}
      aria-label={sortable ? `Sort by ${text}` : undefined}
      tabIndex={sortable || onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((sortable || onClick) && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <p
        className="font-['Mona_Sans',sans-serif] font-medium leading-[18px] relative shrink-0 text-neutral-600 text-[14px] text-nowrap whitespace-pre"
        data-node-id="549:1031"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {text}
      </p>
      {sortable && sortDirection && (
        <div className="ml-1 text-neutral-600">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </div>
      )}
    </div>
  );
};

export default TableHeader;

