// app/layout/Header.tsx
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { Avatar } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { HeaderActions } from './HeaderActions';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-20 border-b border-(--color-border)"
      style={{ background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          to={ROUTES.FEED}
          aria-label="Beranda"
          className="flex items-center gap-2.5 group"
        >
          <div className="
            w-8 h-8 rounded-lg bg-[#137fec]
            flex items-center justify-center
            shadow-[0_0_12px_rgb(19_127_236/0.35)]
            group-hover:shadow-[0_0_18px_rgb(19_127_236/0.5)]
            transition-shadow duration-200
          ">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-(--color-text-primary)">
            Somad
          </span>
        </Link>

        {/* Kanan: actions + avatar */}
        <div className="flex items-center gap-1">
          <HeaderActions />

          {user && (
            <Link
              to={`/${user.username}`}
              aria-label={`Profil ${user.displayName}`}
              className="ml-2"
            >
              <Avatar src={user.photoURL} alt={user.displayName} size="sm" />
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};