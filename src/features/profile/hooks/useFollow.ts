// features/profile/hooks/useFollow.ts
import { useCallback } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProfileStore } from "../store/profileStore";
import { followUserService, unfollowUserService } from "../services/profileService";

export const useFollow = (targetUid: string) => {
  const { user, setUser } = useAuthStore();
  const { isFollowing, setIsFollowing, profile, setProfile } = useProfileStore();

  const toggleFollow = useCallback(async () => {
    if (!user || !profile) return;

    const newFollowing = !isFollowing;

    // ✅ Simpan snapshot sebelum update
    const prevFollowersCount = profile.followersCount;
    const prevFollowingCount = user.followingCount;

    // Optimistic update — profile target (followersCount)
    setIsFollowing(newFollowing);
    setProfile({
      ...profile,
      followersCount: profile.followersCount + (newFollowing ? 1 : -1),
    });

    // Optimistic update — user sendiri (followingCount) ← ini yang kurang
    setUser({
      ...user,
      followingCount: user.followingCount + (newFollowing ? 1 : -1),
    });

    const { success } = newFollowing ? await followUserService(user.uid, targetUid) : await unfollowUserService(user.uid, targetUid);


    // ✅ Revert pakai snapshot yang benar
  if (!success) {
    setIsFollowing(!newFollowing);
    setProfile({ ...profile, followersCount: prevFollowersCount });
    setUser({ ...user, followingCount: prevFollowingCount });
  }
}, [user, targetUid, isFollowing, profile]);

  return { isFollowing, toggleFollow };
};
