// features/posts/index.ts

export {FeedPage} from './pages/FeedPage';
export { PostCard }       from './components/PostCard';
export { PostList }       from './components/PostList';
export { CreatePostForm } from './components/CreatePostForm';
export { usePostStore }   from './store/postStore';
export { usePosts }       from './hooks/usePosts';
export type { Post, Comment } from './types/post.types';