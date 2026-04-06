import type { LucideIcon } from "lucide-react";
import { Home, Compass, Bell, Mail } from "lucide-react";
import { ROUTES } from "@/config/routes";

export type PrimaryNavItem = {
  label: string;
  path: string;
  Icon: LucideIcon;
};

/** Rute utama (sama untuk Sidebar dan MobileBottomNav). Profil ditangani terpisah (username dinamis). */
export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { label: "Feed", path: ROUTES.FEED, Icon: Home },
  { label: "Explore", path: ROUTES.EXPLORE, Icon: Compass },
  { label: "Notifikasi", path: ROUTES.NOTIFICATIONS, Icon: Bell },
  { label: "Pesan", path: ROUTES.MESSAGES, Icon: Mail },
];
