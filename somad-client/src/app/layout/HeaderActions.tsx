// app/layout/HeaderActions.tsx
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

export const HeaderActions = () => {
  return (
    <div className="flex items-center gap-1">

      {/* Search */}
      <Link
        to={ROUTES.EXPLORE}
        aria-label="Cari"
        className="
          p-2 rounded-full
          text-(--color-text-muted)
          hover:text-(--color-text-primary)
          hover:bg-(--color-surface)
          transition-all duration-150
        "
      >
        <Search size={18} />
      </Link>

      {/* Theme toggle */}
      <ThemeToggle />

    </div>
  );
};