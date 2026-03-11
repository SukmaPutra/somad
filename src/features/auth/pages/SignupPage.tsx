// features/auth/pages/SignupPage.tsx
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { RegisterForm } from '../components/AuthForm';
import { ROUTES } from '@/config/routes';
import { APP_NAME } from '@/shared/constant/index';

export const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#070d14] flex items-center justify-center p-4 overflow-hidden relative">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-150 h-150 bg-[#137fec]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 w-125 h-125 bg-[#137fec]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-240 grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b] ">

        {/* ── Left: Branding ────────────────────────────────────── */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-linear-to-br from-[#0d1e30] to-[#0a1525] relative overflow-hidden min-h-160">
          {/* Decorative rings */}
          <div className="absolute top-20 right-20 w-75 h-75 rounded-full border border-[#137fec]/10" />
          <div className="absolute top-10 right-10 w-50 h-50 rounded-full border border-[#137fec]/10" />
          <div className="absolute bottom-15 left-15 w-60 h-60 rounded-full border border-[#137fec]/10" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#137fec] rounded-xl flex items-center justify-center shadow-lg shadow-[#137fec]/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">{APP_NAME}</span>
          </div>

          {/* Copy */}
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white leading-snug mb-3">
                Connect with friends,<br />share your world.
              </h2>
              <p className="text-[#64748b] text-base leading-relaxed">
                Join millions of people discovering new communities and sharing their daily moments.
              </p>
            </div>

            <ul className="space-y-3">
              {[
                'Buat postingan dan berbagi momen',
                'Terhubung dengan teman & komunitas',
                'Eksplorasi konten yang relevan',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#94a3b8]">
                  <CheckCircle2 size={16} className="text-[#137fec] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {['11', '47', '33'].map((id) => (
                  <img
                    key={id}
                    src={`https://i.pravatar.cc/32?img=${id}`}
                    alt="user avatar"
                    className="w-8 h-8 rounded-full border-2 border-[#0d1e30] object-cover"
                  />
                ))}
              </div>
              <span className="text-[#64748b] text-sm">
                Join <span className="text-white font-semibold">2M+</span> others
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Form ───────────────────────────────────────── */}
        <div className="flex flex-col justify-center bg-[#0f172a] px-8 py-12 md:px-12">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#137fec] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-white">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Buat akun baru</h1>
            <p className="text-[#475569] text-sm">Isi detail di bawah untuk memulai.</p>
          </div>

          <RegisterForm />

          <p className="text-center text-[#475569] text-sm mt-6">
            Sudah punya akun?{' '}
            <Link
              to={ROUTES.LOGIN}
              className="text-[#137fec] hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;