// shared/components/LoadingSpinner.tsx
import type { Size } from '@/shared/types';

interface LoadingSpinnerProps {
  size?: Size;
  color?: string;
}

const sizeMap: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const LoadingSpinner = ({
  size = 'md',
  color = 'border-[#137fec]',
}: LoadingSpinnerProps) => {
  return (
    <div
      className={`
        ${sizeMap[size]}
        border-2 ${color} border-t-transparent
        rounded-full animate-spin
      `}
    />
  );
};