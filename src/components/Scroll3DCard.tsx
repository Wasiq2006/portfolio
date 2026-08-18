import { useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Scroll3DCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const Scroll3DCard = ({
  children,
  className = '',
  intensity = 10,
}: Scroll3DCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.95', 'start 0.4'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
  });

  const scrollRotateX = useTransform(smoothScroll, [0, 1], [intensity, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHoverPos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverPos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      style={{ perspective: '1000px' }}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: isHovered ? hoverPos.y * -intensity * 1.2 : scrollRotateX,
          rotateY: isHovered ? hoverPos.x * intensity * 1.2 : 0,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Scroll3DCard;
