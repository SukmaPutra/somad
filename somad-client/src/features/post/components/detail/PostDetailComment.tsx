// features/posts/components/detail/PostDetailComments.tsx
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { usePostActions } from "../../hooks/usePostActions";
import type { Post } from "../../types/post.types";

interface PostDetailCommentsProps {
  post: Post;
}

export const PostDetailComments = ({ post }: PostDetailCommentsProps) => {
  const { comments, isLoadingComments, commentError, fetchComments, addComment } = usePostActions(post.id);
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
    <div className="flex flex-col h-full">
      {/* List komentar — scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4">
        {isLoadingComments ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 rounded-md bg-[var(--color-surface)] animate-pulse" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-sm text-center py-4">Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="
                flex gap-2 rounded-lg p-3 group
                bg-[var(--color-surface)] hover:bg-[var(--color-elevated)]
                border border-[var(--color-border-sub)] hover:border-[var(--color-border)]
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-sky-400 group-hover:text-sky-300 transition-colors shrink-0">@{comment.author.username}</span>
              <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{comment.content}</span>
            </div>
          ))
        )}
      </div>

      {commentError && <p className="text-[var(--color-error)] text-xs px-4">{commentError}</p>}

      {/* Input — sticky di bawah */}
      <div className="flex gap-2 p-4 border-t border-[var(--color-border)]">
        <input
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          placeholder="Tambahkan komentar..."
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
            flex items-center justify-center
            px-3 py-2 rounded-lg text-sm
            bg-sky-500 hover:bg-sky-400 text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
