import { NavLink, generatePath } from "react-router-dom";
import { User } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/features/auth";
import { PRIMARY_NAV_ITEMS } from "./navConfig";

const itemClass = ({ isActive }: { isActive: boolean }) =>
  `
  flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-2
  text-[10px] sm:text-xs font-medium transition-colors
  ${
    isActive
      ? "text-[#137fec]"
      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
  }
`;

export const MobileBottomNav = () => {
  const { user } = useAuth();

  return (
    <nav
      className="
        lg:hidden fixed bottom-0 inset-x-0 z-30
        border-t border-(--color-border)
        bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)]
        backdrop-blur-md
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Navigasi utama"
    >
      <div className="flex items-stretch justify-around max-w-2xl mx-auto px-1">
        {PRIMARY_NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={itemClass}
            end={path === ROUTES.FEED}
          >
            <Icon size={22} strokeWidth={2} aria-hidden />
            <span className="truncate max-w-18 text-center">{label}</span>
          </NavLink>
        ))}

        {user ? (
          <NavLink
            to={generatePath(ROUTES.PROFILE, { username: user.username })}
            className={itemClass}
          >
            <User size={22} strokeWidth={2} aria-hidden />
            <span className="truncate max-w-18 text-center">Profil</span>
          </NavLink>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 opacity-40 pointer-events-none">
            <User size={22} aria-hidden />
            <span className="text-[10px] sm:text-xs">Profil</span>
          </div>
        )}
      </div>
    </nav>
  );
};
