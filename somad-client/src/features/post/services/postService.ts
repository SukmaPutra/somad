// features/posts/services/postService.ts

import type { Post, Comment } from "../types/post.types";
import apiClient from "@/core/api/client";

// ─── Tipe response dari backend ───────────────────────────────────────────────
interface FeedResponse {
  posts: Post[]
  pagination: {
    hasNext: boolean
    limit: number
    page: number
    totalPages: number
    total: number
  }
}

interface ToggleLikeResponse {
  liked: boolean;
}

interface ToggleRepostResponse {
  reposted: boolean;
}

interface PostEnvelope {
  message?: string;
  post: Post;
}

interface CommentEnvelope {
  message?: string;
  comment: Comment;
}

interface CommentsResponse {
  comments: Comment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

// Helper — bungkus response axios ke format { success, data, error }
// supaya semua hooks tidak perlu diubah
const ok = <T>(data: T) => ({ success: true as const, data, error: null });
const fail = (error: string) => ({ success: false as const, data: null, error });

// ─── Create Post ──────────────────────────────────────────────────────────────
export const createPostService = async (content: string, imageUrl: string | null) => {
  try {
    const { data } = await apiClient.post<PostEnvelope>("/posts", {
      content,
      ...(imageUrl && { imageUrl }),
    });

    return ok(data.post);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal membuat postingan';
    return fail(message);
  }
};

// ─── Get Post By ID ───────────────────────────────────────────────────────────
export const getPostByIdService = async (postId: string) => {
  try {
    const { data } = await apiClient.get<PostEnvelope>(`/posts/${postId}`);

    return ok(data.post);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Postingan tidak ditemukan';
    return fail(message);
  }
};

// ─── Get Feed (Paginated) ─────────────────────────────────────────────────────
export const getFeedService = async (page = 1, limit = 10) => {
  try {
    const { data } = await apiClient.get<FeedResponse>("/posts", {
      params: { page, limit },
    });

    return ok(data);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal memuat feed';
    return fail(message);
  }
};

// ─── Like / Unlike ────────────────────────────────────────────────────────────
export const toggleLikeService = async (postId: string) => {
  try {
    const { data } = await apiClient.post<ToggleLikeResponse>(`/posts/${postId}/like`);

    return ok(data);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal mengubah like';
    return fail(message);
  }
};

// ─── Add Comment ──────────────────────────────────────────────────────────────
export const addCommentService = async (postId: string, content: string) => {
  try {
    const { data } = await apiClient.post<CommentEnvelope>(`/posts/${postId}/comments`, { content });

    return ok(data.comment);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal menambah komentar';
    return fail(message);
  }
};

// ─── Get Comments ─────────────────────────────────────────────────────────────
export const getCommentsService = async (postId: string) => {
  try {
    const { data } = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments`);

    return ok(data.comments);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal memuat komentar';
    return fail(message);
  }
};

export const toggleRepostService = async (postId: string) => {
  try {
    const { data } = await apiClient.post<ToggleRepostResponse>(`/posts/${postId}/repost`);
    return ok(data);
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal mengubah repost';
    return fail(message);
  }
};
