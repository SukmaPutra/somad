// features/posts/components/detail/PostDetailImage.tsx
import type { Post } from "../../types/post.types";

interface PostDetailImageProps {
  post: Post;
}

export const PostDetailImage = ({ post }: PostDetailImageProps) => {
  if (!post.imageUrl) return null;

  return (
    <div
      className="
      flex items-center justify-center bg-[var(--color-bg)] w-full
      min-h-[12rem] max-h-[50vh]
      lg:min-h-0 lg:max-h-none lg:h-full lg:flex-1
    "
    >
      <img
        src={post.imageUrl}
        alt="post image"
        className="
        w-full h-full object-contain
        max-h-[50vh] lg:max-h-[min(90vh,900px)]
      "
      />
    </div>
  );
};
