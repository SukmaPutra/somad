// shared/hooks/useAsync.ts
import { useState, useCallback } from 'react';
import type { Status } from '@/shared/types';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  status: Status;
}

export const useAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, error: null, status: 'loading' });
    try {
      const data = await asyncFn();
      setState({ data, error: null, status: 'success' });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      setState({ data: null, error: message, status: 'error' });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, error: null, status: 'idle' });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isIdle:    state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError:   state.status === 'error',
  };
};