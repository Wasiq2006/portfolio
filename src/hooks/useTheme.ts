import { createContext, useContext } from 'react';

export type Theme = 'light' | 'midnight-indigo';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  /** True while the full-screen disk transition overlay is playing. */
  isAnimating: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Read the shared theme state. Must be used under <ThemeProvider>, so every
 * caller (App's overlay, ThemeToggle, ...) sees the same state.
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};
