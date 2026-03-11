// shared/components/Avatar.tsx
import type { Size } from '@/shared/types';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: Size;
  isVerified?: boolean;
  onClick?: () => void;
}

const sizeMap: Record<string, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const verifiedBadgeSize: Record<string, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

export const Avatar = ({
  src,
  alt = 'avatar',
  size = 'md',
  isVerified = false,
  onClick,
}: AvatarProps) => {
  return (
    <div
      className={`relative inline-flex shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeMap[size]} rounded-full object-cover bg-(--color-avatar-bg)`}
        />
      ) : (
        <div className={`
          ${sizeMap[size]} rounded-full
          bg-(--color-avatar-bg)
          flex items-center justify-center
          text-(--color-avatar-text) font-semibold text-sm
        `}>
          {alt.charAt(0).toUpperCase()}
        </div>
      )}

      {isVerified && (
        <span className={`
          absolute bottom-0 right-0
          ${verifiedBadgeSize[size]}
          bg-[#137fec] rounded-full
          flex items-center justify-center
        `}>
          <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-0.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      )}
    </div>
  );
};