// features/posts/components/PostCard.tsx
import { Avatar, Card } from '@/shared/components';
import { formatRelativeTime, toDate } from '@/core/utils/formatters';
import { PostActions } from './PostActions';
import type { Post } from '../types/post.types';
import { Link, generatePath } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const profilePath = post?.author?.username
    ? generatePath(ROUTES.PROFILE, { username: post.author.username })
    : '#';

  const postPath = generatePath(ROUTES.POST_DETAIL, { postId: post.id });

  return (
    <Card
      hoverable={false}
      padding="md"
      className="
        flex flex-col gap-3
        border-b border-(--color-border)
        hover:bg-(--color-elevated)
        transition-colors duration-150
        cursor-pointer
      "
    >
      {/* Header — Avatar + Info */}
      <div className="flex items-start gap-3">
        <Link to={profilePath}>
          <Avatar
            src={post.author.photoURL}
            alt={post.author.displayName}
            size="md"
            isVerified={post.author.isVerified}
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={profilePath}
              className="font-semibold text-(--color-text-primary) text-sm hover:underline truncate"
            >
              {post.author.displayName}
            </Link>
            <Link
              to={profilePath}
              className="text-(--color-text-muted) text-sm truncate hover:underline"
            >
              @{post.author.username}
            </Link>
            <span className="text-(--color-text-subtle) text-xs">·</span>
            <time
              dateTime={toDate(post.createdAt).toISOString()}
              className="text-(--color-text-muted) text-xs shrink-0"
            >
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>

          {/* Konten */}
          <Link to={postPath}>
            <p className="
              text-(--color-text-secondary) text-sm mt-1
              whitespace-pre-wrap break-words leading-relaxed
            ">
              {post.content}
            </p>
          </Link>
        </div>
      </div>

      {/* Gambar opsional */}
      {post.imageURL && (
        <Link to={postPath}>
          <img
            src={post.imageURL}
            alt="post image"
            loading="lazy"
            className="w-full rounded-xl object-cover max-h-96 border border-(--color-border)"
          />
        </Link>
      )}

      {/* Actions */}
      <PostActions post={post} />
    </Card>
  );
};