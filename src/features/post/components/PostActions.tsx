// features/posts/components/PostActions.tsx
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { usePostActions } from '../hooks/usePostActions';
import type { Post } from '../types/post.types';
import { ROUTES, generatePath } from '@/config/routes';

interface PostActionProps {
  post: Post;
  hideComments?: boolean;
}

export const PostActions = ({ post, hideComments = false }: PostActionProps) => {
  const { isLiked, isReposted, comments, isLoadingComments, commentError, toggleLike, toggleRepost, fetchComments, addComment } = usePostActions(post.id);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const profilePath = post?.author?.username
    ? generatePath(ROUTES.PROFILE, { username: post.author.username })
    : '#';

  const handleToggleComments = useCallback(() => {
    if (!showComments) fetchComments();
    setShowComments((prev) => !prev);
  }, [showComments, fetchComments]);

  const handleAddComment = useCallback(async () => {
    if (!commentInput.trim()) return;
    await addComment(commentInput.trim());
    setCommentInput('');
  }, [commentInput, addComment]);

  return (
    <div className="flex flex-col gap-3">
      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <ActionButton
          icon={isLiked
            ? <Heart size={16} className="fill-rose-500 text-rose-500" />
            : <Heart size={16} />
          }
          count={post.likesCount}
          onClick={() => toggleLike(post.likesCount)}
          active={isLiked}
          activeColor="text-rose-500"
          hoverColor="hover:text-rose-500"
          hoverBg="hover:bg-rose-500/10"
          label="Suka"
        />

        {!hideComments && (
          <ActionButton
            icon={<MessageCircle size={16} />}
            count={post.commentsCount ?? 0}
            onClick={handleToggleComments}
            active={showComments}
            activeColor="text-sky-400"
            hoverColor="hover:text-sky-400"
            hoverBg="hover:bg-sky-400/10"
            label="Komentar"
          />
        )}

        <ActionButton
          icon={<Repeat2 size={16} />}
          count={post.repostsCount ?? 0}
          onClick={() => toggleRepost(post.repostsCount ?? 0)}
          active={isReposted}
          activeColor="text-emerald-400"
          hoverColor="hover:text-emerald-400"
          hoverBg="hover:bg-emerald-400/10"
          label="Repost"
        />
      </div>

      {/* Comments Section */}
      {!hideComments && showComments && (
        <div className="flex flex-col gap-3 pt-3 border-t border-[var(--color-border)]">
          {/* Input komentar */}
          <div className="flex gap-2">
            <input
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Tulis komentar..."
              className="
                flex-1 rounded-lg px-3 py-2 text-sm
                bg-[var(--color-bg)]
                border border-[var(--color-border)]
                text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-subtle)]
                focus:outline-none focus:ring-1 focus:ring-sky-500/50
                transition-colors
              "
            />
            <button
              onClick={handleAddComment}
              disabled={!commentInput.trim()}
              aria-label="Kirim komentar"
              className="
                flex items-center justify-center gap-1.5
                px-3 py-2 rounded-lg text-sm
                bg-sky-500 hover:bg-sky-400 text-white
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-colors duration-150
              "
            >
              <Send size={15} />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </div>

          {commentError && (
            <p className="text-[var(--color-error)] text-xs">{commentError}</p>
          )}

          {/* List komentar */}
          {isLoadingComments ? (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 rounded-md bg-[var(--color-surface)] animate-pulse" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm text-center py-2">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="
                    rounded-lg p-3 group
                    bg-[var(--color-surface)] hover:bg-[var(--color-elevated)]
                    border border-[var(--color-border-sub)] hover:border-[var(--color-border)]
                    transition-colors duration-200
                  "
                >
                  <div className="flex gap-2">
                    <Link
                      to={profilePath}
                      className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition-colors shrink-0 hover:underline"
                    >
                      @{comment.author.username}
                    </Link>
                    <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {comment.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};