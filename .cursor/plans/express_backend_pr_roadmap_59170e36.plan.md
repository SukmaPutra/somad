---
name: Express Backend PR Roadmap
overview: Susun roadmap PR bertahap untuk memperkuat backend Express pada modul post/comment berdasarkan kondisi kode saat ini, sambil menjaga sinkronisasi kontrak API dengan frontend.
todos:
  - id: pr1-contract-cleanup
    content: Rapikan kontrak response post/comment (field naming, pagination, boolean flags) agar konsisten backend-frontend.
    status: completed
  - id: pr2-missing-crud
    content: Implement endpoint edit post dan edit/delete comment dengan ownership check + validasi zod.
    status: completed
  - id: pr3-error-standard
    content: Standarisasi error handling melalui middleware global dan status code mapping.
    status: completed
  - id: pr4-backend-tests
    content: Tambahkan integration test untuk flow inti post/comment termasuk negative authorization cases.
    status: completed
  - id: pr5-performance-index
    content: Optimasi query feed/comment dan tambahkan index DB pada kolom yang sering diakses.
    status: completed
isProject: false
---

# Roadmap PR Backend Express

## Prioritas PR (urut belajar + impact)

1. **Stabilkan kontrak API Post & Comment**

- Rapikan konsistensi response shape (`pagination.totalPages`, `author.id/uid`, `avatarUrl/imageUrl`, flag `liked/reposted`) agar tidak ada typo/alias sementara.
- Samakan schema dan formatter di backend supaya frontend tidak perlu workaround.
- File utama:
  - [somad-api/src/modules/posts/posts.service.ts](somad-api/src/modules/posts/posts.service.ts)
  - [somad-api/src/modules/posts/posts.schema.ts](somad-api/src/modules/posts/posts.schema.ts)
  - [somad-api/src/modules/comments/comments.service.ts](somad-api/src/modules/comments/comments.service.ts)

1. **Tambah endpoint edit post & hapus/edit comment**

- Buat endpoint REST minimum CRUD yang belum ada: `PATCH /posts/:id`, `PATCH /posts/:id/comments/:commentId`, `DELETE /posts/:id/comments/:commentId`.
- Wajibkan ownership check (author-only) + validasi input zod.
- File utama:
  - [somad-api/src/modules/posts/posts.route.ts](somad-api/src/modules/posts/posts.route.ts)
  - [somad-api/src/modules/posts/posts.controller.ts](somad-api/src/modules/posts/posts.controller.ts)
  - [somad-api/src/modules/comments/comments.route.ts](somad-api/src/modules/comments/comments.route.ts)
  - [somad-api/src/modules/comments/comments.controller.ts](somad-api/src/modules/comments/comments.controller.ts)

1. **Harden error handling & status code**

- Standarkan error envelope (`code`, `message`, `details`) dan mapping status (`400/401/403/404/409/500`).
- Pindahkan `try/catch` repetitif ke middleware error handler terpusat.
- File utama:
  - [somad-api/src/modules/posts/posts.controller.ts](somad-api/src/modules/posts/posts.controller.ts)
  - [somad-api/src/modules/comments/comments.controller.ts](somad-api/src/modules/comments/comments.controller.ts)
  - middleware error global (buat/rapikan file middleware)

1. **Tambah test backend (wajib untuk PR berikutnya)**

- Mulai dari integration test untuk flow penting: create post, get feed, toggle like, create comment, delete forbidden.
- Pastikan test mencakup validasi zod + authorization.
- File target: folder test untuk modul post/comment (sesuai struktur test project kamu).

1. **Perkuat query & performa feed**

- Review query `findMany/count` dan pilih field seperlunya; tambah index DB pada kolom akses sering (`postId`, `authorId`, `createdAt`, `repostId`).
- Verifikasi pagination dan sorting tetap stabil di data besar.
- File utama:
  - [somad-api/src/modules/posts/posts.service.ts](somad-api/src/modules/posts/posts.service.ts)
  - skema Prisma (file schema prisma project)

## Rekomendasi urutan merge

- **PR-1:** API contract cleanup (kecil, aman, cepat diverifikasi)
- **PR-2:** Edit/Delete endpoints + ownership
- **PR-3:** Global error handling refactor
- **PR-4:** Integration tests untuk post/comment
- **PR-5:** Performance & DB indexing

## Kriteria selesai per PR

- Endpoint terdokumentasi (request/response/error).
- Validasi input + authz diuji minimal happy path + 1-2 negative cases.
- Frontend tidak lagi butuh penyesuaian sementara untuk response backend.
