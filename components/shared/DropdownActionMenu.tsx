'use client';

import { memo, useRef, useEffect, ReactNode } from 'react';
import DropdownMenuItem from './DropdownMenuItem';
import EditIcon from '@/components/icons/shared/Edit';
import TrashIcon from '@/components/icons/shared/Trash';

export interface DropdownActionMenuProps {
  /**
   * Whether the menu is open
   */
  isOpen: boolean;

  /**
   * Callback when menu should close
   */
  onClose: () => void;

  /**
   * Callback when Edit is clicked
   */
  onEdit?: () => void;

  /**
   * Callback when Delete is clicked
   */
  onDelete?: () => void;

  /**
   * Custom menu items to render instead of default Edit/Delete
   * If provided, onEdit and onDelete are ignored
   */
  children?: ReactNode;

  /**
   * Position of the menu relative to trigger
   * @default "bottom-right"
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

  /**
   * Additional CSS classes for the menu container
   */
  className?: string;
}

/**
 * DropdownActionMenu Component
 *
 * A dropdown menu component for action buttons, typically used in table rows.
 * Contains Edit and Delete actions by default.
 *
 * Figma specs (node 748:3447):
 * - Size: 88px width, auto height
 * - Background: white
 * - Border radius: rounded-[8px]
 * - Shadow: shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.1)]
 * - Padding: py-[2px]
 * - Gap between items: gap-[2px]
 *
 * Features:
 * - Click outside to close
 * - Escape key to close
 * - Keyboard navigation support
 * - Customizable position
 * - Custom menu items support
 *
 * @example
 * ```tsx
 * <DropdownActionMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   onEdit={() => handleEdit()}
 *   onDelete={() => handleDelete()}
 * />
 * ```
 */
const DropdownActionMenu = memo(function DropdownActionMenu({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  children,
  position = 'bottom-right',
  className = '',
}: DropdownActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Use setTimeout to avoid immediate close when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Position classes
  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-1',
    'bottom-right': 'top-full right-0 mt-1',
    'top-left': 'bottom-full left-0 mb-1',
    'top-right': 'bottom-full right-0 mb-1',
  };

  const handleEdit = () => {
    onEdit?.();
    onClose();
  };

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      className={`
        absolute z-50
        bg-white
        flex flex-col gap-[2px] items-start
        overflow-clip
        p-[2px]
        rounded-[8px]
        shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_rgba(0,0,0,0.1)]
        w-[88px]
        ${positionClasses[position]}
        ${className}
      `.trim()}
      data-name="Dropdown Action Button"
    >
      {children || (
        <>
          <DropdownMenuItem
            text="Edit"
            icon={<EditIcon size={16} className="text-neutral-500" />}
            type="Neutral"
            onClick={handleEdit}
          />
          <DropdownMenuItem
            text="Delete"
            icon={<TrashIcon size={16} className="text-red-500" />}
            type="Danger"
            onClick={handleDelete}
          />
        </>
      )}
    </div>
  );
});

DropdownActionMenu.displayName = 'DropdownActionMenu';

export default DropdownActionMenu;
