// features/posts/hooks/usePostActions.ts
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProfileStore } from "@/features/profile/store/profileStore";
import { usePostStore } from "../store/postStore";
import { toggleLikeService, addCommentService, getCommentsService, toggleRepostService } from "../services/postService";
import type { Comment, Post } from "../types/post.types";

export const usePostActions = (post: Post) => {
  const postId = post.id
  const { user } = useAuthStore();
  const { updatePost } = usePostStore();
  const updateProfilePost = useProfileStore((s) => s.updatePost);

  const patchPost = useCallback(
    (id: string, data: Partial<Post>) => {
      updatePost(id, data);
      updateProfilePost(id, data);
    },
    [updatePost, updateProfilePost]
  );

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isReposted, setIsReposted] = useState(post.isReposted);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsReposted(post.isReposted);
  }, [post.id, post.isLiked, post.isReposted]);
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

      patchPost(postId, {
        isLiked: newLiked,
        _count: {
          likes: currentCount + (newLiked ? 1 : -1),
          comments: post._count.comments,
          reposts: post._count.reposts,
        },
      });

      try {
        const result = await toggleLikeService(postId); 
        if (!result.success) {
          setIsLiked(!newLiked);
          patchPost(postId, {
            isLiked: !newLiked,
            _count: {
              likes: currentCount,
              comments: post._count.comments,
              reposts: post._count.reposts,
            },
          });
        }
      } catch (err) {
        console.error("Gagal toggle like:", err);
        setIsLiked(!newLiked);
        patchPost(postId, {
          isLiked: !newLiked,
          _count: {
            likes: currentCount,
            comments: post._count.comments,
            reposts: post._count.reposts,
          },
        });
      } finally {
        setIsTogglingLike(false);
      }
    },
    [user, postId, isLiked, isTogglingLike, patchPost, post._count],
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
              uid: user.id,
              username: user.username,
              name: user.name,
              imageUrl: user.avatarUrl,
              isVerified: false,
            },
            createdAt: data.createdAt,
          };
          setComments((prev) => [newComment, ...prev]);
          patchPost(postId, { _count: { likes: post._count.likes, comments: post._count.comments + 1, reposts: post._count.reposts } });
        }
      } catch (err) {
        console.error("Gagal menambah komentar:", err);
        setCommentError("Gagal mengirim komentar, coba lagi.");
      }
    },
    [user, postId, patchPost, post._count],
  );

  // ─── Add Repost ──────────────────────────────────────────────────────────
const toggleRepost = useCallback(
  async (currentCount: number) => {
    if (!user || isTogglingRepost) return;

    setIsTogglingRepost(true);
    const newReposted = !isReposted;
    setIsReposted(newReposted);
    patchPost(postId, {
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
        patchPost(postId, {
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
      patchPost(postId, {
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
  [user, postId, isReposted, isTogglingRepost, patchPost, post],
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
