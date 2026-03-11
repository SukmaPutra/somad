// app/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Header }  from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex">

      {/* Sidebar kiri — desktop only */}
      <Sidebar />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};