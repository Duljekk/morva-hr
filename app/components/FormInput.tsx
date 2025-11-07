'use client';

import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  hasLeadIcon?: boolean;
  hasTrailIcon?: boolean;
  LeadIcon?: React.ReactNode;
  TrailIcon?: React.ReactNode;
  onTrailIconClick?: () => void;
  className?: string;
  bgColor?: 'neutral-50' | 'white';
}

export default function FormInput({
  value,
  placeholder,
  onChange,
  hasLeadIcon = false,
  hasTrailIcon = false,
  LeadIcon,
  TrailIcon,
  onTrailIconClick,
  type = 'text',
  disabled = false,
  className = '',
  bgColor = 'neutral-50',
  ...props
}: FormInputProps) {
  const isFilled = value && value.toString().length > 0;
  const bgClass = bgColor === 'white' ? 'bg-white' : 'bg-neutral-50';
  const hoverBgClass = bgColor === 'white' ? 'hover:bg-neutral-50' : 'hover:bg-neutral-100';

  // Calculate padding: 10px (icon position) + 16px (icon size) + 4px (text padding) = 30px
  const leftPadding = hasLeadIcon ? '30px' : '10px';
  const rightPadding = hasTrailIcon ? '30px' : '10px';

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Lead Icon */}
      {hasLeadIcon && LeadIcon && (
        <div className="absolute left-[10px] flex items-center justify-center pointer-events-none z-10">
          <div className="text-neutral-500">
            {React.isValidElement(LeadIcon)
              ? React.cloneElement(LeadIcon as React.ReactElement<any>, {
                  className: `h-4 w-4 ${(LeadIcon as React.ReactElement<any>).props?.className || ''}`,
                })
              : LeadIcon}
          </div>
        </div>
      )}

      {/* Input Field */}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full
          rounded-lg
          border
          ${bgClass}
          py-2.5
          text-sm
          font-normal
          text-neutral-800
          placeholder:text-neutral-500
          outline-none
          transition-all
          disabled:bg-neutral-100
          disabled:text-neutral-400
          disabled:cursor-not-allowed
          ${isFilled ? 'text-neutral-700' : ''}
          border-neutral-100
          ${hoverBgClass}
          hover:border-neutral-200
          focus:border-neutral-400
          focus:ring-2
          focus:ring-neutral-100
          focus:bg-white
        `}
        style={{
          paddingLeft: leftPadding,
          paddingRight: rightPadding,
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
        {...props}
      />

      {/* Trail Icon */}
      {hasTrailIcon && TrailIcon && (
        <div
          className={`absolute right-[10px] flex items-center justify-center z-10 ${
            onTrailIconClick ? 'cursor-pointer' : 'pointer-events-none'
          }`}
          onClick={onTrailIconClick}
          role={onTrailIconClick ? 'button' : undefined}
          tabIndex={onTrailIconClick ? 0 : undefined}
        >
          <div className="text-neutral-500">
            {React.isValidElement(TrailIcon)
              ? React.cloneElement(TrailIcon as React.ReactElement<any>, {
                  className: `h-4 w-4 ${(TrailIcon as React.ReactElement<any>).props?.className || ''}`,
                })
              : TrailIcon}
          </div>
        </div>
      )}
    </div>
  );
}

