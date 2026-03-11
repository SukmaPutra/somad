// features/posts/components/PostList.tsx
import { useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/shared/components';
import { PostCard } from './PostCard';
import { usePosts } from '../hooks/usePosts';

export const PostList = () => {
  const { posts, isLoading, error, hasMore, loadMore } = usePosts();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) loadMore();
      },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (error) {
    return (
      <div className="text-center py-12 text-(--color-text-muted)]">
        <p>Gagal memuat postingan.</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={bottomRef} className="h-4" />

      {isLoading && (
        <div className="flex justify-center py-6">
          <LoadingSpinner size="md" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-(--color-text-muted)] text-sm py-6">
          Kamu sudah melihat semua postingan.
        </p>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12 text-(--color-text-muted)]">
          <p className="text-lg">Belum ada postingan.</p>
          <p className="text-sm mt-1">Jadilah yang pertama posting!</p>
        </div>
      )}
    </div>
  );
};