// shared/hooks/useSessionStorage.ts
import { useState } from 'react';

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key); // ← ganti
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      sessionStorage.setItem(key, JSON.stringify(value)); // ← ganti
    } catch (err) {
      console.error('useSessionStorage error:', err);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      sessionStorage.removeItem(key); // ← ganti
    } catch (err) {
      console.error('useSessionStorage error:', err);
    }
  };

  return [storedValue, setValue, removeValue] as const;
};