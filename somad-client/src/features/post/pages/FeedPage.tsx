// features/posts/pages/FeedPage.tsx
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { CreatePostForm } from '../components/CreatePostForm';
import { PostList }       from '../components/PostList';
import { PAGE_TITLES } from '@/shared/constant/seo';

export const FeedPage = () => {
  useDocumentTitle(PAGE_TITLES.FEED);
  return (
    <div className="flex flex-col gap-4">
      {/* Form buat post */}
      <CreatePostForm />

      {/* Feed */}
      <PostList />
    </div>
  );
};

export default FeedPage;