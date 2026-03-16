// features/auth/hooks/useAuth.ts
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { loginService, logoutService, registerService } from "../services/authService";
import { AUTH_ROUTES } from "../constants/authConstants";
import type { LoginPayload, RegisterPayload } from "../types/auth.types";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isLoading, isInitialized, error, setUser, setLoading, setError, clearAuth } = useAuthStore();

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      setError(null);

      try {
        const user = await loginService(payload);

        setUser(user);
        navigate(AUTH_ROUTES.FEED);
        return true;
      } catch (err: any) {
        const message = err.response?.data?.message || "Login gagal";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [navigate, setUser, setLoading, setError],
  );

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      setError(null);

      try {
        const user = await registerService(payload);
        setUser(user);
        navigate(AUTH_ROUTES.FEED);
        return true;
      } catch (err: any) {
        const message = err.response?.data?.message || "Registrasi gagal";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [navigate, setUser, setLoading, setError],
  );

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      // Tetap clear auth meski request logout gagal
      clearAuth();
      navigate(AUTH_ROUTES.LOGIN);
    }
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
