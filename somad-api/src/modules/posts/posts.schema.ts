//somad-api\src\modules\posts\posts.schema.ts
import z from "zod";

export const createPostSchema = z.object({
  content: z
    .string({ error: 'Konten tidak boleh kosong' })
    .min(1, 'Konten tidak boleh kosong')
    .max(280, 'Konten maksimal 280 karakter'),
  imageUrl: z.string().url('URL gambar tidak valid').optional(),
})

export const updatePostSchema = z.object({
  content: z
    .string({ error: "Konten tidak boleh kosong" })
    .min(1, "Konten tidak boleh kosong")
    .max(280, "Konten maksimal 280 karakter")
    .optional(),
  imageUrl: z.string().url("URL gambar tidak valid").nullable().optional(),
}).refine(
  (data) => data.content !== undefined || data.imageUrl !== undefined,
  { message: "Minimal satu field harus diisi (content atau imageUrl)" }
);

export const getFeedSchema = z.object({           //z.coerce.number() dipakai karena query params selalu berupa string — Zod yang konversi otomatis ke number.
  page:z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
})

export const postIdSchema = z.object ({
  id: z.string({error: ' ID post tidak valid'}).cuid('ID post tidak valid'),
})


export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type GetFeedInput = z.infer<typeof getFeedSchema>
export type PostIdInput = z.infer<typeof postIdSchema>