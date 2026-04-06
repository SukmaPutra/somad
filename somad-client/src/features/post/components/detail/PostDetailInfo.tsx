// features/posts/components/detail/PostDetailInfo.tsx
import { Avatar } from "@/shared/components";
import { formatRelativeTime, toDate } from "@/core/utils/formatters";
import type { Post } from "../../types/post.types";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/config/routes";

interface PostDetailInfoProps {
  post: Post;
}

export const PostDetailInfo = ({ post }: PostDetailInfoProps) => {
  const profilePath = generatePath(ROUTES.PROFILE, { username: post.author.username });

  return (
    <div className="flex flex-col gap-4 p-4 border-b border-(--color-border)">
      <Link to={profilePath} className="flex items-center gap-3 w-fit min-w-0">
        <Avatar
          src={post.author.imageUrl}
          alt={post.author.name}
          size="md"
          isVerified={post.author.isVerified}
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-(--color-text-primary) text-sm hover:underline truncate">
            {post.author.name}
          </span>
          <span className="text-(--color-text-muted) text-xs truncate">
            @{post.author.username}
          </span>
        </div>
      </Link>

      <p className="text-(--color-text-secondary) text-sm whitespace-pre-wrap leading-relaxed break-words">
        {post.content}
      </p>

      <time
        dateTime={toDate(post.createdAt).toISOString()}
        className="text-(--color-text-muted) text-xs"
      >
        {formatRelativeTime(post.createdAt)}
      </time>
    </div>
  );
};
