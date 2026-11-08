import { createContext, useContext } from 'react';

export type Theme = 'light' | 'midnight-indigo';

/** Viewport point the theme reveal grows from (e.g. the toggle button's center). */
export interface RevealOrigin {
  x: number;
  y: number;
}

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (origin?: RevealOrigin) => void;
  /** True while the theme reveal animation is running. */
  isAnimating: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Read the shared theme state. Must be used under <ThemeProvider>, so every
 * caller sees the same state.
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};
