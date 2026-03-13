// core/context/AuthProvider.tsx
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { subscribeAuthState, getUserProfileService } from '@/features/auth/services/authService';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.getIdToken(true);

          const { data, success } = await getUserProfileService(firebaseUser.uid);

          if (success && data) {
            setUser(data);
          } else {
            // ← Fallback kalau getUserProfileService gagal
            const now = Timestamp.now();
            setUser({
              uid:            firebaseUser.uid,
              email:          firebaseUser.email          ?? '',
              displayName:    firebaseUser.displayName    ?? '',
              username:       '',
              photoURL:       firebaseUser.photoURL       ?? null,
              bio:            '',
              isVerified:     false,
              isPrivate:      false,
              followersCount: 0,
              followingCount: 0,
              postsCount:     0,
              createdAt:      now,
              updatedAt:      now,
            });
          }
        } catch (err) {
          console.error('Auth init error:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setInitialized]);

  return <>{children}</>;
};