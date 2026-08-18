import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import DotMatrixText from './DotMatrixText';

interface LoadingAnimationProps {
  onComplete?: () => void;
}

const PROGRESS_STAGES = ['000%', '017%', '034%', '052%', '068%', '081%', '094%', '100%'];

export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentProgress, setCurrentProgress] = useState('000%');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCurrentProgress('100%');
      const timer = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(new Event('loading-animation-complete'));
        onComplete?.();
      },
    });

    const dots = container.querySelectorAll('.dot-matrix-dot');
    const labels = container.querySelectorAll('.loading-label');

    // Initial state
    gsap.set(container, { opacity: 1, yPercent: 0 });
    if (labels.length > 0) gsap.set(labels, { opacity: 0, x: -8 });
    if (dots.length > 0) {
      gsap.set(dots, {
        scale: 0.35,
        opacity: 0,
      });
    }

    // 0.0 - 0.5s: Empty viewport + tiny label fade-in
    if (labels.length > 0) {
      tl.to(labels, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }

    // 0.5 - 1.5s: First dot clusters & percentage assembly
    if (dots.length > 0) {
      tl.to(
        dots,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: {
            amount: 0.95,
            from: 'random',
          },
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }

    // Progress counter stage stepping (0.5s to 3.8s)
    PROGRESS_STAGES.forEach((stage, idx) => {
      tl.to(
        {},
        {
          duration: 0.38,
          onStart: () => {
            setCurrentProgress(stage);

            // Geometric Dot Scramble on active stage transition
            if (dots.length > 0 && idx < PROGRESS_STAGES.length - 1) {
              gsap.to(dots, {
                scale: (i) => (i % 3 === 0 ? 0.65 : 1),
                opacity: (i) => (i % 4 === 0 ? 0.45 : 1),
                duration: 0.14,
                yoyo: true,
                repeat: 1,
                stagger: {
                  amount: 0.14,
                  from: 'center',
                },
                ease: 'power2.inOut',
              });
            }
          },
        },
        `+=0.04`
      );
    });

    // 4.2 - 4.6s: Final dot configuration lock
    if (dots.length > 0) {
      tl.to(dots, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        stagger: 0.004,
        ease: 'power4.out',
      });
    }

    // Exit immediately: Smooth curtain wipe out of viewport into portfolio
    tl.to(container, {
      opacity: 0,
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-background text-foreground w-screen h-screen overflow-hidden select-none"
    >
      {/* 1. Upper-Left Tiny Monospaced Loading Label (NOT centered) */}
      <div className="absolute top-6 left-5 sm:top-8 sm:left-8 md:top-12 md:left-12 flex flex-col gap-1.5">
        <div className="loading-label font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#d93829] font-bold">
          LOADING...
        </div>
        <div className="loading-label font-mono text-[10px] uppercase tracking-widest text-foreground/50">
          SP * SEC
        </div>
      </div>

      {/* 2. Top-Right Asymmetric Down Arrow & Percentage Counter */}
      <div className="absolute top-[12%] right-[5%] sm:right-[8%] md:right-[12%] flex flex-col items-end gap-3">
        <div className="hidden sm:block">
          <DotMatrixText
            text="V"
            dotSizeClass="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3"
            charGapClass="gap-2"
          />
        </div>
        <DotMatrixText
          text={currentProgress}
          dotSizeClass="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 lg:w-4.5 lg:h-4.5"
          charGapClass="gap-1.5 sm:gap-3 md:gap-6"
        />
        <p className="font-mono text-[9px] sm:text-[10px] md:text-xs text-foreground/50 uppercase tracking-widest text-right">
          WASIQ • SEC
        </p>
      </div>

      {/* 3. Mid-Left Asymmetric Main Typography Word */}
      <div className="absolute top-[44%] sm:top-[48%] left-[4%] sm:left-[6%] md:left-[10%]">
        <DotMatrixText
          text="WASIQ"
          dotSizeClass="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 md:w-4 md:h-4 lg:w-5 lg:h-5"
          charGapClass="gap-1.5 sm:gap-3 md:gap-5 lg:gap-7"
        />
      </div>

      {/* 4. Bottom-Left Symbol & Bio Metadata */}
      <div className="absolute bottom-[10%] left-[4%] sm:left-[6%] md:left-[10%] flex flex-col gap-2 max-w-[200px] sm:max-w-xs">
        <DotMatrixText
          text="&"
          dotSizeClass="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3"
          charGapClass="gap-2"
        />
        <p className="font-mono text-[9px] sm:text-[10px] md:text-xs text-foreground/60 uppercase tracking-widest leading-relaxed">
          CYBER &amp; CLOUD SECURITY ENGINEER.
        </p>
      </div>

      {/* 5. Bottom-Right Asymmetric Dot Matrix Arrow */}
      <div className="absolute bottom-[10%] right-[5%] sm:right-[8%] md:right-[14%] flex flex-col items-end gap-2">
        <DotMatrixText
          text="->"
          dotSizeClass="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3"
          charGapClass="gap-2"
        />
      </div>
    </div>
  );
};

export default LoadingAnimation;
