import { useEffect, useRef } from "react";

interface UseDocumentTitleOptions {
  /**
   * Jika `true`, judul akan dikembalikan ke judul sebelumnya
   * saat komponen di-unmount.
   * @default false
   */
  restoreOnUnmount?: boolean;
}

/**
 * Hook untuk mengatur `document.title` secara dinamis.
 *
 * @param title - Judul yang akan ditampilkan di tab browser.
 * @param options - Opsi tambahan.
 *
 * @example
 * useDocumentTitle("Halaman Beranda");
 * useDocumentTitle("Profil Pengguna", { restoreOnUnmount: true });
 */

function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const { restoreOnUnmount = false } = options;
  const previousTitleRef = useRef<string>(document.title);

  useEffect(() => {
    if (!title) return;

    // Simpan judul sebelumnya sebelum mengubahnya
    previousTitleRef.current = document.title;
    document.title = title;

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitleRef.current;
      }
    };
  }, [title, restoreOnUnmount]);
}

export default useDocumentTitle;