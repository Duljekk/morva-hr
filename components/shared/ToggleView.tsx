'use client';

import { memo, useState, useCallback } from 'react';
import ToggleButton from './ToggleButton';
import { GridIcon, ListIcon } from './Icons';

export type ViewType = 'grid' | 'list';

export interface ToggleViewProps {
  /**
   * Currently selected view type
   * @default "grid"
   */
  value?: ViewType;

  /**
   * Callback when view type changes
   */
  onChange?: (viewType: ViewType) => void;

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * ARIA label for the toggle group
   * @default "Toggle view"
   */
  'aria-label'?: string;
}

/**
 * Toggle View Component
 *
 * A toggle group component that consists of two toggle buttons for switching
 * between grid and list views. Only one button can be active at a time.
 *
 * Figma specs (node 534:2562-534:2565):
 * - Container: 68x36px, rounded-[8px], flex-col
 * - Background: bg-[rgba(161,161,161,0.05)]
 * - Button container: 62px width, flex with gap-[2px]
 * - Buttons: 30x30px each, 2px gap between them
 * - Active button: No background, no shadow (transparent)
 * - Inactive button: White background with shadow
 * - Grid button: GridIcon (horizontal lines)
 * - List button: ListIcon (vertical lines)
 *
 * Features:
 * - Mutually exclusive selection (only one active at a time)
 * - Controlled and uncontrolled modes
 * - Accessible with proper ARIA attributes
 * - Keyboard navigation support
 * - Disabled state support
 *
 * @example
 * ```tsx
 * <ToggleView
 *   value={viewType}
 *   onChange={(type) => setViewType(type)}
 *   aria-label="Toggle view type"
 * />
 * ```
 */
const ToggleView = memo(function ToggleView({
  value: controlledValue,
  onChange,
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Toggle view',
}: ToggleViewProps) {
  const [internalValue, setInternalValue] = useState<ViewType>('grid');

  // Determine if component is controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Handle button click
  const handleGridClick = useCallback(() => {
    if (disabled || currentValue === 'grid') return;
    
    if (!isControlled) {
      setInternalValue('grid');
    }
    onChange?.('grid');
  }, [disabled, currentValue, isControlled, onChange]);

  const handleListClick = useCallback(() => {
    if (disabled || currentValue === 'list') return;
    
    if (!isControlled) {
      setInternalValue('list');
    }
    onChange?.('list');
  }, [disabled, currentValue, isControlled, onChange]);

  return (
    <div
      className={`
        bg-[rgba(161,161,161,0.05)]
        content-stretch flex flex-col items-center justify-center
        relative rounded-[8px]
        w-[68px] h-[36px]
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `.trim()}
      role="group"
      aria-label={ariaLabel}
      data-name="Toggle Group"
      data-node-id="545:3507"
    >
      <div
        className="content-stretch flex gap-[2px] items-center relative shrink-0"
        data-name="Toggle Button Container"
        data-node-id="545:3508"
      >
        {/* Grid Toggle Button */}
        <ToggleButton
          isActive={currentValue === 'grid'}
          onClick={handleGridClick}
          disabled={disabled}
          aria-label="Grid view"
          className="shrink-0"
          data-node-id="545:3509"
        >
          <GridIcon className="w-4 h-4" />
        </ToggleButton>

        {/* List Toggle Button */}
        <ToggleButton
          isActive={currentValue === 'list'}
          onClick={handleListClick}
          disabled={disabled}
          aria-label="List view"
          className="shrink-0"
          data-node-id="545:3510"
        >
          <ListIcon className="w-4 h-4" />
        </ToggleButton>
      </div>
    </div>
  );
});

ToggleView.displayName = 'ToggleView';

export default ToggleView;

