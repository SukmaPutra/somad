// features/auth/constants/authConstants.ts

export const AUTH_ROUTES = {
  LOGIN:    '/login',
  REGISTER: '/register',
  FEED:     '/feed',         // redirect setelah login berhasil
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS:    'Selamat datang kembali!',
  REGISTER_SUCCESS: 'Akun berhasil dibuat!',
  LOGOUT_SUCCESS:   'Kamu telah keluar.',
  EMAIL_SENT:       'Email reset password telah dikirim.',
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Email atau password salah.',
  USER_NOT_FOUND:      'Pengguna tidak ditemukan.',
  EMAIL_IN_USE:       'Email sudah digunakan.',
  WEAK_PASSWORD:      'Password terlalu lemah.',
  UNKNOWN_ERROR:      'Terjadi kesalahan. Silakan coba lagi.',
} as const;

// Firestore collection untuk user profile
export const USERS_COLLECTION = 'users';

// Default value saat user baru dibuat
export const DEFAULT_USER_PROFILE = {
  bio:            '',
  photoURL:       null,
  isVerified:     false,
  isPrivate:      false,
  followersCount: 0,
  followingCount: 0,
  postsCount:     0,
} as const;