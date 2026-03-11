// shared/components/ThemeToggle.tsx
import { useThemeContext } from '@/core/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full transition-colors hover:bg-(--color-card)"
    >
      {theme === 'dark'
        ? <Sun  size={20} className="text-yellow-200" />
        : <Moon size={20} className="text-slate-600"  />
      }
    </button>
  );
};