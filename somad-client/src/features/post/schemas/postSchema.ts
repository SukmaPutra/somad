// features/posts/schemas/postSchema.ts

import {z} from 'zod';
import { LIMITS } from '@/shared/constant';

export const createPostSchema = z.object({
    content: z
    .string()
    .min(1, 'Postingan tibak boleh kosong')
    .max(LIMITS.POST_MAX_CHARS, `Maksimal ${LIMITS.POST_MAX_CHARS} karakter`),

    image: z
    .instanceof(File)
    .optional()
    .nullable(),
})

export const createCommentSchema = z.object({
    content: z
    .string()
    .min(1, 'Komentar tidak boleh kosong')
    .max(LIMITS.COMMENT_MAX_CHARS, `Maksimal ${LIMITS.COMMENT_MAX_CHARS} karakter`),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;


