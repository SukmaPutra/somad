// features/auth/components/AuthForm.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, FormField, Alert } from '@/shared/components';
import { useAuth } from '../hooks/useAuth';
import { useLoginForm, useRegisterForm } from '../hooks/useAuthForm';
import type { LoginFormData, RegisterFormData } from '../schemas/authSchema';

// ─── Login Form ────────────────────────────────────────────────────────────

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useLoginForm();

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && <Alert type="error" message={error} />}

      <FormField
        label="Email"
        type="email"
        placeholder="Anda@email.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      <FormField
        label="Password"
        type="password"
        placeholder="Masukkan password"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        className="mt-2"
      >
        Masuk
      </Button>
    </form>
  );
};

// ─── Register Form ─────────────────────────────────────────────────────────

export const RegisterForm = () => {
  const { register: registerAuth, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useRegisterForm();

  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    await registerAuth(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {error && <Alert type="error" message={error} />}

      {/* Nama Tampilan */}
      <FormField
        label="Nama Tampilan"
        placeholder="Nama Anda"
        error={errors.displayName?.message}
        required
        {...register('displayName')}
      />

      {/* Username */}
      <FormField
        label="Username"
        placeholder="username_anda"
        error={errors.username?.message}
        hint="Hanya huruf, angka, dan underscore"
        required
        {...register('username')}
      />

      {/* Email */}
      <FormField
        label="Email"
        type="email"
        placeholder="Anda@email.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* Password — dengan toggle show/hide */}
      <div className="relative">
        <FormField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimal 8 karakter"
          error={errors.password?.message}
          required
          {...register('password')}
        />
        <TogglePasswordButton
          show={showPassword}
          onToggle={() => setShowPassword((p) => !p)}
          hasError={!!errors.password}
        />
      </div>

      {/* Konfirmasi Password — dengan toggle show/hide */}
      <div className="relative">
        <FormField
          label="Konfirmasi Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Ulangi password"
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword')}
        />
        <TogglePasswordButton
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((p) => !p)}
          hasError={!!errors.confirmPassword}
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        className="mt-2"
      >
        Daftar Sekarang
      </Button>
    </form>
  );
};

// ─── Helper ────────────────────────────────────────────────────────────────

interface TogglePasswordButtonProps {
  show: boolean;
  onToggle: () => void;
  hasError?: boolean;
}

const TogglePasswordButton = ({ show, onToggle, hasError }: TogglePasswordButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
    className={`
      absolute right-3 text-[#475569] hover:text-[#94a3b8] transition-colors
      ${hasError ? 'bottom-7' : 'bottom-2.5'}
    `}
  >
    {show ? <EyeOff size={15} /> : <Eye size={15} />}
  </button>
);