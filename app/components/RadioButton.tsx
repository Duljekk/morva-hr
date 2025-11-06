'use client';

import type { HTMLAttributes } from 'react';

interface RadioButtonProps extends HTMLAttributes<HTMLSpanElement> {
  checked: boolean;
}

export default function RadioButton({ checked, className = '', ...props }: RadioButtonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`.trim()}
      {...props}
    >
      <span className="flex h-3 w-3 items-center justify-center rounded-full border border-neutral-300">
        <span
          className={`h-2 w-2 rounded-full bg-neutral-500 transition-transform duration-150 ease-out ${
            checked ? 'scale-100' : 'scale-0'
          }`}
        />
      </span>
    </span>
  );
}

