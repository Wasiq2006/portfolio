import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import SoundToggle from './SoundToggle';
import ThemeToggle from './ThemeToggle';
import MenuButton from './MenuButton';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

/** Same curve as the loading screen's wipe, so both curtains feel like one system. */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const CURTAIN_SECONDS = 0.6;

/** Ask SmoothScroll to pause/resume Lenis, and stop native scrolling underneath. */
const lockPageScroll = (locked: boolean) => {
  document.documentElement.style.overflow = locked ? 'hidden' : '';
  window.dispatchEvent(new CustomEvent('scroll-lock', { detail: locked }));
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  // While the menu is open: freeze the page behind it, close on Escape,
  // and close if the screen grows into the desktop layout.
  useEffect(() => {
    if (!open) return;
    lockPageScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = () => desktop.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      lockPageScroll(false);
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open]);

  const curtain = reducedMotion ? { duration: 0 } : { duration: CURTAIN_SECONDS, ease: CURTAIN_EASE };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] py-1 lg:py-3 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between lg:justify-center relative">
          {/* Desktop Navbar (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center justify-center gap-0">
            {links.map((link, i) => (
              <span key={link.href} className="flex items-center">
                <a
                  href={link.href}
                  className="nav-link px-4 py-1 active:opacity-50 transition-opacity"
                  onClick={playClick}
                  onMouseEnter={playHover}
                >
                  {link.label}
                </a>
                {i < links.length - 1 && <span className="text-foreground/20 text-xs">|</span>}
              </span>
            ))}
          </div>

          {/* Desktop Toggles (Absolute Right) */}
          <div className="hidden lg:flex items-center gap-4 absolute right-6">
            <ThemeToggle />
            <span className="text-foreground/20 text-xs">|</span>
            <SoundToggle />
          </div>

          {/* Mobile Header (ω menu button left, toggles right) */}
          <div className="lg:hidden flex justify-between w-full items-center">
            <MenuButton open={open} onToggle={() => setOpen(!open)} controls="mobile-nav-menu" />
            <div className="flex gap-2 scale-75 origin-right">
              <ThemeToggle />
              <SoundToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu: a full-screen curtain that drops down from the top and rises back up.
          Rendered outside <nav> because the nav's backdrop-filter would trap a fixed child
          inside the 52px bar. Layering: floating buttons (terminal, scroll-to-top) z-50 < this curtain
          z-[55] < nav z-[60], so the curtain hides them while the nav buttons stay on top. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-nav-menu"
            role="navigation"
            aria-label="Site sections"
            className="lg:hidden fixed inset-0 z-[55] bg-background flex flex-col items-center justify-center gap-7 overflow-hidden"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={curtain}
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="nav-link text-base tracking-[0.3em] active:scale-95 transition-transform"
                onClick={() => {
                  playClick();
                  setOpen(false);
                }}
                onMouseEnter={playHover}
                // Links follow the curtain in, one after another, then leave quickly with it.
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0, transition: reducedMotion ? { duration: 0 } : { delay: 0.25 + i * 0.04, duration: 0.35 } }}
                exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.15 } }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
