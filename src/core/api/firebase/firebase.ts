// core/api/firebase/firebase.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { env } from '@/config/env';

const firebaseConfig = {
  apiKey:            env.firebase.apiKey,
  authDomain:        env.firebase.authDomain,
  projectId:         env.firebase.projectId,
  storageBucket:     env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId:             env.firebase.appId,
};

// Cegah inisialisasi duplikat saat hot reload (Vite dev mode)
const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;