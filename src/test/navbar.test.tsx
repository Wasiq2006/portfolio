import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Navbar from '@/components/Navbar';
import ThemeProvider from '@/components/ThemeProvider';

// Keep the real module (SoundToggle uses its default export); silence the sounds.
vi.mock('@/hooks/useSoundEffects', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/hooks/useSoundEffects')>()),
  playClick: vi.fn(),
  playHover: vi.fn(),
}));
// Skip the curtain animation so open/close is immediate in tests.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => true,
}));

const renderNav = () =>
  render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
const menuButton = () => screen.getByRole('button', { name: /navigation menu/i });
const menu = () => document.getElementById('mobile-nav-menu');

describe('Navbar mobile menu (curtain)', () => {
  afterEach(() => {
    document.documentElement.style.overflow = '';
  });

  it('opens a full-screen menu that is not trapped inside the nav bar', () => {
    renderNav();
    expect(menu()).toBeNull();
    fireEvent.click(menuButton());

    const panel = menu()!;
    expect(panel).toHaveClass('fixed', 'inset-0');
    // Must not be inside <nav>: its backdrop-filter would confine a fixed child to the 52px bar.
    expect(panel.closest('nav')).toBeNull();
    expect(panel.querySelectorAll('a')).toHaveLength(7);
  });

  it('freezes the page behind it while open and releases it on close', async () => {
    const lockEvents: boolean[] = [];
    const onLock = (e: Event) => lockEvents.push((e as CustomEvent<boolean>).detail);
    window.addEventListener('scroll-lock', onLock);

    renderNav();
    fireEvent.click(menuButton());
    expect(document.documentElement.style.overflow).toBe('hidden');

    fireEvent.click(menuButton());
    await waitFor(() => expect(menu()).toBeNull());
    expect(document.documentElement.style.overflow).toBe('');
    expect(lockEvents).toEqual([true, false]);

    window.removeEventListener('scroll-lock', onLock);
  });

  it('closes with Escape and when a section link is tapped', async () => {
    renderNav();
    fireEvent.click(menuButton());
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(menu()).toBeNull());

    fireEvent.click(menuButton());
    fireEvent.click(screen.getAllByRole('link', { name: 'Work' }).at(-1)!);
    await waitFor(() => expect(menu()).toBeNull());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });
});
