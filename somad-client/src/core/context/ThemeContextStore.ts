import { createContext } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';

export type ThemeContextType = ReturnType<typeof useTheme>;

// Central store untuk ThemeContext supaya file provider/hook hanya mengekspor komponen/hook.
export const ThemeContext = createContext<ThemeContextType | null>(null);

