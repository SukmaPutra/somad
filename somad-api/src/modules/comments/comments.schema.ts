import z from "zod";

export const createCommentSchema = z.object({
    content: z
    .string({error: 'Komentar tidak boleh kosong'})
    .min(1, 'Komentar tidak boleh kosong')
    .max(280, 'Komentar maksimal 280 karakter'),
})

export const getCommentsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
})

export const updateCommentSchema = z.object({
    content: z
      .string({ error: 'Komentar tidak boleh kosong' })
      .min(1, 'Komentar tidak boleh kosong')
      .max(280, 'Komentar maksimal 280 karakter'),
})

export const commentIdSchema = z.object({
    commentId: z.string({ error: 'ID komentar tidak valid' }).cuid('ID komentar tidak valid'),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type GetCommentsInput = z.infer<typeof getCommentsSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>