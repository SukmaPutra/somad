// features/posts/constants/postConstants.ts

export const POSTS_COLLECTION = "posts";
export const COMMENTS_SUBCOLLECTION = "comments";
export const LIKES_SUBCOLLECTION = "likes";
export const REPOSTS_SUBCOLLECTION = "reposts";

export const POST_MESSAGES = {
  CREATE_SUCCESS: "Postingan berhasil dibuat!",
  CREATE_ERROR:"Gagal membuat postingan. Coba lagi.",
  DELETE_SUCCESS: "Postingan berhasil digapus.",
  LIKE_SUCCESS: "Postingan disukai.",
  UNLIKE_SUCCESS: "Like dibatalkan.",
  REPOST_SUCCESS: "Berhasil direpost.",
  COMMENT_SUCCESS: "Komentar berhasil dikirim.",
} as const;
