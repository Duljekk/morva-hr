'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastVariant } from '../components/Toast';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (variant: ToastVariant, title: string, message: string, duration?: number) => void;
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (variant: ToastVariant, title: string, message: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: ToastData = { id, variant, title, message };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none pb-[2px]">
        <div className="w-full max-w-[402px] px-6 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto animate-in">
              <Toast
                variant={toast.variant}
                title={toast.title}
                message={toast.message}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

