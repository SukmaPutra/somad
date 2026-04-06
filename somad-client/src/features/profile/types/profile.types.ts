// features/profile/types/profile.types.ts
import type { UserProfile } from '@/features/auth/types/auth.types';
import type { Post } from '@/features/post/types/post.types';

export interface FollowRecord {
  followerId:  string;
  followingId: string;
  createdAt:   string;
}

export interface ProfileState {
  profile:     UserProfile | null;
  posts:       Post[];
  isLoading:   boolean;
  isLoadingPosts: boolean;
  error:       string | null;
  isFollowing: boolean;
}

export interface ProfileActions {
  setProfile:      (profile: UserProfile | null) => void;
  setPosts:        (posts: Post[]) => void;
  /** Sinkron dengan postStore saat like/repost dari halaman profil */
  updatePost:      (id: string, data: Partial<Post>) => void;
  setLoading:      (isLoading: boolean) => void;
  setLoadingPosts: (isLoading: boolean) => void;
  setError:        (error: string | null) => void;
  setIsFollowing:  (isFollowing: boolean) => void;
  reset:           () => void;
}

export interface EditProfilePayload {
  displayName: string;
  username:    string;
  bio:         string;
  photoFile?:  File | null;
}