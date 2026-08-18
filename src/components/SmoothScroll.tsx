import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const { pathname } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Disable automatic browser scroll restoration to control it explicitly
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Save scroll position on scroll when on main page
    const handleScroll = () => {
      if (window.location.pathname === '/') {
        sessionStorage.setItem('portfolio_scroll_pos', String(window.scrollY));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const restoreSavedScroll = () => {
      const savedPos = sessionStorage.getItem('portfolio_scroll_pos');
      if (savedPos && window.location.pathname === '/' && !window.location.hash) {
        const y = Number(savedPos);
        if (!isNaN(y) && y > 0) {
          lenis.scrollTo(y, { immediate: true });
        }
      } else if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { immediate: true });
        }
      }
    };

    // Restore scroll position after loading animation completes
    const handleLoadingComplete = () => {
      restoreSavedScroll();
    };

    window.addEventListener('loading-animation-complete', handleLoadingComplete);
    // Also attempt restoration immediately if loading screen is not active
    restoreSavedScroll();

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('loading-animation-complete', handleLoadingComplete);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      if (pathname !== '/') {
        sessionStorage.removeItem('portfolio_scroll_pos');
      }
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
