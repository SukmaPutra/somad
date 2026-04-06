/** Kelas layout bersama agar Header, main, dan konten sejajar. */
export const LAYOUT = {
  contentMax: "max-w-2xl",
  /** Padding horizontal responsif + lebar + center */
  contentInner: "max-w-2xl w-full mx-auto px-4 sm:px-6",
  /** Ruang bawah untuk bottom nav + safe area (iOS); di lg sidebar menggantikan nav */
  mainBottomPadding:
    "pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-6",
} as const;
