// shared/components/Card.tsx
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const paddingMap = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
};

export const Card = ({
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={`
        bg-(--color-card) border border-(--color-border) rounded-lg
        shadow-(--shadow-card)
        ${paddingMap[padding]}
        ${hoverable ? 'hover:bg-(--color-card-hover) transition-colors duration-200 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};