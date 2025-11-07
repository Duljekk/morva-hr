'use client';

import { useEffect } from 'react';
import ButtonLarge from './ButtonLarge';
import useLockBodyScroll from '../hooks/useLockBodyScroll';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmationModalProps) {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="mx-6 w-full max-w-[354px] rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-semibold text-neutral-700 tracking-tight">
          {title}
        </h2>
        <p className="mb-6 text-sm text-neutral-600 leading-5">
          {message}
        </p>
        <div className="flex gap-3">
          <ButtonLarge onClick={onClose} variant="secondary" className="flex-1">
            {cancelText}
          </ButtonLarge>
          <ButtonLarge onClick={handleConfirm} variant="primary" className="flex-1">
            {confirmText}
          </ButtonLarge>
        </div>
      </div>
    </div>
  );
}

