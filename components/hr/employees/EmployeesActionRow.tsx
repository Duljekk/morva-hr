'use client';

import { memo } from 'react';
import ToggleView, { ViewType } from '@/components/shared/ToggleView';
import Dropdown from '@/components/shared/Dropdown';
import SearchBar from '@/components/shared/SearchBar';
import { ArrowUpDownIcon, FilterIcon } from '@/components/icons';

export interface EmployeesActionRowProps {
  /**
   * Current search value
   */
  searchValue?: string;

  /**
   * Callback when search value changes
   */
  onSearchChange?: (value: string) => void;

  /**
   * Current view type (grid or list)
   */
  viewType?: ViewType;

  /**
   * Callback when view type changes
   */
  onViewTypeChange?: (viewType: ViewType) => void;

  /**
   * Current sort value
   */
  sortValue?: string;

  /**
   * Sort options
   */
  sortOptions?: Array<{ value: string; label: string; disabled?: boolean }>;

  /**
   * Callback when sort value changes
   */
  onSortChange?: (value: string) => void;

  /**
   * Current filter value
   */
  filterValue?: string;

  /**
   * Filter options
   */
  filterOptions?: Array<{ value: string; label: string; disabled?: boolean }>;

  /**
   * Callback when filter value changes
   */
  onFilterChange?: (value: string) => void;

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employees Action Row Component
 *
 * Action row for the employees page containing:
 * - Search bar (left)
 * - Toggle view, Sort dropdown, Filter dropdown (right)
 *
 * Figma specs (node 545:3495-545:3512):
 * - Container: pb-[18px] pt-[16px] px-[16px], flex items-center justify-between
 * - Search bar: w-[250px], h-[36px], bg-[rgba(161,161,161,0.05)], rounded-[10px]
 * - Toggle group: w-[68px], h-[36px]
 * - Dropdowns: h-[36px], Sort w-[87px], Filter auto width
 * - Gap between right controls: gap-[10px]
 *
 * Features:
 * - Search functionality
 * - View toggle (grid/list)
 * - Sort and filter dropdowns
 * - Accessible with proper ARIA attributes
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <EmployeesActionRow
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   viewType={viewType}
 *   onViewTypeChange={setViewType}
 *   sortValue={sort}
 *   onSortChange={setSort}
 *   filterValue={filter}
 *   onFilterChange={setFilter}
 * />
 * ```
 */
const EmployeesActionRow = memo(function EmployeesActionRow({
  searchValue,
  onSearchChange,
  viewType,
  onViewTypeChange,
  sortValue,
  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-asc', label: 'Date (Oldest)' },
    { value: 'date-desc', label: 'Date (Newest)' },
  ],
  onSortChange,
  filterValue,
  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
  onFilterChange,
  disabled = false,
  className = '',
}: EmployeesActionRowProps) {
  return (
    <div
      className={`
        content-stretch flex flex-col items-start
        pb-[18px] pt-[16px] px-[16px] relative size-full
        ${className}
      `.trim()}
      data-name="Action Row Container"
      data-node-id="545:3495"
    >
      <div
        className="content-stretch flex items-center justify-between relative shrink-0 w-full"
        data-name="Action Row"
        data-node-id="545:3496"
      >
        {/* Search Bar */}
        <SearchBar
          placeholder="Search Employee"
          value={searchValue}
          onSearch={onSearchChange}
          disabled={disabled}
          width={250}
          borderRadius={10}
          showCommandIcon={false}
          enableKeyboardShortcut={false}
        />

        {/* Dropdowns + Toggle */}
        <div
          className="content-stretch flex gap-[10px] items-center relative shrink-0"
          data-name="Dropdowns + Toggle"
          data-node-id="545:3506"
        >
          {/* Toggle Group */}
          <ToggleView
            value={viewType}
            onChange={onViewTypeChange}
            disabled={disabled}
            aria-label="Toggle view type"
          />

          {/* Sort Dropdown */}
          <Dropdown
            text="Sort"
            icon={<ArrowUpDownIcon className="w-4 h-4 text-neutral-500" />}
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
            disabled={disabled}
            aria-label="Sort options"
          />

          {/* Filter Dropdown */}
          <Dropdown
            text="Filter"
            icon={<FilterIcon className="w-4 h-4 text-neutral-500" />}
            options={filterOptions}
            value={filterValue}
            onChange={onFilterChange}
            disabled={disabled}
            aria-label="Filter options"
          />
        </div>
      </div>
    </div>
  );
});

EmployeesActionRow.displayName = 'EmployeesActionRow';

export default EmployeesActionRow;

