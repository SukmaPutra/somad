// shared/hooks/usePagination.ts
import { useState } from 'react';
import type { PaginationMeta } from '@/shared/types';

export const usePagination = (limit = 10) => {
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit,
    hasMore: true,
    lastDoc: undefined,
  });

  const updatePagination = (lastDoc: unknown, hasMore: boolean) => {
    setMeta(prev => ({
      ...prev,
      page: prev.page + 1,
      lastDoc,
      hasMore,
    }));
  };

  const reset = () => {
    setMeta({ page: 1, limit, hasMore: true, lastDoc: undefined });
  };

  return { meta, updatePagination, reset };
};