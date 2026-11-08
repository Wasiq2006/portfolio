import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { ThemeContext, type RevealOrigin, type Theme } from '@/hooks/useTheme';

const STORAGE_KEY = 'theme';
const REVEAL_DURATION_MS = 650;
// Fast start, long gentle settle: the circle covers most of the screen quickly
// and eases into the far corners instead of stopping abruptly.
const REVEAL_EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';

const readSavedTheme = (): Theme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'midnight-indigo' ? 'midnight-indigo' : 'light';
  } catch {
    return 'light';
  }
};

const applyThemeClass = (theme: Theme) => {
  document.documentElement.classList.toggle('midnight-indigo', theme === 'midnight-indigo');
};

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);
  const [isAnimating, setIsAnimating] = useState(false);
  const themeRef = useRef(theme);
  const busy = useRef(false);

  useEffect(() => {
    themeRef.current = theme;
    applyThemeClass(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit.
    }
  }, [theme]);

  const toggleTheme = useCallback((origin?: RevealOrigin) => {
    if (busy.current) return;
    const next: Theme = themeRef.current === 'light' ? 'midnight-indigo' : 'light';

    // No View Transitions support, or the user asked for less motion:
    // swap right away and let the CSS colour transitions soften it.
    if (!document.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    busy.current = true;
    setIsAnimating(true);
    const root = document.documentElement;

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    // Distance to the farthest corner, so the circle ends exactly off-screen.
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      // The browser has captured the old page; apply the new theme synchronously.
      // Freezing colour transitions in the same step means one style recalc
      // instead of two, and the revealed area is fully in the new theme rather
      // than fading inside the circle.
      root.classList.add('theme-switching');
      applyThemeClass(next);
      flushSync(() => setTheme(next));
    });

    transition.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: REVEAL_DURATION_MS, easing: REVEAL_EASING, pseudoElement: '::view-transition-new(root)' }
        ).finished
      )
      .catch(() => {
        // Transition skipped (e.g. tab hidden); the theme is still applied.
      })
      .finally(() => {
        root.classList.remove('theme-switching');
        busy.current = false;
        setIsAnimating(false);
      });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, isAnimating }), [theme, toggleTheme, isAnimating]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
