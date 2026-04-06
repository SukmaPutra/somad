import { useEffect, useState } from 'react';
import { usePostStore } from '../store/postStore';
import { getPostByIdService } from '../services/postService';
import type { Post } from '../types/post.types';

export const usePostDetail = (postId: string) => {
  const { posts } = usePostStore();

  // Cache dari Zustand untuk menghindari request berulang.
  const cachedPost = posts.find((p) => p.id === postId);

  // State hanya dipakai untuk hasil fetch; kalau cachedPost ada, UI akan memakai cachedPost.
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika sudah ada di cache, jangan lakukan fetch dan jangan setState di effect.
    if (cachedPost) return;

    let isMounted = true;

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);

      const { data, success, error: err } = await getPostByIdService(postId);
      if (!isMounted) return;

      if (!success || !data) {
        setError(err ? 'Postingan tidak ditemukan' : null);
        setIsLoading(false);
        return;
      }

      setPost(data);
      setIsLoading(false);
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postId, cachedPost]);

  return {
    post: cachedPost ?? post,
    isLoading: cachedPost ? false : isLoading,
    error: cachedPost ? null : error,
  };
};

