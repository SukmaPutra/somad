// core/api/interceptors.ts
import { FirebaseError } from 'firebase/app';
import { getFirebaseErrorMessage } from './firebase/firebaseErrors';

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export const withFirestore = async <T>(
  operation: () => Promise<T>
): Promise<ServiceResponse<T>> => {
  try {
    const data = await operation();
    return { data, error: null, success: true };
  } catch (err) {
    if (err instanceof FirebaseError) {
      const message = getFirebaseErrorMessage(err.code);
      console.error(`[Firebase Error] ${err.code}:`, err.message);
      return { data: null, error: message, success: false };
    }
    console.error('[Unknown Error]:', err);
    return { data: null, error: 'Terjadi kesalahan tidak diketahui.', success: false };
  }
};