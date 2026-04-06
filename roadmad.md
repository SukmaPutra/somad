---
name: Learning by Doing - Firebase to Express Migration
overview: Panduan praktik bertahap untuk migrasi fitur yang masih memakai Firebase (terutama profile/follow) ke Express, sambil membangun pemahaman arsitektur frontend-backend.
todos:
  - id: phase1-mapping-and-baseline
    content: Petakan fitur yang masih Firebase, pahami kontrak endpoint Express, dan siapkan baseline sebelum coding.
    status: pending
  - id: phase2-profile-service-migration
    content: Migrasikan profileService dari Firestore ke apiClient Express secara bertahap per fungsi.
    status: pending
  - id: phase3-hooks-and-ui-sync
    content: Sesuaikan hook useProfile dan useFollow agar sinkron dengan response backend dan optimistic update tetap aman.
    status: pending
  - id: phase4-contract-hardening-and-cleanup
    content: Bersihkan sisa dependency Firebase di profile flow dan rapikan adapter/mapping response agar konsisten.
    status: pending
  - id: phase5-verification-and-retrospective
    content: Uji end-to-end, kumpulkan error case, dan tulis catatan belajar dari hasil migrasi.
    status: pending
isProject: false
---

# Roadmap Belajar Migrasi Firebase ke Express (Learning by Doing)

## Fokus Task Saat Ini

Fitur yang masih bergantung pada Firebase dan jadi prioritas migrasi:

- `somad-client/src/features/profile/services/profileService.ts`
- `somad-client/src/features/profile/hooks/useProfile.ts`
- `somad-client/src/features/profile/hooks/useFollow.ts`

Area lain (auth dan post) sudah dominan pakai Express dan dipakai sebagai referensi gaya implementasi.

## Cara Belajar (Prinsip)

1. Ubah 1 fungsi, tes langsung, catat hasil.
2. Pakai backend contract sebagai sumber kebenaran, bukan asumsi dari frontend lama.
3. Tiap fase wajib punya "bukti jalan": screenshot/log respons atau checklist pass.
4. Kalau gagal, tulis hipotesis, perbaiki, lalu retest (bukan langsung lompat fase).

## Fase 1 - Mapping dan Baseline (Hari 1)

### Tujuan

Memahami kondisi awal sebelum perubahan agar kamu tahu apa yang rusak/berubah setelah migrasi.

### Praktik

- [ ] Catat semua fungsi Firebase di `profileService.ts`:
  - `getProfileByUsernameService`
  - `getUserPostsService`
  - `editProfileService`
  - `followUserService`
  - `unfollowUserService`
  - `checkIsFollowingService`
- [ ] Catat endpoint Express yang setara di backend users module.
- [ ] Jalankan aplikasi dan rekam baseline:
  - buka halaman profile
  - follow/unfollow user
  - edit profile
- [ ] Simpan catatan hasil baseline (berhasil/gagal + pesan error jika ada).

### Mini Challenge

Tulis tabel "Firestore -> Endpoint Express -> Payload -> Response penting".

### Hasil Pengerjaan Fase 1 (Current Repo)

#### Status Checklist

- [x] Catat fungsi Firebase di `profileService.ts`.
- [x] Identifikasi endpoint users di backend Express.
- [x] Tentukan fungsi pertama untuk migrasi.
- [ ] Jalankan baseline manual di browser (kamu eksekusi lokal).

#### Mapping Final (Berdasarkan Backend Saat Ini)

| Fungsi Lama (Client Firebase) | Endpoint Express Final | Bentuk Request | Bentuk Response Ringkas |
|---|---|---|---|
| `getProfileByUsernameService(username)` | `GET /api/users/:username` | param: `username`, auth bearer token | `{ user }` |
| `getUserPostsService(uid)` | `GET /api/users/:username/posts?page=1&limit=10` | param: `username`, query pagination | `{ posts, pagination }` |
| `editProfileService(uid, payload)` | `PATCH /api/users/profile` | body: `{ name?, bio?, avatarUrl?, coverUrl? }` | `{ message, user }` |
| `followUserService(...)` | `POST /api/users/:username/follow` | param: `username` target | `{ following: boolean, message }` |
| `unfollowUserService(...)` | `POST /api/users/:username/follow` (toggle endpoint sama) | param: `username` target | `{ following: boolean, message }` |
| `checkIsFollowingService(...)` | belum ada endpoint spesifik | sementara derive dari data lain | belum ada kontrak langsung |

#### Temuan Penting Sebelum Migrasi

1. Kontrak `editProfile` berbeda: frontend lama (`displayName`, `username`, `photoFile`) vs backend (`name`, `bio`, `avatarUrl`, `coverUrl`).
2. Identifier berbeda: flow lama pakai `uid`, backend users route pakai `username` untuk path.
3. Follow di backend adalah **toggle tunggal**, bukan follow/unfollow endpoint terpisah.
4. Belum ada endpoint langsung untuk `isFollowing`, jadi perlu strategi sementara di client.

#### Baseline Manual (Template Eksekusi)

