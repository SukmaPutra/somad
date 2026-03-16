// core/context/AuthProvider.tsx
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { initializeAuth } from '@/features/auth/services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await initializeAuth()
        setUser(user)
      } catch (err) {
        console.error('Auth init error', err)
        setUser(null)
      } finally {
        setInitialized(true)
      }
    }

    checkAuth()
  }, []);

  return <>{children}</>;
};