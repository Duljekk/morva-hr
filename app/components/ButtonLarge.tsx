'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonLargeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export default function ButtonLarge({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonLargeProps) {
  const baseClasses = 'flex h-12 w-full items-center justify-center px-5 py-1.5 text-base font-semibold tracking-tight transition-colors';
  
  const variantClasses = {
    primary: 'rounded-[14px] bg-neutral-800 text-white shadow-[inset_0.5px_0.7px_0.4px_0px_rgba(255,255,255,0.5),inset_-0.5px_-0.5px_0.2px_0px_rgba(0,0,0,0.6)] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'rounded-xl bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

