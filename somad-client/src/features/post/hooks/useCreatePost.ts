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
import { uploadImageToCloudinary } from '@/core/utils/cloudinaryService';



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

     let imageUrl: string | null = null;

    if (data.image) {
    imageUrl = await uploadImageToCloudinary(data.image);
    if (!imageUrl) {
      showToast('error', 'Gagal mengupload gambar');
      return;
    }
  }

  const { data: newPost, success, error } = await createPostService(
    data.content,
    imageUrl  // ← string URL, bukan File
  );

  if (!success || !newPost) {
    showToast('error', error ?? POST_MESSAGES.CREATE_ERROR);
    return;
  }

  prependPost(newPost);
  form.reset();
  showToast('success', POST_MESSAGES.CREATE_SUCCESS);
  onSuccess?.();

  }, [user, prependPost, showToast, form]); 

  return {
    form,
    submit: form.handleSubmit(submit),
    isSubmitting: form.formState.isSubmitting,
  };
};