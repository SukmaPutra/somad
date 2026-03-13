// features/posts/hooks/usePostActions.ts
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { usePostStore } from "../store/postStore";
import { toggleLikeService, toggleRepostService, addCommentService, getCommentsService, checkUserInteractionsService } from "../services/postService";
import type { Comment } from "../types/post.types";
import { Timestamp } from "firebase/firestore";

export const usePostActions = (postId: string) => {
  const { user, isInitialized } = useAuthStore();
  const { updatePost } = usePostStore();

  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [isTogglingRepost, setIsTogglingRepost] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const [commentError, setCommentError] = useState<string | null>(null);

  // ─── Fetch Initial Like & Repost State ──────────────────────────────────
  useEffect(() => {
    if (!isInitialized || !user) {
      return;
    }

    const fetchInitialState = async () => {
      const { data, success } = await checkUserInteractionsService(postId, user.uid);

      if (success && data) {
        setIsLiked(data.isLiked);
        setIsReposted(data.isReposted);
      }
    };

    fetchInitialState();
  }, [postId, user, isInitialized]);

  // ─── Like ────────────────────────────────────────────────────────────────
  const toggleLike = useCallback(
    async (currentCount: number) => {
      if (!user || isTogglingLike) return;

      setIsTogglingLike(true);
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      updatePost(postId, { likesCount: currentCount + (newLiked ? 1 : -1) });

      try {
        const result = await toggleLikeService(postId, user.uid);
        if (!result.success) {
          setIsLiked(!newLiked);
          updatePost(postId, { likesCount: currentCount });
        }
      } catch (err) {
        console.error("Gagal toggle like:", err);
        setIsLiked(!newLiked);
        updatePost(postId, { likesCount: currentCount });
      } finally {
        setIsTogglingLike(false);
      }
    },
    [user, postId, isLiked, isTogglingLike, updatePost],
  );

  // ─── Repost ──────────────────────────────────────────────────────────────
  const toggleRepost = useCallback(
    async (currentCount: number) => {
      if (!user || isTogglingRepost) return;

      setIsTogglingRepost(true);
      const newReposted = !isReposted;
      setIsReposted(newReposted);
      updatePost(postId, { repostsCount: currentCount + (newReposted ? 1 : -1) });

      try {
        const { success } = await toggleRepostService(postId, user.uid);
        if (!success) {
          setIsReposted(!newReposted);
          updatePost(postId, { repostsCount: currentCount });
        }
      } catch (err) {
        console.error("Gagal toggle repost:", err);
        setIsReposted(!newReposted);
        updatePost(postId, { repostsCount: currentCount });
      } finally {
        setIsTogglingRepost(false);
      }
    },
    [user, postId, isReposted, isTogglingRepost, updatePost],
  );

  // ─── Fetch Comments ───────────────────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true);
    try {
      const { data } = await getCommentsService(postId);
      if (data) setComments(data);
    } catch (err) {
      console.error("Gagal fetch komentar:", err);
    } finally {
      setIsLoadingComments(false);
    }
  }, [postId]);

  // ─── Add Comment ──────────────────────────────────────────────────────────
  const addComment = useCallback(
    async (content: string) => {
      if (!user) return;

      const author = {
        uid: user.uid,
        username: user.username,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isVerified: user.isVerified,
      };

      setCommentError(null);

      try {
        const { success, data } = await addCommentService(postId, content, author);
        if (success && data) {
          const newComment: Comment = {
            id: data.id,
            postId,
            content,
            author,
            createdAt: Timestamp.now(),
          };
          setComments((prev) => [newComment, ...prev]);
          updatePost(postId, { commentsCount: data.commentsCount });
        }
      } catch (err) {
        console.error("Gagal menambah komentar:", err);
        setCommentError("Gagal mengirim komentar, coba lagi.")
      }
    },
    [user, postId, updatePost],
  );

  return {
    isLiked,
    isReposted,
    isTogglingLike,
    isTogglingRepost,
    comments,
    isLoadingComments,
    toggleLike,
    toggleRepost,
    fetchComments,
    addComment,
    commentError
  };
};
