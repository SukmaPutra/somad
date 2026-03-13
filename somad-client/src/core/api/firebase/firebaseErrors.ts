// core/api/firebase/firebaseErrors.ts

const authErrors: Record<string, string> = {
  'auth/user-not-found':         'Akun tidak ditemukan.',
  'auth/wrong-password':         'Password salah.',
  'auth/email-already-in-use':   'Email sudah digunakan akun lain.',
  'auth/invalid-email':          'Format email tidak valid.',
  'auth/weak-password':          'Password terlalu lemah, minimal 6 karakter.',
  'auth/user-disabled':          'Akun ini telah dinonaktifkan.',
  'auth/too-many-requests':      'Terlalu banyak percobaan. Coba lagi nanti.',
  'auth/network-request-failed': 'Koneksi gagal. Periksa internet kamu.',
  'auth/popup-closed-by-user':   'Login dibatalkan.',
  'auth/invalid-credential':     'Email atau password salah.',
};

const firestoreErrors: Record<string, string> = {
  'permission-denied':  'Kamu tidak punya akses ke data ini.',
  'not-found':          'Data tidak ditemukan.',
  'already-exists':     'Data sudah ada.',
  'unavailable':        'Layanan tidak tersedia. Coba lagi nanti.',
  'deadline-exceeded':  'Request timeout. Periksa koneksi kamu.',
  'resource-exhausted': 'Terlalu banyak request. Coba lagi nanti.',
  'unauthenticated':    'Kamu harus login untuk melakukan ini.',
};

const storageErrors: Record<string, string> = {
  'storage/unauthorized':    'Tidak diizinkan mengakses file ini.',
  'storage/canceled':        'Upload dibatalkan.',
  'storage/object-not-found':'File tidak ditemukan.',
  'storage/quota-exceeded':  'Penyimpanan penuh.',
};

export const getFirebaseErrorMessage = (code: string): string => {
  return (
    authErrors[code] ??
    firestoreErrors[code] ??
    storageErrors[code] ??
    'Terjadi kesalahan. Silakan coba lagi.'
  );
};