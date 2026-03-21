// features/posts/components/detail/PostDetailImage.tsx
import type { Post } from '../../types/post.types';

interface PostDetailImageProps {
  post: Post;
}

export const PostDetailImage = ({ post }: PostDetailImageProps) => {
  if (!post.imageUrl) return null;

  return (
    <div className="flex items-center justify-center bg-[var(--color-bg)] h-full min-h-100">
      <img
        src={post.imageUrl}
        alt="post image"
        className="w-full h-full object-contain max-h-[80vh]"
      />
    </div>
  );
};