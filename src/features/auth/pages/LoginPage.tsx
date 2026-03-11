// features/auth/pages/LoginPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {  EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLoginForm } from '../hooks/useAuthForm';
import { ROUTES } from '@/config/routes';
import type { LoginFormData } from '../schemas/authSchema';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';

export const LoginPage = () => {
  useDocumentTitle("Login ")
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="min-h-screen bg-[#070d14] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-125 h-100 bg-[#137fec]/10 rounded-full blur-[120px]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-95 bg-[#0f1f2e]/90 border border-[#1e293b] rounded-2xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center shadow-lg shadow-[#137fec]/30">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Selamat Datang</h1>
            <p className="text-[#475569] text-sm mt-1">Masukkan detail akunmu untuk melanjutkan.</p>
          </div>
        </div>

        {/* Error global */}
        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium text-[#94a3b8]">
              Email address
            </label>
            <div className={`flex items-center gap-2.5 bg-[#182534] border rounded-lg px-3 py-2.5
              transition-all duration-150
              focus-within:border-[#137fec]/50 focus-within:ring-1 focus-within:ring-[#137fec]/20
              ${errors.email ? 'border-rose-500/50' : 'border-[#1e293b]'}
            `}>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                disabled={isLoading}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-[#334155] focus:outline-none disabled:opacity-50"
                {...register('email')}
              />
              <Mail size={16} className="text-[#334155] shrink-0" />
            </div>
            {errors.email && (
              <p className="text-rose-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-medium text-[#94a3b8]">
              Password
            </label>
            <div className={`flex items-center gap-2.5 bg-[#182534] border rounded-lg px-3 py-2.5
              transition-all duration-150
              focus-within:border-[#137fec]/50 focus-within:ring-1 focus-within:ring-[#137fec]/20
              ${errors.password ? 'border-rose-500/50' : 'border-[#1e293b]'}
            `}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-[#334155] focus:outline-none disabled:opacity-50"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="text-[#334155] hover:text-[#64748b] transition-colors shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Lock size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <Link
              to={ROUTES.FORGOT_PASSWORD ?? '#'}
              className="text-xs text-[#137fec] hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4
              bg-[#137fec] hover:bg-[#0d66c2] text-white text-sm font-semibold
              rounded-lg transition-colors duration-150
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[#137fec] focus-visible:ring-offset-2
              focus-visible:ring-offset-[#0f1f2e]
              shadow-md shadow-[#137fec]/20 mt-1"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Masuk...
              </>
            ) : 'Masuk'}
          </button>

        </form>

        {/* Sign up link */}
        <p className="text-center text-[#475569] text-sm mt-6">
          Belum punya akun?{' '}
          <Link to={ROUTES.REGISTER} className="text-[#137fec] font-medium hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>

      {/* Footer hint */}
      <p className="relative mt-6 text-[#334155] text-xs">
        Butuh bantuan masuk?{' '}
        <Link to={ROUTES.HOME} className="hover:text-[#475569] transition-colors">Hubungi kami</Link>
      </p>

    </div>
  );
};

export default LoginPage;