// features/auth/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/core/api/firebase/firebaseInit';
import { withFirestore } from '@/core/api/interceptors';
import { DEFAULT_USER_PROFILE, USERS_COLLECTION } from '../constants/authConstants';
import type { LoginPayload, RegisterPayload, UserProfile } from '../types/auth.types';

// ─── Register ────────────────────────────────────────────────────────────────

export const registerService = async (payload: RegisterPayload) => {
  return withFirestore(async () => {
    // 1. Cek apakah username sudah dipakai
    const usernameQuery = query(
      collection(db, USERS_COLLECTION),
      where('username', '==', payload.username.toLowerCase())
    );
    const usernameSnap = await getDocs(usernameQuery);
    if (!usernameSnap.empty) {
      throw new Error('Username sudah digunakan, coba username lain.');
    }

    // 2. Buat akun di Firebase Auth
    const credential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    // 3. Simpan profil user ke Firestore
    const userProfile: UserProfile = {
      uid:         credential.user.uid,
      email:       payload.email,
      username:    payload.username.toLowerCase(),
      displayName: payload.displayName,
      createdAt:   serverTimestamp() as any,
      updatedAt:   serverTimestamp() as any,
      ...DEFAULT_USER_PROFILE,
    };

    await setDoc(
      doc(db, USERS_COLLECTION, credential.user.uid),
      userProfile
    );

    return userProfile;
  });
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginService = async (payload: LoginPayload) => {
  return withFirestore(async () => {
    const credential = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    return credential.user;
  });
};

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logoutService = async () => {
  return withFirestore(async () => {
    await signOut(auth);
  });
};

// ─── Get User Profile ────────────────────────────────────────────────────────

export const getUserProfileService = async (uid: string) => {
  return withFirestore(async () => {
    const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (!snap.exists()) throw new Error('Profil tidak ditemukan.');
    return snap.data() as UserProfile;
  });
};

// ─── Auth State Observer ─────────────────────────────────────────────────────
// Dipanggil sekali di AuthProvider untuk listen perubahan status login

export const subscribeAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
  // Return value-nya adalah unsubscribe function
};