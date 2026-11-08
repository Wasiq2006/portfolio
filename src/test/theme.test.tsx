import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

vi.mock('@/hooks/useSoundEffects', () => ({ playClick: vi.fn(), playHover: vi.fn() }));

// Separate consumer, like any themed component elsewhere in the tree.
const ThemeName = () => <span data-testid="theme">{useTheme().theme}</span>;

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeName />
      <ThemeToggle />
    </ThemeProvider>
  );

const root = document.documentElement;

/** Fake View Transitions: run the update now, resolve the animation when we say so. */
const mockViewTransitions = () => {
  let finishAnimation!: () => void;
  const animate = vi.fn(() => ({ finished: new Promise<void>((r) => (finishAnimation = r)) }));
  const start = vi.fn((update: () => void) => {
    update();
    return { ready: Promise.resolve(), finished: Promise.resolve(), updateCallbackDone: Promise.resolve() };
  });
  Object.assign(document, { startViewTransition: start });
  Object.assign(root, { animate });
  return { start, animate, finish: () => finishAnimation() };
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    root.className = '';
  });
  afterEach(() => {
    delete (document as { startViewTransition?: unknown }).startViewTransition;
    delete (root as { animate?: unknown }).animate;
  });

  it('switches instantly when View Transitions are unsupported', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByTestId('theme')).toHaveTextContent('midnight-indigo');
    expect(root).toHaveClass('midnight-indigo');
    expect(localStorage.getItem('theme')).toBe('midnight-indigo');
  });

  it('reveals the new theme in a circle growing from the toggle button', async () => {
    const vt = mockViewTransitions();
    renderToggle();
    vi.spyOn(screen.getByRole('button'), 'getBoundingClientRect').mockReturnValue({
      left: 90, top: 10, width: 20, height: 20,
    } as DOMRect);

    fireEvent.click(screen.getByRole('button'));

    // New theme applied inside the transition callback, colour transitions frozen.
    expect(vt.start).toHaveBeenCalledTimes(1);
    expect(root).toHaveClass('midnight-indigo', 'theme-switching');
    expect(screen.getByTestId('theme')).toHaveTextContent('midnight-indigo');

    await act(async () => {}); // let `ready` resolve
    const [keyframes, options] = vt.animate.mock.calls[0] as unknown as [
      { clipPath: string[] },
      KeyframeAnimationOptions,
    ];
    expect(keyframes.clipPath[0]).toBe('circle(0px at 100px 20px)');
    expect(options.pseudoElement).toBe('::view-transition-new(root)');

    // A second click mid-animation is ignored.
    fireEvent.click(screen.getByRole('button'));
    expect(vt.start).toHaveBeenCalledTimes(1);

    await act(async () => vt.finish());
    expect(root).not.toHaveClass('theme-switching');
  });

  it('throws a clear error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeName />)).toThrow('useTheme must be used inside <ThemeProvider>');
  });
});
