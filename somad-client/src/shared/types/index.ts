// shared/types/index.ts

// Ukuran yang konsisten di seluruh app
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Response wrapper dari interceptors
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  hasMore: boolean;
  lastDoc?: unknown; // Firestore DocumentSnapshot untuk cursor
}

// User ringkas — dipakai di postingan, komentar, dll
export interface UserSnippet {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string | null;
  isVerified?: boolean;
}