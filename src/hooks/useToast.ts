import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { 
    toastMessage: toast?.message || '', 
    toastType: toast?.type || 'info',
    showToast,
    hideToast
  };
};