import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string>('');

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  return { toastMessage, showToast };
};