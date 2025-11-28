'use client';

import ToastSuccessIcon from '@/app/assets/icons/toast-success.svg';
import ToastWarningIcon from '@/app/assets/icons/toast-warning.svg';
import ToastDangerIcon from '@/app/assets/icons/toast-danger.svg';

export type ToastVariant = 'success' | 'warning' | 'danger';

export interface ToastProps {
  variant: ToastVariant;
  title: string;
  message: string;
  onClose?: () => void;
}

const variantStyles = {
  success: {
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#007a55]',
  },
  warning: {
    bg: 'bg-[#fefce8]',
    text: 'text-[#d08700]',
  },
  danger: {
    bg: 'bg-[#fef2f2]',
    text: 'text-[#c10007]',
  },
};

const variantIcons = {
  success: ToastSuccessIcon,
  warning: ToastWarningIcon,
  danger: ToastDangerIcon,
};

export default function Toast({ variant, title, message, onClose }: ToastProps) {
  const styles = variantStyles[variant];
  const Icon = variantIcons[variant];

  return (
    <div
      className={`${styles.bg} flex gap-2 items-start p-[14px] rounded-[12px] w-full max-w-[354px]`}
    >
      {/* Icon */}
      <div className="shrink-0 w-6 h-6">
        <Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex flex-col grow items-start justify-center min-w-0">
        {/* Title */}
        <div className="flex gap-1.5 h-6 items-center w-full">
          <p className={`${styles.text} font-medium text-sm leading-bold-sm`}>
            {title}
          </p>
        </div>
        {/* Message */}
        <p className={`${styles.text} font-normal text-sm leading-regular-sm w-full`}>
          {message}
        </p>
      </div>
    </div>
  );
}

