// features/posts/hooks/usePosts.ts
import { useEffect, useCallback } from 'react';
import { usePostStore } from '../store/postStore';
import { getFeedService } from '../services/postService';

export const usePosts = () => {
  const {
    posts, isLoading, error, hasMore, lastDoc,
    setPosts, appendPosts, setLoading, setError,
    setHasMore, setLastDoc,
  } = usePostStore();

  // Load pertama kali
  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, success, error: err } = await getFeedService();

    if (!success || !data) {
      setError(err);
      setLoading(false);
      return;
    }

    setPosts(data.posts);
    setLastDoc(data.lastDoc);
    setHasMore(data.hasMore);
    setLoading(false);
  }, []);

  // Load more — dipanggil saat user scroll ke bawah
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setLoading(true);
    const { data, success } = await getFeedService(lastDoc as any);

    if (!success || !data) {
      setLoading(false);
      return;
    }

    appendPosts(data.posts);
    setLastDoc(data.lastDoc);
    setHasMore(data.hasMore);
    setLoading(false);
  }, [hasMore, isLoading, lastDoc]);

  useEffect(() => {
    // Hanya fetch jika store masih kosong
  if (posts.length === 0) {
    loadInitial();
  }
  }, [loadInitial]);

  return { posts, isLoading, error, hasMore, loadMore, refresh: loadInitial };
};