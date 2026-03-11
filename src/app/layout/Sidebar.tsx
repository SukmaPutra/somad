// app/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bell, Mail, User } from 'lucide-react';
import { ROUTES, generatePath } from '@/config/routes';
import { LogoutButton } from '@/features/auth';
import { useAuth } from '@/features/auth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Feed',       path: ROUTES.FEED,         icon: <Home size={20} />    },
  { label: 'Explore',    path: ROUTES.EXPLORE,       icon: <Compass size={20} /> },
  { label: 'Notifikasi', path: ROUTES.NOTIFICATIONS, icon: <Bell size={20} />    },
  { label: 'Pesan',      path: ROUTES.MESSAGES,      icon: <Mail size={20} />    },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) => `
  flex items-center gap-3 px-4 py-3 rounded-lg
  text-sm font-medium transition-all duration-200
  ${isActive
    ? 'bg-[#137fec]/10 text-[#137fec]'
    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
  }
`;

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="
      hidden lg:flex flex-col w-64 min-h-screen
      border-r border-[var(--color-border)]
      bg-[var(--color-bg)]
      p-4 sticky top-0 h-screen
    ">
      <nav aria-label="Navigasi utama" className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={navLinkClass}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="
                ml-auto bg-[#137fec] text-white
                text-xs font-semibold px-1.5 py-0.5
                rounded-full min-w-5 text-center leading-tight
              ">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Profile link — dynamic username */}
        {user && (
          <NavLink
            to={generatePath(ROUTES.PROFILE, { username: user.username })}
            className={navLinkClass}
          >
            <span aria-hidden="true"><User size={20} /></span>
            <span>Profil</span>
          </NavLink>
        )}
      </nav>

      {/* Logout di bawah */}
      <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
        <LogoutButton variant="ghost" />
      </div>
    </aside>
  );
};