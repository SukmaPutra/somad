// core/context/ThemeContext.tsx
import { ReactNode } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { ThemeContext } from './ThemeContextStore';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeValue = useTheme();
  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};