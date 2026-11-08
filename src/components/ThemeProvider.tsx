import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from '@/hooks/useTheme';

const STORAGE_KEY = 'theme';

const readSavedTheme = (): Theme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'midnight-indigo' ? 'midnight-indigo' : 'light';
  } catch {
    return 'light';
  }
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  const [isAnimating, setIsAnimating] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('midnight-indigo', theme === 'midnight-indigo');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }, [theme]);

  // Clear pending timers if the provider ever unmounts mid-transition.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toggleTheme = useCallback(() => {
    // Ignore clicks while a transition is already running.
    if (timers.current.length) return;
    setIsAnimating(true);
    // Swap the theme at the midpoint, while the overlay covers the screen.
    timers.current.push(
      window.setTimeout(() => {
        setTheme((prev) => (prev === 'light' ? 'midnight-indigo' : 'light'));
      }, 300),
      window.setTimeout(() => {
        setIsAnimating(false);
        timers.current = [];
      }, 600)
    );
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, isAnimating }), [theme, toggleTheme, isAnimating]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
