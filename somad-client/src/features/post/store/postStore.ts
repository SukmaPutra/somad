// features/posts/store/postStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { PostState, PostActions, Post } from "../types/post.types";

type PostStore = PostActions & PostState;

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  hasMore: true,
  lastDoc: undefined,
};

export const usePostStore = create<PostStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setPosts: (posts: Post[]) => set({ posts }, false, "posts/setPosts"),

      appendPosts: (posts) => set((state) => ({ posts: [...state.posts, ...posts] }), false, "posts/appendPosts"),

      updatePost: (id, data) =>
        set(
          (state) => ({
            posts: state.posts.map((p) => (p.id === id ? { ...p, ...data } : p)),
          }),
          false,
          "posts/updatePost",
        ),

      removePost: (id) =>
        set(
          (state) => ({
            posts: state.posts.filter((p) => p.id !== id),
          }),
          false,
          "posts/removePost",
        ),

      prependPost: (post: Post) => set((state) => ({ posts: [post, ...state.posts] }), false, "posts/prependPost"),

      setLoading: (isLoading) => set({ isLoading }, false, "posts/setLoading"),
      setError: (error) => set({ error }, false, "posts/setError"),
      setHasMore: (hasMore) => set({ hasMore }, false, "posts/setHasMore"),
      setLastDoc: (lastDoc) => set({ lastDoc }, false, "posts/setLastDoc"),
      reset: () => set(initialState, false, "posts/reset"),
    }),
    { name: "PostStore" },
  ),
);
