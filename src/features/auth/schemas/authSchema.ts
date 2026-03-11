// features/auth/schemas/authSchema.ts
import { z } from 'zod';
import { LIMITS } from '@/shared/constant';

// ─── Validation Rules ──────────────────────────────────────────────────────

export const VALIDATION_RULES = {
  EMAIL: {
    description: 'Gunakan email aktif, contoh: kamu@example.com',
  },
  USERNAME: {
    description: `${LIMITS.USERNAME_MIN}–${LIMITS.USERNAME_MAX} karakter. Huruf, angka, dan underscore saja.`,
    rules: [
      `Minimal ${LIMITS.USERNAME_MIN} karakter`,
      `Maksimal ${LIMITS.USERNAME_MAX} karakter`,
      'Hanya huruf (a–z), angka (0–9), dan underscore (_)',
      'Tidak boleh diawali angka atau underscore',
    ],
  },
  DISPLAY_NAME: {
    description: `Nama yang tampil ke pengguna lain. Maksimal ${LIMITS.DISPLAY_NAME_MAX} karakter.`,
  },
  STRONG_PASSWORD: {
    description: 'Password harus kuat dan tidak mudah ditebak.',
    rules: [
      'Minimal 8 karakter',
      'Mengandung minimal 1 huruf kapital (A–Z)',
      'Mengandung minimal 1 angka (0–9)',
      'Mengandung minimal 1 karakter spesial (!@#$%^&*...)',
    ],
  },
} as const;

// ─── Schemas ───────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    username: z
      .string()
      .min(LIMITS.USERNAME_MIN, `Username minimal ${LIMITS.USERNAME_MIN} karakter`)
      .max(LIMITS.USERNAME_MAX, `Username maksimal ${LIMITS.USERNAME_MAX} karakter`)
      .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Username harus diawali huruf, hanya boleh huruf, angka, dan underscore'),
    displayName: z
      .string()
      .min(1, 'Nama tampilan wajib diisi')
      .max(LIMITS.DISPLAY_NAME_MAX, `Nama maksimal ${LIMITS.DISPLAY_NAME_MAX} karakter`)
      .regex(/\S/, 'Nama tampilan tidak boleh hanya spasi'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

// Alias — dipakai oleh SignupForm.tsx
export const signupSchema = registerSchema;

// ─── Inferred types ────────────────────────────────────────────────────────

export type LoginFormData    = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Alias type — dipakai oleh SignupForm.tsx
export type SignupSchema = RegisterFormData;