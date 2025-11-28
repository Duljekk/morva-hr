'use client';

import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
  bgColor?: 'neutral-50' | 'white';
}

export default function TextArea({
  value,
  placeholder,
  onChange,
  disabled = false,
  className = '',
  bgColor = 'white',
  rows = 4,
  ...props
}: TextAreaProps) {
  const isFilled = value && value.toString().length > 0;
  const bgClass = bgColor === 'white' ? 'bg-white' : 'bg-neutral-50';

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={`
        w-full
        rounded-lg
        border
        ${bgClass}
        text-sm
        font-normal
        leading-regular-sm
        text-neutral-800
        placeholder:text-neutral-500
        outline-none
        transition-all
        resize-none
        disabled:bg-neutral-100
        disabled:text-neutral-400
        disabled:cursor-not-allowed
        ${isFilled ? 'text-neutral-700' : ''}
        border-neutral-100
        hover:border-neutral-300
        focus:border-neutral-400
        focus:ring-2
        focus:ring-neutral-100
        focus:bg-white
        ${className}
      `}
      style={{
        paddingLeft: '14px',
        paddingRight: '14px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
      {...props}
    />
  );
}



