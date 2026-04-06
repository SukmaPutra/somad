// core/utils/formatters.ts
import { Timestamp } from 'firebase/firestore';

type DateLike =
  | Date
  | Timestamp
  | string
  | number
  | { toDate: () => Date }
  | { seconds: number }
  | null
  | undefined;

const isToDate = (value: unknown): value is { toDate: () => Date } => {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  );
};

const isSeconds = (value: unknown): value is { seconds: number } => {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'seconds' in value &&
    typeof (value as { seconds?: unknown }).seconds === 'number'
  );
};

export const formatRelativeTime = (date: DateLike): string => {
  let d: Date;

  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else if (isToDate(date)) {
    d = date.toDate();
  } else if (isSeconds(date)) {
    d = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    d = date;
  } else {
    return 'Baru saja';
  }

  if (Number.isNaN(d.getTime())) return 'Baru saja';

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

export const toDate = (value: unknown): Date => {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  if (isToDate(value)) return value.toDate();
  if (isSeconds(value)) return new Date(value.seconds * 1000);
  if (value instanceof Date) return value;
  return new Date();
};