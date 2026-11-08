import { act, render, screen } from '@testing-library/react';
import ThemeProvider from '@/components/ThemeProvider';
import { useTheme } from '@/hooks/useTheme';

// Two separate consumers, like App (overlay) and ThemeToggle (button) in the real app.
const Overlay = () => {
  const { isAnimating } = useTheme();
  return isAnimating ? <div data-testid="overlay" /> : null;
};

const Toggle = () => {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    document.documentElement.className = '';
  });
  afterEach(() => vi.useRealTimers());

  it('shares animation state between components, so the overlay shows on toggle', () => {
    render(
      <ThemeProvider>
        <Overlay />
        <Toggle />
      </ThemeProvider>
    );

    expect(screen.queryByTestId('overlay')).toBeNull();
    act(() => screen.getByRole('button').click());
    expect(screen.getByTestId('overlay')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByRole('button')).toHaveTextContent('midnight-indigo');
    expect(document.documentElement).toHaveClass('midnight-indigo');
    expect(localStorage.getItem('theme')).toBe('midnight-indigo');

    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByTestId('overlay')).toBeNull();
  });

  it('ignores a second click while the transition is running', () => {
    render(
      <ThemeProvider>
        <Toggle />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole('button').click();
      screen.getByRole('button').click();
    });
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByRole('button')).toHaveTextContent('midnight-indigo');
  });

  it('throws a clear error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Toggle />)).toThrow('useTheme must be used inside <ThemeProvider>');
  });
});
