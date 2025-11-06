'use client';

import { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({
  children,
  icon,
  selected = false,
  onClick,
  className = '',
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-[10px] border text-sm font-medium transition-colors ${
        selected
          ? 'bg-neutral-700 text-white border-neutral-700 hover:bg-neutral-600'
          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
      } ${className}`}
      style={{
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: icon ? '8px' : '6px',
        paddingRight: '6px',
        gap: '0px',
      }}
    >
      {icon && (
        <div className="flex items-center justify-center h-3 w-3 shrink-0 [&_svg]:text-current">
          {icon}
        </div>
      )}
      <span style={{ paddingLeft: '4px', paddingRight: '4px' }}>
        {children}
      </span>
    </button>
  );
}

