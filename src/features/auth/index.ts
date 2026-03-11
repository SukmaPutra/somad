// features/auth/index.ts
export { LoginPage }     from './pages/LoginPage';
export { SignupPage }    from './pages/SignupPage';
export { AuthGuard, PublicGuard } from './components/AuthGuard';
export { LogoutButton }  from './components/LogoutButton';
export { useAuth }       from './hooks/useAuth';
export { useAuthStore }  from './store/useAuthStore';
export type { UserProfile, AuthState } from './types/auth.types';
