// features/posts/pages/PostDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePostDetail } from "../hooks/usePostDetail";
import { PostDetailImage } from "../components/detail/PostDetailImage";
import { PostDetailInfo } from "../components/detail/PostDetailInfo";
import { PostDetailComments } from "../components/detail/PostDetailComment";
import { PostActions } from "../components/PostActions";
import { LoadingSpinner } from "@/shared/components";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";
import { PAGE_TITLES } from "@/shared/constant/seo";
import { LAYOUT } from "@/app/layout/layoutTokens";

export const PostDetailPage = () => {
  useDocumentTitle(PAGE_TITLES.POST_DETAIL);

  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { post, isLoading, error } = usePostDetail(postId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] bg-(--color-bg)">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-(--color-bg) gap-4 px-4">
        <p className="text-(--color-text-muted) text-center">
          {error ?? "Post tidak ditemukan."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sky-400 hover:underline text-sm"
        >
          Kembali
        </button>
      </div>
    );
  }

  const hasImage = !!post.imageUrl;

  const backBar = (
    <div
      className="sticky top-0 z-10 border-b border-(--color-border) backdrop-blur-sm"
      style={{
        background: "color-mix(in srgb, var(--color-bg) 80%, transparent)",
      }}
    >
      <div className={`${LAYOUT.contentInner} py-3`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Kembali</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-(--color-bg)">
      {backBar}

      {hasImage ? (
        <div
          className="
            flex flex-col lg:flex-row
            lg:min-h-[min(720px,calc(100dvh-7rem))]
            lg:max-h-[calc(100dvh-7rem)]
          "
        >
          {/* Gambar — penuh lebar di mobile, panel kiri di desktop */}
          <div
            className="
            w-full lg:flex-1 lg:min-h-0
            bg-(--color-bg)
            border-b lg:border-b-0 lg:border-r border-(--color-border)
            flex flex-col
          "
          >
            <div className="lg:flex-1 lg:min-h-0 lg:flex lg:flex-col lg:h-full">
              <PostDetailImage post={post} />
            </div>
          </div>

          {/* Info + komentar */}
          <div
            className="
            w-full lg:w-96 lg:max-w-md lg:shrink-0
            flex flex-col min-h-0
            bg-(--color-surface)
            border-t lg:border-t-0 lg:border-l border-(--color-border)
            lg:max-h-[calc(100dvh-7rem)]
          "
          >
            <PostDetailInfo post={post} />

            <div className="px-4 py-3 border-b border-(--color-border)">
              <PostActions post={post} hideComments />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <PostDetailComments post={post} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`${LAYOUT.contentInner} py-6 flex flex-col gap-4`}>
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
