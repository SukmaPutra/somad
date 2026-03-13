// useCreatePost.ts
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { usePostStore } from '../store/postStore';
import { createPostService } from '../services/postService';
import { createPostSchema, type CreatePostData } from '../schemas/postSchema';
import { useToast } from '@/shared/hooks/useToast';
import { POST_MESSAGES } from '../constants/postConstants';


export const useCreatePost = (onSuccess?: () => void) => {
  const { user } = useAuthStore();
  const { prependPost } = usePostStore(); // ← hanya prependPost, hapus setPosts & posts
  const {showToast} = useToast();

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { content: '', image: null },
  });

  const submit = useCallback(async (data: CreatePostData) => {
    if (!user) return;

    const author = {
      uid:         user.uid,
      username:    user.username,
      displayName: user.displayName,
      photoURL:    user.photoURL,
      isVerified:  user.isVerified,
    };

    const { data: newPost, success, error } = await createPostService(
      data.content,
      author,
      data.image ?? null
    );

    if (!success || !newPost) {
      showToast('error', error ?? POST_MESSAGES.CREATE_ERROR)
      return};

    prependPost(newPost); // ← ganti dari setPosts([newPost, ...posts])
    form.reset();
    showToast('success', POST_MESSAGES.CREATE_SUCCESS)
    onSuccess?.();

  }, [user, prependPost]); // ← posts sudah tidak ada di sini

  return {
    form,
    submit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
  };
};