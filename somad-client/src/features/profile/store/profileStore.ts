// features/profile/store/profileStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Post } from '@/features/post/types/post.types';
import type { ProfileState, ProfileActions } from '../types/profile.types';


type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState ={
    profile:        null,
    posts:          [],
    isLoading:      false,
    isLoadingPosts: false,
    error:          null,
    isFollowing:    false,
};

export const useProfileStore = create<ProfileStore>()(
    devtools((set) => ({
        ...initialState,

        setProfile:      (profile)     => set({ profile },     false, 'profile/setProfile'),
      setPosts:        (posts)       => set({ posts },       false, 'profile/setPosts'),
      updatePost:      (id, data)    =>
        set(
          (state) => ({
            posts: state.posts.map((p: Post) =>
              p.id === id ? { ...p, ...data } : p
            ),
          }),
          false,
          'profile/updatePost'
        ),
      setLoading:      (isLoading)   => set({ isLoading },   false, 'profile/setLoading'),
      setLoadingPosts: (isLoadingPosts) => set({ isLoadingPosts }, false, 'profile/setLoadingPosts'),
      setError:        (error)       => set({ error },       false, 'profile/setError'),
      setIsFollowing:  (isFollowing) => set({ isFollowing }, false, 'profile/setIsFollowing'),
      reset:           ()            => set(initialState,    false, 'profile/reset'),
    }),
    { name: 'ProfileStore' }
    )
);
