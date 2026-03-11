  // features/auth/store/authStore.ts
  import { create } from 'zustand';
  import { devtools } from 'zustand/middleware';
  import type { AuthState, AuthActions, UserProfile } from '../types/auth.types';

  type AuthStore = AuthState & AuthActions;

  const initialState: AuthState = {
    user:          null,
    isLoading:     true,   // true dari awal karena menunggu onAuthStateChanged
    isInitialized: false,
    error:         null,
    
  };

  export const useAuthStore = create<AuthStore>()(
    devtools(
      (set) => ({
        ...initialState,

        setUser: (user: UserProfile | null) =>
          set({ user }, false, 'auth/setUser'),

        setLoading: (isLoading: boolean) =>
          set({ isLoading }, false, 'auth/setLoading'),

        setError: (error: string | null) =>
          set({ error }, false, 'auth/setError'),

        setInitialized: (isInitialized: boolean) =>
          set({ isInitialized, isLoading: false }, false, 'auth/setInitialized'),

        clearAuth: () =>
          set({ ...initialState, isLoading: false, isInitialized: true }, false, 'auth/clearAuth'),
      }),
      { name: 'AuthStore' }
    )
  );