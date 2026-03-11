// features/auth/components/AuthGuard.tsx
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '@/config/routes';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Untuk halaman PROTECTED — user harus login
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  return <>{children}</>;
};

// Untuk halaman PUBLIC — user yang sudah login di-redirect ke feed
export const PublicGuard = ({ children }: AuthGuardProps) => {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) return <Navigate to={ROUTES.FEED} replace />;

  return <>{children}</>;
};