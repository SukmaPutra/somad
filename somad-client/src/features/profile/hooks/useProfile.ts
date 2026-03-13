// features/profile/hooks/useProfile.ts
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useProfileStore } from '../store/profileStore';
import {
  getProfileByUsernameService,
  getUserPostsService,
  checkIsFollowingService,
} from '../services/profileService';

export const useProfile = (username: string) => {
  const { user: currentUser }  = useAuthStore();
  const {
    profile, posts, isLoading, isLoadingPosts, error, isFollowing,
    setProfile, setPosts, setLoading, setLoadingPosts,
    setError, setIsFollowing, reset,
  } = useProfileStore();

  const isOwnProfile = currentUser?.username === username;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, success, error: err } = await getProfileByUsernameService(username);
    if (!success || !data) {
      setError(err);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);

    // Load posts & follow status secara paralel
    setLoadingPosts(true);
    const [postsResult, followResult] = await Promise.all([
      getUserPostsService(data.uid),
      !isOwnProfile && currentUser
        ? checkIsFollowingService(currentUser.uid, data.uid)
        : Promise.resolve({ data: false, success: true, error: null }),
    ]);

    if (postsResult.data) setPosts(postsResult.data);
    if (followResult.data !== null) setIsFollowing(followResult.data as boolean);
    setLoadingPosts(false);
  }, [username, currentUser]);

  useEffect(() => {
    loadProfile();
    return () => reset();
  }, [username]);

  return {
    profile, posts, isLoading, isLoadingPosts,
    error, isFollowing, isOwnProfile,
    refresh: loadProfile,
  };
};