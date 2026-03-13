// features/posts/components/detail/PostDetailInfo.tsx
import { Avatar } from '@/shared/components';
import { formatRelativeTime, toDate } from '@/core/utils/formatters';
import type { Post } from '../../types/post.types';
import { Link, generatePath } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

interface PostDetailInfoProps {
  post: Post;
}

export const PostDetailInfo = ({ post }: PostDetailInfoProps) => {
  const profilePath = generatePath(ROUTES.PROFILE, { username: post.author.username });

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-[var(--color-border)]">
      {/* Author */}
      <Link to={profilePath} className="flex items-center gap-3 w-fit">
        <Avatar
          src={post.author.photoURL}
          alt={post.author.displayName}
          size="md"
          isVerified={post.author.isVerified}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-[var(--color-text-primary)] text-sm hover:underline">
            {post.author.displayName}
          </span>
          <span className="text-[var(--color-text-muted)] text-xs">
            @{post.author.username}
          </span>
        </div>
      </Link>

      {/* Konten */}
      <p className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap leading-relaxed">
        {post.content}
      </p>

      {/* Timestamp */}
      <time
        dateTime={toDate(post.createdAt).toISOString()}
        className="text-[var(--color-text-muted)] text-xs"
      >
        {formatRelativeTime(post.createdAt)}
      </time>
    </div>
  );
};