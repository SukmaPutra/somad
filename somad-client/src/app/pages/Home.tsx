// app/pages/Home.tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { Avatar } from '@/shared/components';
import { formatRelativeTime } from '@/core/utils/formatters';
import { Heart, Repeat2, MessageCircle, Lock, Sparkles, Zap } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_POSTS = [
  {
    id: '1',
    author: { displayName: 'Budi Santoso', username: 'budisantoso', photoURL: null, isVerified: true },
    content: 'Hari ini saya belajar React TypeScript dan rasanya luar biasa! Kalian harus coba. 🚀',
    imageURL: null,
    likesCount: 142, repostsCount: 38, commentsCount: 21,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    author: { displayName: 'Siti Rahayu', username: 'sitirahayu', photoURL: null, isVerified: false },
    content: 'Sunset di Bali hari ini sungguh memukau. Tidak ada kata-kata yang cukup untuk menggambarkannya. 🌅',
    imageURL: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    likesCount: 389, repostsCount: 72, commentsCount: 54,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    author: { displayName: 'Andi Wijaya', username: 'andiwijaya', photoURL: null, isVerified: false },
    content: 'Tips produktivitas: mulai hari dengan menulis 3 hal yang ingin kamu capai. Sederhana tapi efektif! ✍️',
    imageURL: null,
    likesCount: 217, repostsCount: 95, commentsCount: 33,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────
export const Logo = () => (
  <Link to={ROUTES.FEED} className="flex items-center gap-2.5 group">
    <div className="
      w-8 h-8 rounded-lg bg-[#137fec]
      flex items-center justify-center
      shadow-[0_0_12px_rgb(19_127_236/0.35)]
      group-hover:shadow-[0_0_20px_rgb(19_127_236/0.55)]
      transition-shadow duration-200
    ">
      <Zap size={16} className="text-white fill-white" />
    </div>
    <span className="font-bold text-lg tracking-tight text-(--color-text-primary)]">
      Somad
    </span>
  </Link>
);

// ─── Mock Post Card ───────────────────────────────────────────────────────────
const MockPostCard = ({ post }: { post: (typeof MOCK_POSTS)[0] }) => (
  <div className="surface-card rounded-xl p-4 flex flex-col gap-3">
    <div className="flex items-start gap-3">
      <Avatar
        src={post.author.photoURL}
        alt={post.author.displayName}
        size="md"
        isVerified={post.author.isVerified}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-(--color-text-primary)] text-sm">
            {post.author.displayName}
          </span>
          <span className="text-(--color-text-muted)] text-sm">
            @{post.author.username}
          </span>
          <span className="text-(--color-text-muted)] text-xs">·</span>
          <span className="text-(--color-text-muted)] text-xs">
            {formatRelativeTime(post.createdAt as any)}
          </span>
        </div>
        <p className="text-(--color-text-secondary)] text-sm mt-1 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>
    </div>

    {post.imageURL && (
      <img
        src={post.imageURL}
        alt="post"
        className="w-full rounded-lg object-cover max-h-64 border border-(--color-border)]"
      />
    )}

    <div className="flex items-center gap-4 pt-1 select-none pointer-events-none opacity-60">
      {[
        { icon: <Heart size={16} />, count: post.likesCount },
        { icon: <Repeat2 size={16} />, count: post.repostsCount },
        { icon: <MessageCircle size={16} />, count: post.commentsCount },
      ].map(({ icon, count }, i) => (
        <span key={i} className="flex items-center gap-1.5 text-sm text-(--color-text-muted)]">
          {icon}<span>{count}</span>
        </span>
      ))}
    </div>
  </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
export const Home = () => {
  useDocumentTitle("Somad | Sosial Media Website")
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text-primary)">

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-20 border-b border-(--color-border) backdrop-blur-md"
        style={{ background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

          <Logo />

          <div className="hidden md:flex items-center gap-6 text-sm text-(--color-text-muted)">
            <a href="#" className="hover:text-(--color-text-primary) transition-colors duration-150">
              Tentang Project
            </a>
            <a href="#" className="hover:text-(--color-text-primary) transition-colors duration-150">
              Fitur
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to={ROUTES.LOGIN}
              className="
                text-sm text-(--color-text-muted)
                hover:text-(--color-text-primary)
                px-4 py-2 rounded-lg
                hover:bg-(--color-surface)
                transition-all duration-150 font-medium
              "
            >
              Masuk
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="
                text-sm bg-[#137fec] hover:bg-[#0d66c2] text-white
                px-4 py-2 rounded-lg font-semibold
                shadow-[0_0_12px_rgb(19_127_236/0.3)]
                hover:shadow-[0_0_18px_rgb(19_127_236/0.45)]
                transition-all duration-150
              "
            >
              Daftar Gratis
            </Link>
          </div>

        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row items-center gap-16">

        {/* Teks kiri */}
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
          <span className="
            inline-flex self-center lg:self-start items-center gap-2
            bg-[#137fec]/10 border border-[#137fec]/25
            text-[#137fec] text-xs font-medium
            px-3 py-1 rounded-full w-fit
          ">
            <Sparkles size={12} /> Media sosial untuk semua
          </span>

          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Tempat berbagi{' '}
            <span className="text-gradient-brand">cerita</span>,{' '}
            <br className="hidden lg:block" />
            terhubung dengan{' '}
            <span className="text-gradient-brand">dunia</span>.
          </h1>

          <p className="text-(--color-text-secondary)] text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            Bagikan momen, ide, dan ceritamu. Temukan orang-orang yang peduli dengan hal yang sama denganmu.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link
              to={ROUTES.REGISTER}
              className="
                px-8 py-3 text-white text-sm font-semibold
                rounded-full text-center transition-all duration-200
                bg-[#137fec] hover:bg-[#0d66c2]
                shadow-[0_0_16px_rgb(19_127_236/0.35)]
                hover:shadow-[0_0_24px_rgb(19_127_236/0.5)]
              "
            >
              Mulai Sekarang — Gratis
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="
                px-8 py-3 text-sm font-medium rounded-full text-center
                border border-(--color-border)]
                text-(--color-text-secondary)]
                hover:bg-(--color-surface)]
                hover:text-(--color-text-primary)]
                transition-all duration-200
              "
            >
              Sudah punya akun? Masuk
            </Link>
          </div>

          <p className="text-(--color-text-muted)] text-sm">
            Bergabung bersama{' '}
            <span className="text-(--color-text-primary)] font-medium">saya</span>{' '}
            untuk melihat project ini berkembang!
          </p>
        </div>

        {/* Preview Feed kanan */}
        <div className="flex-1 w-full max-w-md relative">
          {/* Fade atas & bawah */}
          <div className="
            absolute top-0 left-0 right-0 h-8 z-10 rounded-t-xl
            bg-gradient-to-b from-(--color-bg)] to-transparent
          " />
          <div className="
            absolute bottom-0 left-0 right-0 h-40 z-10 rounded-b-xl
            bg-gradient-to-t from-(--color-bg)] via-[color-mix(in_srgb,var(--color-bg)_80%,transparent)] to-transparent
          " />

          {/* CTA overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="
                surface-card rounded-2xl px-5 py-3
                flex items-center gap-3 shadow-(--shadow-lg)]
              ">
                <Lock size={24} className="text-(--color-text-primary)]" />
                <div>
                  <p className="text-(--color-text-primary)] text-sm font-medium">
                    Daftar untuk melihat lebih
                  </p>
                  <p className="text-(--color-text-muted)] text-xs">Gratis selamanya</p>
                </div>
              </div>
              <Link
                to={ROUTES.REGISTER}
                className="
                  px-6 py-2 bg-[#137fec] hover:bg-[#0d66c2]
                  text-white text-sm font-medium rounded-full
                  transition-colors
                "
              >
                Buat Akun
              </Link>
            </div>
          </div>

          {/* Preview posts */}
          <div className="flex flex-col gap-3 overflow-hidden max-h-120 pointer-events-none select-none blur-[1px]">
            {MOCK_POSTS.map((post) => (
              <MockPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-(--color-border)] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-(--color-text-muted)] text-sm">
            © 2025 Somad. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-sm text-(--color-text-muted)]">
            {['Tentang', 'Privasi', 'Ketentuan'].map((item) => (
              <Link key={item} to="#" className="hover:text-(--color-text-primary)] transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;