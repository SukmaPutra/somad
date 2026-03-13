// shared/constants/index.ts

export const APP_NAME = 'Somad';

export const LIMITS = {
  POST_MAX_CHARS:    500,
  COMMENT_MAX_CHARS: 280,
  BIO_MAX_CHARS:     160,
  USERNAME_MIN:      3,
  USERNAME_MAX:      20,
  DISPLAY_NAME_MAX:  50,
  FEED_PAGE_SIZE:    10,    // jumlah post per load
  NOTIF_PAGE_SIZE:   20,
} as const;

export const STORAGE_KEYS = {
  THEME:       'somad_theme',
  AUTH_TOKEN:  'somad_auth',
  DRAFT_POST:  'somad_draft_post',
} as const;

export const FIRESTORE_COLLECTIONS = {
  USERS:         'users',
  POSTS:         'posts',
  COMMENTS:      'comments',
  LIKES:         'likes',
  FOLLOWS:       'follows',
  NOTIFICATIONS: 'notifications',
  MESSAGES:      'messages',
  THREADS:       'threads',
} as const;