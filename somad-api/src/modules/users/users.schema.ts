import z from "zod";

export const usernameSchema = z.object ({
    username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore')
})

export const updateProfileSchema = z.object ({
    name: z.string().min(1).max(50).optional(),
    bio: z.string().max(160, 'Bio maksimal 160 karakter').optional(),
    avararUrl: z.string().url('URL tidak valid').optional(),
    coverUrl: z.string().url('URL cover tidak valid').optional(),
})

export const userIdSchema = z.object ({
    id: z.string().cuid('ID user tidak valid'),
}) 

export type UsernameInput = z.infer<typeof usernameSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UserIdInput = z.infer<typeof userIdSchema>