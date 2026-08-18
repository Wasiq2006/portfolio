import { useRef, useState, useEffect, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Scroll3DSectionProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export const Scroll3DSection = ({
  children,
  className = '',
  depth = 8,
}: Scroll3DSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPointerFine, setIsPointerFine] = useState(true);

  useEffect(() => {
    const checkPointer = () => {
      setIsPointerFine(window.matchMedia('(pointer: fine)').matches);
    };
    checkPointer();
    window.addEventListener('resize', checkPointer);
    return () => window.removeEventListener('resize', checkPointer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.95', 'start 0.3'],
  });

  // Butter-smooth spring physics for fluid entrance motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // 3D perspective transforms on scroll entrance
  const rotateX = useTransform(smoothProgress, [0, 1], [depth, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.97, 1]);
  const opacity = useTransform(smoothProgress, [0, 1], [0.2, 1]);

  if (!isPointerFine) {
    return (
      <div ref={containerRef} className={`w-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`perspective-1200 ${className}`}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Scroll3DSection;
