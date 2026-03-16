// features/auth/types/auth.types.ts

// Data user dari Express API
export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string;
  isVerified: boolean;
  createdAt: string;

  //counter dari prisma relation
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };
}

// State yang ada di Zustand store
// isInitialized sekarang artinya: sudah cek localStorage, bukan onAuthStateChanged
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// Payload untuk form login
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload untuk form register
export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  name: string;
}

// Actions di store
export interface AuthActions {
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  clearAuth: () => void;
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserProfile
}
