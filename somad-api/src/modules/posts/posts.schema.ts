import z from "zod";

export const createPostSchema = z.object({
  content: z
    .string({ error: 'Konten tidak boleh kosong' })
    .min(1, 'Konten tidak boleh kosong')
    .max(280, 'Konten maksimal 280 karakter'),
  imageUrl: z.string().url('URL gambar tidak valid').optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>