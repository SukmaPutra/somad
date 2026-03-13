// config/env.ts

const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? '';
};

export const env = {
  app: {
    name: getEnvVar('VITE_APP_NAME'),
    url: getEnvVar('VITE_APP_URL'),
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },

  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  },

  // Untuk upload foto profil / foto postingan
  storage: {
    cloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME', false),
    uploadPreset: getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET', false),
  },
} as const;

// ❌ Dihapus: api.baseUrl, api.timeout
// Karena Firestore tidak butuh base URL manual