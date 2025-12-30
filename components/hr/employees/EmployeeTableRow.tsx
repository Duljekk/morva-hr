'use client';

import { memo, useState } from 'react';
import Checkbox from '@/components/shared/Checkbox';
import Avatar from '@/components/shared/Avatar';
import RoleBadge, { RoleBadgeVariant } from '@/components/shared/RoleBadge';
import LeaveBalanceIndicator from '@/components/shared/LeaveBalanceIndicator';
import LeaveBalanceBadge from '@/components/shared/LeaveBalanceBadge';
import DropdownActionMenu from '@/components/shared/DropdownActionMenu';
import { DotGrid1x3HorizontalIcon } from '@/components/shared/Icons';

export interface Employee {
  /**
   * Unique identifier for the employee
   */
  id: string;

  /**
   * Full name of the employee
   */
  name: string;

  /**
   * Email address of the employee
   */
  email: string;

  /**
   * Profile image URL
   */
  imageUrl?: string | null;

  /**
   * Employee role (Intern or Full-time)
   */
  role: RoleBadgeVariant;

  /**
   * Birth date (formatted string)
   */
  birthDate: string;

  /**
   * Leave balance (current / total)
   */
  leaveBalance: {
    current: number;
    total: number;
  };

  /**
   * Contract period (formatted string)
   */
  contractPeriod: string;

  /**
   * Current status
   */
  status: {
    label: string;
    isActive: boolean;
  };
}

export interface EmployeeTableRowProps {
  /**
   * Employee data
   */
  employee: Employee;

  /**
   * Whether this row is selected
   * @default false
   */
  isSelected?: boolean;

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (id: string, selected: boolean) => void;

  /**
   * Callback when row action is clicked (3-dot menu)
   * @deprecated Use onEdit and onDelete instead
   */
  onActionClick?: (id: string) => void;

  /**
   * Callback when Edit action is clicked
   */
  onEdit?: (id: string) => void;

  /**
   * Callback when Delete action is clicked
   */
  onDelete?: (id: string) => void;

  /**
   * Callback when row is clicked
   */
  onRowClick?: (id: string) => void;

