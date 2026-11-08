import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import OmegaMark from './OmegaMark';
import { omegaDotSize } from './omegaSize';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

/** Never hold the page longer than this waiting for fonts/images (ms). */
const MAX_WAIT_MS = 3000;

/** Resolves when web fonts and the window `load` event are done (capped). */
const pageReady = (): Promise<void> => {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
  const cap = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS));
  return Promise.race([Promise.all([fonts, loaded]).then(() => undefined), cap]);
};

/**
 * Loading screen: a dot-matrix ω (omega) lights up on a faint LED grid, pulses
 * once, then the screen wipes up as soon as the page is ready (~1.5-2 s total).
 * Any click, key, scroll or touch skips straight to the exit.
 */
export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Size the ω from the current viewport and re-fit live on resize / rotation.
  const [dot, setDot] = useState(() => omegaDotSize(window.innerWidth, window.innerHeight));

  useEffect(() => {
    const fit = () => setDot(omegaDotSize(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
    return () => {
      window.removeEventListener('resize', fit);
      window.removeEventListener('orientationchange', fit);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.dispatchEvent(new Event('loading-animation-complete'));
      onComplete?.();
    };

    const ready = pageReady();
    const lit = container.querySelectorAll('.omega-dot--lit');
    const unlit = container.querySelectorAll('.omega-dot--unlit');
    const mark = container.querySelector('.omega-mark');

    // Reduced motion: show the ω still, then fade out (no wipe, no light-up).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let cancelled = false;
      ready.then(() => {
        if (!cancelled) gsap.to(container, { opacity: 0, duration: 0.25, onComplete: finish });
      });
      return () => {
        cancelled = true;
        gsap.killTweensOf(container);
      };
    }

    let exiting = false;
    const exit = () => {
      if (exiting) return;
      exiting = true;
      intro.kill();
      gsap.set(lit, { opacity: 1, scale: 1 });
      gsap.to(container, {
        yPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut',
        onComplete: finish,
      });
    };

    // Intro: grid fades in, ω dots light up in random order, then one pulse.
    gsap.set(unlit, { opacity: 0 });
    gsap.set(lit, { opacity: 0, scale: 0.4 });
    const intro = gsap
      .timeline({ onComplete: () => void ready.then(exit) })
      .to(unlit, { opacity: 0.12, duration: 0.3, ease: 'power1.out' })
      .to(lit, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)', stagger: { amount: 0.55, from: 'random' } }, '-=0.15')
      .to(mark, { scale: 1.06, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1 }, '+=0.05');

    // Let impatient visitors skip.
    const skip = () => exit();
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, skip, { passive: true, once: true }));

    return () => {
      intro.kill();
      gsap.killTweensOf(container);
      events.forEach((e) => window.removeEventListener(e, skip));
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] bg-background text-foreground flex items-center justify-center select-none"
    >
      <OmegaMark dotSize={`${dot}px`} className="omega-mark" />
    </div>
  );
};

export default LoadingAnimation;
