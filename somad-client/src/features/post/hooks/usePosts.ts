// features/posts/hooks/usePosts.ts
import { useEffect, useCallback } from 'react';
import { usePostStore } from '../store/postStore';
import { getFeedService } from '../services/postService';

export const usePosts = () => {
  const {
    posts, isLoading, error, hasMore, currentPage,
    setPosts, appendPosts, setLoading, setError,
    setHasMore, setCurrentPage,
  } = usePostStore();

  // Load pertama kali
  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, success, error: err } = await getFeedService(1);

    if (!success || !data) {
      setError(err);
      setLoading(false);
      return;
    }

    setPosts(data.posts);
    console.log('📌 Sample post:', data.posts[0]);
    console.log('📦 Data dari API:', data);
    setCurrentPage(1);
    setHasMore(data.pagination.hasNext);
    setLoading(false);
  }, [setLoading, setError, setPosts, setCurrentPage, setHasMore]);

  // Load more — dipanggil saat user scroll ke bawah
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setLoading(true);
    const nextPage = currentPage + 1 // ← hitung page berikutnya

    const {data, success} = await getFeedService(nextPage)

    if (!success || !data) {
      setLoading(false);
      return;
    }

    appendPosts(data.posts);
    setCurrentPage(nextPage);
    setHasMore(data.pagination.hasNext);
    setLoading(false);
  }, [
    hasMore,
    isLoading,
    currentPage,
    setLoading,
    appendPosts,
    setCurrentPage,
    setHasMore,
  ]);

  useEffect(() => {
    // Hanya fetch jika store masih kosong
    if (posts.length === 0) {
      loadInitial();
    }
  }, [posts.length, loadInitial]);

  return { posts, isLoading, error, hasMore, loadMore, refresh: loadInitial };
};