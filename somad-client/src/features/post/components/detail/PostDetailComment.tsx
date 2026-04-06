// features/posts/components/detail/PostDetailComments.tsx
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { usePostActions } from "../../hooks/usePostActions";
import type { Post } from "../../types/post.types";

interface PostDetailCommentsProps {
  post: Post;
}

export const PostDetailComments = ({ post }: PostDetailCommentsProps) => {
  const { comments, isLoadingComments, commentError, fetchComments, addComment } =
    usePostActions(post);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    await addComment(commentInput.trim());
    setCommentInput("");
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {isLoadingComments ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-4 rounded-md bg-(--color-surface) animate-pulse"
              />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-(--color-text-muted) text-sm text-center py-4">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="
                flex gap-2 rounded-lg p-3 group
                bg-(--color-surface) hover:bg-(--color-elevated)
                border border-(--color-border-sub) hover:border-(--color-border)
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition-colors shrink-0">
                @{comment.author.username}
              </span>
              <span className="text-sm text-(--color-text-secondary) leading-relaxed break-words min-w-0">
                {comment.content}
              </span>
            </div>
          ))
        )}
      </div>

      {commentError && (
        <p className="text-(--color-error) text-xs px-4">{commentError}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 p-4 border-t border-(--color-border) shrink-0">
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          placeholder="Tambahkan komentar..."
          className="
            flex-1 min-w-0 rounded-lg px-3 py-2 text-sm
            bg-(--color-bg)
            border border-(--color-border)
            text-(--color-text-primary)
            placeholder:text-(--color-text-subtle)
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
            px-3 py-2 rounded-lg text-sm shrink-0
            bg-sky-500 hover:bg-sky-400 text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          <Send size={15} />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </div>
    </div>
  );
};
