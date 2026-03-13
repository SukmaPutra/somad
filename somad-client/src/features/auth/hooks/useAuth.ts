// features/auth/hooks/useAuth.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  loginService,
  logoutService,
  registerService,
} from '../services/authService';
import {  AUTH_ROUTES } from '../constants/authConstants';
import type { LoginPayload, RegisterPayload } from '../types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isLoading, isInitialized, error, setLoading, setError, clearAuth } =
    useAuthStore();

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);

    const { success, error: errMsg } = await loginService(payload);

    if (!success) {
      setError(errMsg);
      setLoading(false);
      return false;
    }

    // Setelah login, onAuthStateChanged di AuthProvider akan otomatis
    // set user ke store — tidak perlu set manual di sini
    navigate(AUTH_ROUTES.FEED);
    return true;
  }, [navigate, setLoading, setError]);

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);

    const { success, error: errMsg } = await registerService(payload);

    if (!success) {
      setError(errMsg);
      setLoading(false);
      return false;
    }

    navigate(AUTH_ROUTES.FEED);
    return true;
  }, [navigate, setLoading, setError]);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await logoutService();
    clearAuth();
    navigate(AUTH_ROUTES.LOGIN);
  }, [navigate, clearAuth]);

  return {
    // State
    user,
    isLoading,
    isInitialized,
    error,
    isAuthenticated: !!user,

    // Actions
    login,
    register,
    logout,
  };
};