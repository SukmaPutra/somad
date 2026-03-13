// features/profile/schemas/profileSchema.ts
import { z } from 'zod';
import { LIMITS } from '@/shared/constant';

export const editProfileSchema = z.object({
    displayName: z
        .string()
        .min(1, { message: 'Display name is required' })
        .max(LIMITS.DISPLAY_NAME_MAX, `Maksimal ${LIMITS.DISPLAY_NAME_MAX} karakter`),
    username: z
        .string()
        .min(LIMITS.USERNAME_MIN, `Minimal ${LIMITS.USERNAME_MIN} karakter`)
        .max(LIMITS.USERNAME_MAX, `Maksimal ${LIMITS.USERNAME_MAX} karakter`)
        .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya huruf, angka, dan underscores'),
    bio: z
        .string()
        .max(LIMITS.BIO_MAX_CHARS, `Maksimal ${LIMITS.BIO_MAX_CHARS} karakter`)
        .optional(),
    photoFile: z
        .instanceof(File)
        .optional().nullable(),
    });

export type EditProfileFormData = z.infer<typeof editProfileSchema>;