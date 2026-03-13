// shared/hooks/useToast.ts
import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  type: ToastType;
  message: string;
  id: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ type, message, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};