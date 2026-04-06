// app/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { ROUTES, generatePath } from "@/config/routes";
import { LogoutButton } from "@/features/auth";
import { useAuth } from "@/features/auth";
import { PRIMARY_NAV_ITEMS } from "./navConfig";

const navLinkClass = ({ isActive }: { isActive: boolean }) => `
  flex items-center gap-3 px-4 py-3 rounded-lg
  text-sm font-medium transition-all duration-200
  ${
    isActive
      ? "bg-[#137fec]/10 text-[#137fec]"
      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
  }
`;

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside
      className="
      hidden lg:flex flex-col w-64 min-h-screen
      border-r border-[var(--color-border)]
      bg-[var(--color-bg)]
      p-4 sticky top-0 h-screen
    "
    >
      <nav aria-label="Navigasi utama" className="flex flex-col gap-1 flex-1">
        {PRIMARY_NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink key={path} to={path} className={navLinkClass} end={path === ROUTES.FEED}>
            <span aria-hidden="true">
              <Icon size={20} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}

        {user && (
          <NavLink
            to={generatePath(ROUTES.PROFILE, { username: user.username })}
            className={navLinkClass}
          >
            <span aria-hidden="true">
              <User size={20} />
            </span>
            <span>Profil</span>
          </NavLink>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
        <LogoutButton variant="ghost" />
      </div>
    </aside>
  );
};
