// shared/components/Toast.tsx
import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

// bg pakai CSS variable — otomatis terang di light mode, gelap di dark mode
const toastStyles: Record<ToastType, string> = {
  success: 'border-green-500/50 text-green-500',
  error:   'border-red-500/50 text-red-500',
  warning: 'border-yellow-500/50 text-yellow-500',
  info:    'border-[#137fec]/50 text-[#137fec]',
};

const icons: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

export const Toast = ({ type, message, duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3
      bg-(--color-card) border rounded-lg shadow-lg text-sm
      min-w-70 max-w-sm
      ${toastStyles[type]}
    `}>
      <span className={`font-bold ${toastStyles[type]}`}>{icons[type]}</span>
      <span className="flex-1 text-(--color-text-secondary)">{message}</span>
      <button
        onClick={onClose}
        className="text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
      >
        ✕
      </button>
    </div>
  );
};