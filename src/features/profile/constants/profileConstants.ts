// features/profile/constants/profileConstants.ts

export const FOLLOWS_COLLECTION = 'follows';
export const POSTS_COLLECTION = "posts"

export const PROFILE_MESSAGES = {
  UPDATE_SUCCESS:   'Profil berhasil diperbarui!',
  FOLLOW_SUCCESS:   'Kamu mengikuti pengguna ini.',
  UNFOLLOW_SUCCESS: 'Kamu berhenti mengikuti pengguna ini.',
  NOT_FOUND:        'Pengguna tidak ditemukan.',
} as const;