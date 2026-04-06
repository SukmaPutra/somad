// features/profile/hooks/useProfile.ts
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfileStore } from '../store/profileStore';
import {
  getProfileByUsernameService,
  getUserPostsService,
} from '../services/profileService';

export const useProfile = (username: string) => {
  const { user: currentUser } = useAuthStore();
  const {
    profile, posts, isLoading, isLoadingPosts, error, isFollowing,
    setProfile, setPosts, setLoading, setLoadingPosts,
    setError, setIsFollowing, reset,
  } = useProfileStore();

  const isOwnProfile = currentUser?.username === username;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, isFollowing: following, success, error: err }
      = await getProfileByUsernameService(username);

    if (!success || !data) {
      setError(err);
      setLoading(false);
      return;
    }

    setProfile(data);
    if (!isOwnProfile) setIsFollowing(following);
    setLoading(false);

    setLoadingPosts(true);
    const postsResult = await getUserPostsService(data.username, 1, 10);
    if (postsResult.data?.posts) setPosts(postsResult.data.posts);  // ← guard
    setLoadingPosts(false);

  }, [username, isOwnProfile]);

  // pisah dua useEffect
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => reset();  // ← reset hanya saat unmount
  }, [reset]);

  return {
    profile, posts, isLoading, isLoadingPosts,
    error, isFollowing, isOwnProfile,
    refresh: loadProfile,
  };
};