  /**
   * Callback when employee name is clicked
   */
  onNameClick?: (id: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Status Indicator Component
 * Shows a colored dot and status text
 */
const StatusIndicator = memo(function StatusIndicator({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  return (
    <div
      className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0"
      data-name="Status"
      data-node-id="557:2363"
    >
      <div
        className={`relative shrink-0 size-[6px] rounded-full ${isActive ? 'bg-[#00a63e]' : 'bg-neutral-400'}`}
        data-name="Indicator"
        data-node-id="557:2364"
        aria-hidden="true"
      />
      <p
        className="font-sans font-medium leading-[16px] relative shrink-0 text-[#404040] text-[12px] text-nowrap whitespace-pre"
        data-node-id="557:2365"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        {label}
      </p>
    </div>
  );
});

/**
 * Ghost Button Component
 * Small button with 3-dot menu icon
 *
 * Figma specs (node 564:3382):
 * - Default state: No background, rounded-[8px], size-[28px]
 * - Hover state: bg-[#f5f5f5] (neutral-100), rounded-[8px], size-[28px]
 * - Icon: 16x16px, centered with absolute positioning, color #404040
 */
const GhostButton = memo(function GhostButton({
  onClick,
  'aria-label': ariaLabel,
}: {
  onClick?: () => void;
  'aria-label'?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative rounded-[8px] shrink-0 size-[28px]
        transition-colors duration-150
        ${isHovered ? 'bg-[#f5f5f5]' : ''}
        focus:outline-none focus:ring-2 focus:ring-neutral-300
      `.trim()}
      data-name={`State=${isHovered ? 'Hover' : 'Default'}`}
      data-node-id={isHovered ? '564:3385' : '564:3383'}
      aria-label={ariaLabel || 'More actions'}
    >
      <div
        className="absolute left-1/2 overflow-clip size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
        data-name="Icon"
      >
        <DotGrid1x3HorizontalIcon className="text-[#404040]" />
      </div>
    </button>
  );
});

/**
 * Employee Table Row Component
 *
 * A table row component for displaying employee information in the HR employees table.
 * Uses existing shared components: Checkbox, Avatar, RoleBadge, Bar.
 *
 * Column widths (synchronized with EmployeesTableHeaderRow):
 * - Checkbox: 48px (fixed, centered)
 * - Name: flex-1 (grow, min 200px, left-aligned) - Avatar + Name/Email stack (LONGEST)
 * - Employment: 100px (fixed, left-aligned) - RoleBadge
 * - Birthdate: 130px (fixed, left-aligned)
 * - Leave Balance: 200px (fixed, left-aligned) - Bars + Badge (SECOND LONGEST)
 * - Contract Period: 140px (fixed, left-aligned)
 * - Status: 110px (fixed, left-aligned) - Indicator dot + text
 * - CTA: 60px (fixed, centered) - Ghost button with 3-dot icon
 *
 * Features:
 * - Row selection with checkbox
 * - Profile display with avatar, name, and email
 * - Role badge display
 * - Leave balance visualization with bars
 * - Status indicator with colored dot
 * - Action menu button
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <EmployeeTableRow
 *   employee={{
 *     id: '1',
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     imageUrl: '/avatar.jpg',
 *     role: 'Intern',
 *     birthDate: '10 December 2001',
 *     leaveBalance: { current: 8, total: 10 },
 *     contractPeriod: '8 Sep - 8 Dec 2025',
 *     status: { label: 'Checked in', isActive: true },
 *   }}
 *   isSelected={false}
 *   onSelectionChange={(id, selected) => console.log(id, selected)}
 *   onActionClick={(id) => console.log('Action:', id)}
 * />
 * ```
 */
const EmployeeTableRow = memo(function EmployeeTableRow({
  employee,
  isSelected = false,
  onSelectionChange,
  onActionClick,
  onEdit,
  onDelete,
  onRowClick,
  onNameClick,
  className = '',
}: EmployeeTableRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange?.(employee.id, checked);
  };

  const handleActionClick = () => {
    // Toggle menu open state
    setIsMenuOpen((prev) => !prev);
    // Also call legacy callback if provided
    onActionClick?.(employee.id);
  };

  const handleEdit = () => {
    onEdit?.(employee.id);
  };

  const handleDelete = () => {
    onDelete?.(employee.id);
  };

  const handleRowClick = () => {
    onRowClick?.(employee.id);
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNameClick?.(employee.id);
  };

  return (
    <div
      className={`
        border-b border-neutral-200 border-solid
        flex items-center relative w-full
        ${onRowClick ? 'cursor-pointer hover:bg-neutral-50 transition-colors duration-150' : ''}
        ${className}
      `.trim()}
      data-name="Row"
      data-node-id="557:2351"
      role="row"
      aria-selected={isSelected}
      onClick={onRowClick ? handleRowClick : undefined}
    >
      {/* Checkbox Column - 48px fixed, centered */}
      <div
        className="flex items-center justify-center self-stretch shrink-0 w-[48px]"
        role="cell"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${employee.name}`}
        />
      </div>

      {/* Name Column - flex-1 grow, left-aligned (LONGEST) */}
      <div
        className="flex grow items-center self-stretch min-w-[200px] py-[16px] px-[8px]"
        role="cell"
        data-name="Profile + Email"
        data-node-id="557:2353"
      >
        <div
          className="flex gap-[16px] items-center w-full"
          data-name="Container"
          data-node-id="557:2354"
        >
          <Avatar
            name={employee.name}
            imageUrl={employee.imageUrl}
            size="md"
            shape="circle"
            alt={`${employee.name}'s profile picture`}
          />
          <div
            className="flex flex-col gap-[2px] items-start flex-1 min-w-0"
            data-name="Contents"
            data-node-id="557:2357"
          >
            <p
              className={`font-sans font-medium leading-[18px] text-[#262626] text-[14px] w-full overflow-hidden text-ellipsis whitespace-nowrap ${onNameClick ? 'cursor-pointer hover:underline' : ''}`}
              data-node-id="557:2358"
              style={{ fontVariationSettings: "'wdth' 100" }}
              title={employee.name}
              onClick={onNameClick ? handleNameClick : undefined}
            >
              {employee.name}
            </p>
            <p
              className="font-sans font-medium leading-[16px] text-[#737373] text-[12px] w-full overflow-hidden text-ellipsis whitespace-nowrap"
              data-node-id="557:2359"
              style={{ fontVariationSettings: "'wdth' 100" }}
              title={employee.email}
            >
              {employee.email}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Column - 100px fixed, left-aligned */}
      <div
        className="flex items-center self-stretch shrink-0 w-[100px] px-[8px]"
        role="cell"
        data-name="Badge"
        data-node-id="557:3085"
      >
        <RoleBadge role={employee.role} />
      </div>

      {/* Birthdate Column - 130px fixed, left-aligned */}
      <div
        className="flex items-center self-stretch shrink-0 w-[130px] px-[8px]"
        role="cell"
        data-name="Birthdate"
        data-node-id="557:3086"
      >
        <p
          className="font-sans font-medium leading-[16px] text-[#737373] text-[12px]"
          data-node-id="557:2360"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {employee.birthDate}
        </p>
      </div>

      {/* Leave Balance Column - 200px fixed, left-aligned (SECOND LONGEST) */}
      <div
        className="flex items-center self-stretch shrink-0 w-[200px] gap-[8px] px-[8px]"
        role="cell"
        data-name="Leave Balance"
        data-node-id="557:2366"
      >
        <LeaveBalanceIndicator
          current={employee.leaveBalance.current}
          total={employee.leaveBalance.total}
        />
        <LeaveBalanceBadge
          current={employee.leaveBalance.current}
          total={employee.leaveBalance.total}
        />
      </div>

      {/* Contract Period Column - 140px fixed, left-aligned */}
      <div
        className="flex items-center self-stretch shrink-0 w-[140px] px-[8px]"
        role="cell"
        data-name="Contract Period"
        data-node-id="557:3087"
      >
        <p
          className="font-sans font-medium leading-[16px] text-[#737373] text-[12px]"
          data-node-id="557:2362"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          {employee.contractPeriod}
        </p>
      </div>

      {/* Status Column - 110px fixed, left-aligned */}
      <div
        className="flex items-center self-stretch shrink-0 w-[110px] px-[8px]"
        role="cell"
        data-name="Status"
      >
        <StatusIndicator
          label={employee.status.label}
          isActive={employee.status.isActive}
        />
      </div>

      {/* CTA Column - 60px fixed, centered */}
      <div
        className="flex items-center justify-center self-stretch shrink-0 w-[60px]"
        role="cell"
        data-name="CTA"
        data-node-id="557:3088"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <GhostButton
            onClick={handleActionClick}
            aria-label={`Actions for ${employee.name}`}
          />
          <DropdownActionMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            position="bottom-right"
          />
        </div>
      </div>
    </div>
  );
});

EmployeeTableRow.displayName = 'EmployeeTableRow';

export default EmployeeTableRow;

