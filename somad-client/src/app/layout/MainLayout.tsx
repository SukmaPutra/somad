// app/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { LAYOUT } from "./layoutTokens";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header />
        <main
          className={`flex-1 w-full ${LAYOUT.contentInner} py-6 ${LAYOUT.mainBottomPadding}`}
        >
          <Outlet />
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
};
