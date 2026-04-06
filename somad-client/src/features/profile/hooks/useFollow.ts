// features/profile/hooks/useFollow.ts
import { useCallback } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProfileStore } from "../store/profileStore";
import { toggleFollowService } from "../services/profileService";

export const useFollow = (targetUsername: string) => {
  const { user, setUser } = useAuthStore();
  const { isFollowing, setIsFollowing, profile, setProfile } = useProfileStore();

  const toggleFollow = useCallback(async () => {
    if (!user || !profile) return;

    const newFollowing = !isFollowing;

    const prevFollowersCount = profile._count?.followers ?? 0;
    const prevFollowingCount = user._count?.following ?? 0;

    // fix error 1 — eksplisit semua field, tidak pakai spread _count
    setIsFollowing(newFollowing);
    setProfile({
      ...profile,
      _count: {
        posts:     profile._count?.posts     ?? 0,
        followers: prevFollowersCount + (newFollowing ? 1 : -1),
        following: profile._count?.following ?? 0,
      },
    });
    setUser({
      ...user,
      _count: {
        posts:     user._count?.posts     ?? 0,
        followers: user._count?.followers ?? 0,
        following: prevFollowingCount + (newFollowing ? 1 : -1),
      },
    });

    const { data, success } = await toggleFollowService(targetUsername);

    if (!success) {
      setIsFollowing(!newFollowing);
      setProfile({
        ...profile,
        _count: {
          posts:     profile._count?.posts     ?? 0,
          followers: prevFollowersCount,
          following: profile._count?.following ?? 0,
        },
      });
      setUser({
        ...user,
        _count: {
          posts:     user._count?.posts     ?? 0,
          followers: user._count?.followers ?? 0,
          following: prevFollowingCount,
        },
      });
      return;
    }

    // fix error 2 — pastikan data ada dan punya field following
    if (data && typeof data.following === 'boolean') {
      setIsFollowing(data.following);
    }

  }, [user, targetUsername, isFollowing, profile, setIsFollowing, setProfile, setUser]);

  return { isFollowing, toggleFollow };
};