// config/routes.ts

export const ROUTES = {
  // Public - bisa diakses tanpa login
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected - Feed & Explore
  FEED: '/feed',
  EXPLORE: '/explore',

  // Protected - Post
  POST_DETAIL: '/post/:postId',

  // Protected - Profile
  PROFILE: '/:username',                          // contoh: /johndoe
  PROFILE_FOLLOWERS: '/:username/followers',
  PROFILE_FOLLOWING: '/:username/following',

  // Protected - Notifikasi & Pesan
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  MESSAGE_THREAD: '/messages/:threadId',

  // Protected - Settings
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_PRIVACY: '/settings/privacy',

  // Utility
  NOT_FOUND: '*',
} as const;

// Helper dynamic route
// Contoh: generatePath(ROUTES.PROFILE, { username: 'budi' }) → '/budi'
// Contoh: generatePath(ROUTES.POST_DETAIL, { postId: 'abc123' }) → '/post/abc123'
export const generatePath = (
  path: string,
  params: Record<string, string>
): string => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value),
    path
  );
};