// features/posts/components/ActionButton.tsx
import { formatCount } from '@/core/utils/formatters';

interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  onClick: () => void;
  active?: boolean;
  activeColor: string;
  hoverColor: string;
  hoverBg: string;
  label: string;
}

export const ActionButton = ({
  icon,
  count,
  onClick,
  active,
  activeColor,
  hoverColor,
  hoverBg,
}: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-1.5 text-xs rounded-full px-2 py-1.5
      transition-all duration-150 group
      ${active
        ? activeColor
        : `text-[var(--color-text-muted)] ${hoverColor}`
      }
      ${hoverBg}
    `}
  >
    <span className="transition-transform duration-150 group-hover:scale-110">
      {icon}
    </span>
    {count !== undefined && count > 0 && (
      <span className="tabular-nums">{formatCount(count)}</span>
    )}
  </button>
);