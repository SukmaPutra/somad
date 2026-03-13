// features/auth/types/auth.types.ts
import { Timestamp } from 'firebase/firestore';

// Data user yang tersimpan di Firestore collection 'users'
export interface UserProfile {
  uid:          string;
  email:        string;
  username:     string;
  displayName:  string;
  photoURL:     string | null;
  bio:          string;
  isVerified:   boolean;
  isPrivate:    boolean;

  // Counter — disimpan di dokumen agar tidak perlu query setiap saat
  followersCount: number;
  followingCount: number;
  postsCount:     number;

  createdAt:  Timestamp;
  updatedAt:  Timestamp;
}

// State yang ada di Zustand store
export interface AuthState {
  user:        UserProfile | null;
  isLoading:   boolean;
  isInitialized: boolean; // true setelah onAuthStateChanged pertama kali terpanggil
  error:       string | null;
}

// Payload untuk form login
export interface LoginPayload {
  email:    string;
  password: string;
}

// Payload untuk form register
export interface RegisterPayload {
  email:       string;
  password:    string;
  confirmPassword: string;
  username:    string;
  displayName: string;
}

// Actions di store
export interface AuthActions {
  setUser:          (user: UserProfile | null) => void;
  setLoading:       (isLoading: boolean) => void;
  setError:         (error: string | null) => void;
  setInitialized:   (isInitialized: boolean) => void;
  clearAuth:        () => void;
}