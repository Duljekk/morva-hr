'use client';

import { memo } from 'react';
import { EmployeesIcon, CirclePlusIcon } from '@/components/icons';

export interface EmployeesPageHeaderProps {
  /**
   * Callback when "Add Employee" button is clicked
   */
  onAddEmployee?: () => void;

  /**
   * Whether the add button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Employees Page Header Component
 *
 * Header for the employees page with:
 * - Icon and title on the left
 * - "Add Employee" button on the right
 *
 * Figma specs (node 541:3243-541:3250):
 * - Container: border-bottom (dashed, neutral-200), padding pl-[28px] pr-[24px] py-[24px]
 * - Height: 84px total
 * - Layout: justify-between
 * - Icon: 24x24px, neutral-600
 * - Title: Display xs/Semibold, 24px, line-height 28px, neutral-600
 * - Button: bg-neutral-800, white text, rounded-[8px], h-[36px], px-[20px] py-[6px]
 * - Button icon: CirclePlusIcon, 18x18px, white
 * - Button text: Text sm/Semibold, 14px, line-height 18px, white
 *
 * Features:
 * - Accessible button with proper ARIA attributes
 * - Keyboard support
 * - Hover states
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <EmployeesPageHeader
 *   onAddEmployee={() => console.log('Add employee clicked')}
 * />
 * ```
 */
const EmployeesPageHeader = memo(function EmployeesPageHeader({
  onAddEmployee,
  disabled = false,
  className = '',
}: EmployeesPageHeaderProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onAddEmployee?.();
    }
  };

  return (
    <div
      className={`
        border-b border-neutral-200 border-dashed
        content-stretch flex items-center justify-between
        pl-[28px] pr-[24px] py-[24px] relative size-full
        ${className}
      `.trim()}
      data-name="Header"
      data-node-id="541:3243"
    >
      {/* Header + Icon */}
      <div
        className="content-stretch flex gap-[8px] items-center relative shrink-0"
        data-name="Header + Icon"
        data-node-id="541:3244"
      >
        {/* Icon */}
        <div
          className="relative shrink-0 size-[24px] flex items-center justify-center"
          data-name="Icon"
          data-node-id="541:3245"
        >
          <EmployeesIcon
            size={24}
            className="text-neutral-600"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <p
          className="font-semibold leading-[28px] relative shrink-0 text-neutral-600 text-[24px] text-nowrap whitespace-pre"
          data-node-id="541:3247"
        >
          Employee
        </p>
      </div>

      {/* Add Employee Button */}
      <button
        type="button"
        onClick={onAddEmployee}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Add Employee"
        className={`
          bg-neutral-800 content-stretch flex gap-[4px] h-[36px]
          items-center justify-center px-[20px] py-[6px] relative rounded-[8px]
          shrink-0 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-900'}
        `.trim()}
        data-name="Button"
        data-node-id="541:3248"
      >
        {/* Circle Plus Icon */}
        <div
          className="relative shrink-0 size-[18px] flex items-center justify-center"
          data-name="circle-plus, add"
          data-node-id="541:3249"
        >
          <CirclePlusIcon
            size={18}
            className="text-white"
            aria-hidden="true"
          />
        </div>

        {/* Button Text */}
        <p
          className="font-semibold leading-[18px] relative shrink-0 text-white text-sm text-center text-nowrap whitespace-pre"
          data-node-id="541:3250"
        >
          Add Employee
        </p>
      </button>
    </div>
  );
});

EmployeesPageHeader.displayName = 'EmployeesPageHeader';

export default EmployeesPageHeader;



