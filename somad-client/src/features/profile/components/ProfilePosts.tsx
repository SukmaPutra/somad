// features/profile/components/ProfilePosts.tsx
import { LoadingSpinner } from '@/shared/components';
import { PostCard } from '@/features/post/components/PostCard';
import type { Post } from '@/features/post/types/post.types';

interface ProfilePostsProps {
  posts: Post[];
  isLoading: boolean;
}

export const ProfilePosts = ({ posts, isLoading }: ProfilePostsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-(--color-text-muted)">
        Belum ada postingan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};