```md
Tanggal:
Fase: 1 - Baseline Manual

Skenario 1 - Buka profile by username
- URL:
- Hasil (berhasil/gagal):
- Error message (jika ada):

Skenario 2 - Follow / Unfollow user
- Username target:
- Hasil tombol + counter:
- Error message (jika ada):

Skenario 3 - Edit profile
- Field yang diubah:
- Hasil update di UI:
- Error message (jika ada):
```

#### Keputusan Fase 2

Fungsi pertama yang dimigrasi: `getProfileByUsernameService`.

---

## Fase 2 - Migrasi Service Bertahap (Hari 2-3)

### Tujuan

Semua operasi profile/follow tidak lagi memanggil Firestore.

### Urutan Implementasi (wajib berurutan)

1. `getProfileByUsernameService` -> `GET /api/users/:username`
2. `getUserPostsService` -> `GET /api/users/:username/posts` (atau endpoint yang tersedia)
3. `editProfileService` -> `PATCH /api/users/profile`
4. `followUserService` / `unfollowUserService` / `checkIsFollowingService` -> endpoint follow Express

### Checklist Praktik

- [ ] Ganti import Firebase (`firebase/firestore`, `db`, `withFirestore`) dengan `apiClient`.
- [ ] Samakan return type agar hook existing tidak langsung rusak.
- [ ] Tangani error response backend jadi pesan user-friendly.
- [ ] Setelah migrasi tiap fungsi, langsung tes fitur terkait di UI.

### Aturan Belajar

- Jangan migrasi semua fungsi sekaligus.
- Commit mental model: "service = jembatan UI ke API", bukan tempat business logic berat.

---

## Fase 3 - Sinkronisasi Hook dan UI (Hari 3)

### Tujuan

`useProfile` dan `useFollow` tetap responsif, tidak false state, dan rollback saat request gagal berjalan benar.

### Checklist Praktik

- [ ] Sesuaikan call di `useProfile.ts` jika signature service berubah.
- [ ] Pastikan `checkIsFollowing` tidak menyebabkan flicker status tombol.
- [ ] Verifikasi optimistic update di `useFollow.ts`:
  - follow sukses -> counter naik stabil
  - unfollow sukses -> counter turun stabil
  - request gagal -> state rollback ke snapshot awal
- [ ] Pastikan loading dan error state tetap muncul sesuai kondisi.

### Mini Challenge

Buat 3 skenario manual:

1. follow berhasil
2. follow gagal karena unauthorized
3. profile tidak ditemukan

---

## Fase 4 - Kontrak Data dan Cleanup Dependency (Hari 4)

### Tujuan

Menghapus residu Firebase pada profile flow dan merapikan konsistensi model data.

### Checklist Praktik

- [ ] Cek apakah `profile.types.ts` masih butuh `Timestamp` dari Firebase.
- [ ] Cek apakah `formatters.ts` masih wajib ketergantungan `Timestamp`.
- [ ] Pisahkan util umum dari util khusus Firebase bila perlu.
- [ ] Rapikan response adapter agar field frontend konsisten (`uid`, `username`, `photoURL`, dst).
- [ ] Hapus import tidak terpakai yang terkait Firebase.

---

## Fase 5 - Verifikasi dan Catatan Belajar (Hari 5)

### Tujuan

Punya bukti kuat bahwa migrasi berhasil dan kamu paham alasan teknis di balik perubahan.

### Checklist Uji

- [ ] Uji happy path:
  - buka profile by username
  - edit profile
  - follow/unfollow
  - load user posts
- [ ] Uji negative case:
  - 401 unauthorized
  - 404 profile not found
  - 422/400 validation error
- [ ] Pastikan tidak ada request Firestore di network log untuk flow profile/follow.

### Template Catatan Belajar (isi tiap selesai sesi)

Gunakan template ini:

```md
Tanggal:
Fase:
Perubahan yang saya lakukan:
Error yang saya temui:
Cara saya memperbaiki:
Hal yang saya pahami hari ini:
PR kecil besok:
```

---

## Definition of Done (Task Ini Selesai Jika)

- [ ] `profileService.ts` tidak lagi menggunakan Firestore.
- [ ] Flow profile/follow berjalan penuh lewat Express API.
- [ ] Hook profile/follow stabil pada sukses dan gagal.
- [ ] Ketergantungan Firebase tersisa hanya yang memang masih dipakai fitur lain.
- [ ] Kamu punya catatan belajar minimal 5 entri (1 per fase/sesi).

## File Fokus

- Frontend:
  - `somad-client/src/features/profile/services/profileService.ts`
  - `somad-client/src/features/profile/hooks/useProfile.ts`
  - `somad-client/src/features/profile/hooks/useFollow.ts`
  - `somad-client/src/features/profile/types/profile.types.ts`
  - `somad-client/src/core/utils/formatters.ts`
- Backend referensi:
  - `somad-api/src/modules/users/users.route.ts`
  - `somad-api/src/modules/users/users.controller.ts`
  - `somad-api/src/modules/users/users.service.ts`

## Next Step Praktis Sekarang

Mulai dari Fase 1: buat tabel mapping Firestore ke endpoint Express, lalu migrasi 1 fungsi pertama (`getProfileByUsernameService`) dan tes langsung di UI.
