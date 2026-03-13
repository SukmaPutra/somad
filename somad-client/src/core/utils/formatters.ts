// core/utils/formatters.ts
import { Timestamp } from 'firebase/firestore';

export const formatRelativeTime = (date: Date | Timestamp | any): string => {
  let d: Date;

  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (date?.toDate) {
    d = date.toDate();
  } else if (date?.seconds) {
    d = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    d = date;
  } else {
    return 'Baru saja';
  }

  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60)     return 'Baru saja';
  if (seconds < 3600)   return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400)  return `${Math.floor(seconds / 3600)} jam lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;

  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const formatCount = (count: number = 0): string => {
  if (!count) return '0';
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000)     return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
};

export const formatUsername = (username: string): string => {
  return username.startsWith('@') ? username : `@${username}`;
};

export const toDate = (value: any): Date => {
  if (value instanceof Timestamp) return value.toDate();
  if (value?.toDate)              return value.toDate();
  if (value?.seconds)             return new Date(value.seconds * 1000);
  if (value instanceof Date)      return value;
  return new Date();
};