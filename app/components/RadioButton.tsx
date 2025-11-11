'use client';

import type { HTMLAttributes } from 'react';

interface RadioButtonProps extends HTMLAttributes<HTMLSpanElement> {
  checked: boolean;
}

export default function RadioButton({ checked, className = '', ...props }: RadioButtonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center flex-none ${className}`.trim()}
      {...props}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 bg-white">
        <span
          className={`h-2.5 w-2.5 rounded-full bg-neutral-500 transition-transform duration-200 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
            checked ? 'scale-100' : 'scale-0'
          }`}
        />
      </span>
    </span>
  );
}

