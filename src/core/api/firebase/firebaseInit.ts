// core/api/firebase/firebaseInit.ts
import { getAuth, browserSessionPersistence, setPersistence }     from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import app from './firebase';

export const auth    = getAuth(app);
export const db      = getFirestore(app);

// Logout otomatis saat tab/browser ditutup
setPersistence(auth, browserSessionPersistence);
