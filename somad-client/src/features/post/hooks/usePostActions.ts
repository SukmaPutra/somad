// features/posts/hooks/usePostActions.ts
import { useCallback, useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { usePostStore } from "../store/postStore";
import { toggleLikeService, addCommentService, getCommentsService, toggleRepostService } from "../services/postService";
import type { Comment, Post } from "../types/post.types";

export const usePostActions = (post: Post) => {
  const postId = post.id
  const { user } = useAuthStore();
  const { updatePost } = usePostStore();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isReposted, setIsReposted] = useState(post.isReposted);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [isTogglingRepost, setIsTogglingRepost] = useState(false); // ← tambah ini
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // ─── Like ────────────────────────────────────────────────────────────────
  const toggleLike = useCallback(
    async (currentCount: number) => {
      if (!user || isTogglingLike) return;

      setIsTogglingLike(true);
      const newLiked = !isLiked;
      setIsLiked(newLiked);

      updatePost(postId, 
        { _count: 
          { likes: currentCount + (newLiked ? 1 : -1), 
            comments: post._count.comments,
            reposts: post._count.reposts
          } 
        }); 

      try {
        const result = await toggleLikeService(postId); 
        if (!result.success) {
          setIsLiked(!newLiked);
          updatePost(postId, { _count: { likes: currentCount, comments: post._count.comments, reposts: post._count.reposts } });
        }
      } catch (err) {
        console.error("Gagal toggle like:", err);
        setIsLiked(!newLiked);
        updatePost(postId, { _count: { likes: currentCount, comments: post._count.comments, reposts: post._count.reposts } });
      } finally {
        setIsTogglingLike(false);
      }
    },
    [user, postId, isLiked, isTogglingLike, updatePost],
  );

 // ─── Fetch Comments ───────────────────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true);
    try {
      const { data } = await getCommentsService(postId); // ← fix: postId bukan post
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

      setCommentError(null);

      try {
        const { success, data } = await addCommentService(postId, content);
        if (success && data) {
          const newComment: Comment = {
            id: data.id,
            postId,
            content,
            author: {
              uid: user.uid,
              username: user.username,
              name: user.name,
              imageUrl: user.avatarUrl,
              isVerified: user.isVerified,
            },
            createdAt: data.createdAt,
          };
          setComments((prev) => [newComment, ...prev]);
          updatePost(postId, { _count: { likes: post._count.likes, comments: post._count.comments + 1, reposts: post._count.reposts } });
        }
      } catch (err) {
        console.error("Gagal menambah komentar:", err);
        setCommentError("Gagal mengirim komentar, coba lagi.");
      }
    },
    [user, postId, updatePost],
  );

  // ─── Add Repost ──────────────────────────────────────────────────────────
const toggleRepost = useCallback(
  async (currentCount: number) => {
    if (!user || isTogglingRepost) return;

    setIsTogglingRepost(true);
    const newReposted = !isReposted;
    setIsReposted(newReposted);
    updatePost(postId, {
      isReposted: newReposted,
      _count: {
        likes: post._count.likes,
        comments: post._count.comments,
        reposts: currentCount + (newReposted ? 1 : -1),
      },
    });

    try {
      const result = await toggleRepostService(postId);
      if (!result.success) {
        setIsReposted(!newReposted);
        updatePost(postId, {
          isReposted: !newReposted,
          _count: {
            likes: post._count.likes,
            comments: post._count.comments,
            reposts: currentCount,
          },
        });
      }
    } catch (err) {
      console.error("Gagal toggle repost:", err);
      setIsReposted(!newReposted);
      updatePost(postId, {
        isReposted: !newReposted,
        _count: {
          likes: post._count.likes,
          comments: post._count.comments,
          reposts: currentCount,
        },
      });
    } finally {
      setIsTogglingRepost(false);
    }
  },
  [user, postId, isReposted, isTogglingRepost, updatePost, post],
);

  return {
    isLiked,
    isReposted,
    isTogglingLike,
    isTogglingRepost, // ← tambah
    comments,
    isLoadingComments,
    toggleLike,
    toggleRepost,     // ← tambah
    fetchComments,
    addComment,
    commentError,
  };
};
