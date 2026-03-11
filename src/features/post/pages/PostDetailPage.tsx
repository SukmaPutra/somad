// features/posts/pages/PostDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePostDetail } from '../hooks/usePostDetail';
import { PostDetailImage } from '../components/detail/PostDetailImage';
import { PostDetailInfo } from '../components/detail/PostDetailInfo';
import { PostDetailComments } from '../components/detail/PostDetailComment';
import { PostActions } from '../components/PostActions';
import { LoadingSpinner } from '@/shared/components';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { PAGE_TITLES } from '@/shared/constant/seo';

export const PostDetailPage = () => {
  useDocumentTitle(PAGE_TITLES.POST_DETAIL)

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { post, isLoading, error } = usePostDetail(postId!);

 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--color-bg)">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-(--color-bg) gap-4">
        <p className="text-(--color-text-muted)">{error ?? 'Post tidak ditemukan.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sky-400 hover:underline text-sm"
        >
          Kembali
        </button>
      </div>
    );
  }

  const hasImage = !!post.imageURL;

  return (
    <div className="min-h-screen bg-(--color-bg)">

      {/* Back button */}
      <div
        className="sticky top-0 z-10 border-b border-(--color-border) px-4 py-3 backdrop-blur-sm"
        style={{ background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Kembali</span>
        </button>
      </div>

      {/* ─── Layout dengan gambar — split kiri kanan ─── */}
      {hasImage ? (
        <div className="flex h-[calc(100vh-53px)]">

          {/* Kiri — gambar */}
          <div className="flex-1 bg-(--color-bg)]">
            <PostDetailImage post={post} />
          </div>

          {/* Kanan — info + actions + komentar */}
          <div className="w-95 shrink-0 border-l border-(--color-border) flex flex-col overflow-hidden bg-(--color-surface)">
            <PostDetailInfo post={post} />

            <div className="px-4 py-3 border-b border-(--color-border)">
              <PostActions post={post} hideComments />
            </div>

            <div className="flex-1 overflow-hidden">
              <PostDetailComments post={post} />
            </div>
          </div>

        </div>
      ) : (
        /* ─── Layout tanpa gambar — single column ─── */
        <div className="max-w-xl mx-auto py-6 px-4 flex flex-col gap-4">
          <PostDetailInfo post={post} />

          <div className="border-b border-(--color-border) pb-3">
            <PostActions post={post} hideComments />
          </div>

          <PostDetailComments post={post} />
        </div>
      )}

    </div>
  );
};

export default PostDetailPage;