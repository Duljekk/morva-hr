'use client';

import { memo, ReactNode, useState } from 'react';
import EditIcon from '@/components/icons/shared/Edit';
import TrashIcon from '@/components/icons/shared/Trash';

export type DropdownMenuItemState = 'Default' | 'Hover';
export type DropdownMenuItemType = 'Neutral' | 'Danger';

export interface DropdownMenuItemProps {
  /**
   * Text label for the menu item
   * @default "Edit"
   */
  text?: string;

  /**
   * Optional custom icon to display
   * If not provided, defaults to EditIcon
   */
  icon?: ReactNode;

  /**
   * Whether to show the icon
   * @default true
   */
  hasIcon?: boolean;

  /**
   * Visual state of the menu item
   * If not provided, will be managed internally based on hover
   * @default "Default"
   */
  state?: DropdownMenuItemState;

  /**
   * Type/variant of the menu item
   * - Neutral: Standard menu item with neutral colors
   * - Danger: Destructive action with red colors
   * @default "Neutral"
   */
  type?: DropdownMenuItemType;

  /**
   * Whether the menu item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler for the menu item
   */
  onClick?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * DropdownMenuItem Component
 *
 * A menu item component for use in dropdown menus with support for
 * different states (Default, Hover) and types (Neutral, Danger).
 *
 * Figma specs (node 748:3331):
 * - Size: 88px width, 32px height
 * - Container padding: px-[2px]
 * - Inner container: h-[32px], px-[6px], rounded-[6px]
 * - Default: transparent background
 * - Hover: bg-neutral-50 (#fafafa)
 * - Neutral text: text-neutral-700 (#404040)
 * - Danger text: text-red-600 (#e7000b)
 * - Icon size: 16px in 20px container
 * - Text: 14px, regular weight, leading-[20px]
 *
 * @example
 * ```tsx
 * <DropdownMenuItem
 *   text="Edit"
 *   onClick={() => handleEdit()}
 * />
 *
 * <DropdownMenuItem
 *   text="Delete"
 *   type="Danger"
 *   onClick={() => handleDelete()}
 * />
 * ```
 */
const DropdownMenuItem = memo(function DropdownMenuItem({
  text = 'Edit',
  icon,
  hasIcon = true,
  state: controlledState,
  type = 'Neutral',
  disabled = false,
  onClick,
  className = '',
}: DropdownMenuItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine current state (controlled or internal)
  const currentState: DropdownMenuItemState =
    controlledState ?? (isHovered ? 'Hover' : 'Default');

  const isHoverState = currentState === 'Hover';
  const isDanger = type === 'Danger';

  // Get text color based on type
  const textColorClass = isDanger ? 'text-red-600' : 'text-neutral-700';

  // Get icon color based on type
  const iconColorClass = isDanger ? 'text-red-500' : 'text-neutral-500';

  // Get background based on state
  const bgClass = isHoverState ? 'bg-neutral-50' : 'bg-transparent';

  // Default icon component based on type
  const defaultIcon = isDanger 
    ? <TrashIcon size={16} className={iconColorClass} />
    : <EditIcon size={16} className={iconColorClass} />;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`
        flex h-[32px] items-center w-full
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
      data-name="Dropdown Menu Item"
    >
      {/* Inner Container */}
      <div
        className={`
          ${bgClass}
          flex w-full h-[32px] items-center
          px-[6px] rounded-[6px] transition-colors duration-150
        `.trim()}
        data-name="Container"
      >
        {/* Icon Container */}
        {hasIcon && (
          <div
            className="flex items-center justify-center shrink-0 size-[20px]"
            data-name="Icon Container"
          >
            <div className="overflow-clip shrink-0 size-[16px] flex items-center justify-center">
              {icon || defaultIcon}
            </div>
          </div>
        )}

        {/* Text Container */}
        <div
          className="flex items-center justify-center px-[4px] shrink-0"
          data-name="Text Container"
        >
          <p
            className={`
              font-normal leading-[20px] text-sm whitespace-nowrap
              ${textColorClass}
            `.trim()}
          >
            {text}
          </p>
        </div>
      </div>
    </div>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';

export default DropdownMenuItem;
