import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import {
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  InstagramIcon,
  BookOpen,
} from 'lucide-react';
import Magnetic from './Magnetic';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';

const roles = [
  'Security Researcher',
  'Cloud Security Engineer',
  'Cybersecurity Engineer',
  'Linux System Administrator',
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  instagram: InstagramIcon,
  blog: BookOpen,
  email: Mail,
};

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [theme, setTheme] = useState('light');

  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 24, mass: 0.5 };
  const springMouseX = useSpring(mouseX, springConfig);
  const springMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springMouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springMouseX, [-0.5, 0.5], [-12, 12]);

  // 3D Scroll Depth values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const hasIndigoClass = document.documentElement.classList.contains('midnight-indigo');
      setTheme(hasIndigoClass ? 'midnight-indigo' : 'light');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
        if (displayText.length === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  // High-Contrast Theme-Adaptive Matrix Rain Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMidnight = document.documentElement.classList.contains('midnight-indigo');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -50));
    };

    resize();
    window.addEventListener('resize', resize);

    const chars = '01{}[];:/*#=+-<>_$%&@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let lastFrameTime = 0;
    const frameInterval = 45; // ~22fps matrix speed
    let animationId: number;

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      // Background trail clear
      ctx.fillStyle = isMidnight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(245, 245, 245, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `600 ${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0) {
          // Leading character (darker & crisp)
          if (isMidnight) {
            ctx.fillStyle = 'rgba(74, 222, 128, 0.8)';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 3;
          } else {
            ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }
          ctx.fillText(char, x, y);

          // Trail characters (dimmer & subtle)
          const trailChar = chars[Math.floor(Math.random() * chars.length)];
          if (isMidnight) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = 'rgba(51, 65, 85, 0.45)';
            ctx.shadowBlur = 0;
          }
          ctx.fillText(trailChar, x, y - fontSize);
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen flex flex-col justify-center items-center relative px-6 overflow-hidden pb-12 bg-background perspective-1200"
      style={{ perspective: '1200px' }}
    >
      {/* Matrix rain canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-45"
        aria-hidden="true"
      />

      {/* Cyber Grid background overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"
      />

      {/* Top-left code comment with 3D Depth */}
      <motion.div
        style={{ rotateX, rotateY, translateZ: '30px' }}
        className="absolute top-28 left-6 md:left-10 z-10 hidden md:block preserve-3d"
      >
        <p className="font-mono text-xs text-foreground/90 leading-relaxed font-medium bg-card/80 backdrop-blur-sm p-3 border border-foreground/10 shadow-sm">
          // portfolio.tsx
          <br />
          // version: 3.0.0
          <br />
          // status: production
          <br />
          // last_build: {new Date().toISOString().split('T')[0]}
        </p>
      </motion.div>

      {/* Top-right line numbers with 3D Depth */}
      <motion.div
        style={{ rotateX, rotateY, translateZ: '30px' }}
        className="absolute top-28 right-6 md:right-10 z-10 hidden md:block preserve-3d"
      >
        <p className="font-mono text-xs text-foreground/80 leading-relaxed text-right font-medium bg-card/80 backdrop-blur-sm p-3 border border-foreground/10 shadow-sm">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="block">
              {String(i + 1).padStart(3, '0')}
            </span>
          ))}
        </p>
      </motion.div>

      {/* Main 3D Framer Motion Perspective Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: heroScale,
          opacity: heroOpacity,
          y: heroY,
          transformStyle: 'preserve-3d',
        }}
        className="text-center relative z-10 pt-24 md:pt-20 max-w-4xl mx-auto"
      >
        {/* Name Title with Z-Depth Layering */}
        <motion.div style={{ transform: 'translateZ(90px)' }}>
          <h1
            className="heading-brutal leading-[0.85] tracking-tight"
            style={{ fontSize: 'clamp(65px, 13vw, 140px)' }}
          >
            <div className="glitch-text inline-block" data-text="Muhammad">
              Muhammad
            </div>
            <br />
            <div className="glitch-text inline-block" data-text="Wasiq.">
              <span className="text-foreground/20">Wasiq.</span>
            </div>
          </h1>
        </motion.div>

        {/* Typewriter role with Z-Depth Layering */}
        <motion.div
          style={{ transform: 'translateZ(60px)' }}
          className="mt-6 h-8 flex items-center justify-center"
        >
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {'< '}
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.15em] text-foreground/80 font-bold">
            {displayText}
          </span>
          <span
            className={`font-mono text-xs md:text-sm text-foreground/80 transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            |
          </span>
          <span className="font-mono text-xs md:text-sm tracking-[0.2em] text-foreground/50">
            {' />'}
          </span>
        </motion.div>

        {/* Tech tags with Z-Depth Layering */}
        <motion.div
          style={{ transform: 'translateZ(45px)' }}
          className="flex flex-wrap gap-2 justify-center mt-8 max-w-md mx-auto"
        >
          {[
            'Cybersecurity',
            'Cloud Security',
            'Linux',
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 font-mono text-xs border-2 border-foreground/40 bg-card/60 backdrop-blur-sm text-foreground/90 font-bold tracking-wider hover:bg-foreground hover:text-background transition-all duration-300 cursor-default rounded-none shadow-sm"
              onMouseEnter={playHover}
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Social links with Z-Depth Layering */}
        <motion.div
          style={{ transform: 'translateZ(55px)' }}
          className="flex gap-4 justify-center mt-10"
        >
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.id];
            if (!Icon) return null;
            return (
              <Magnetic key={link.id} strength={0.3}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onClick={playClick}
                  className="group relative inline-flex items-center justify-center p-3 border-2 border-foreground bg-card text-foreground transition-all duration-300 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-foreground hover:text-background rounded-none"
                  style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0px 0px currentColor'; }}
                >
                  <Icon className="w-5 h-5" />
                </a>
              </Magnetic>
            );
          })}
        </motion.div>

        {/* Resume button with Z-Depth Layering */}
        <motion.div style={{ transform: 'translateZ(80px)' }} className="mt-10">
          <Magnetic strength={0.15}>
            <a
              href="/resume.pdf"
              download="Muhammad_Wasiq_Resume.pdf"
              onClick={playClick}
              className="group relative inline-flex items-center gap-2 px-8 py-4 border-2 border-foreground bg-foreground text-background text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-card hover:text-foreground rounded-none"
              style={{ boxShadow: '8px 8px 0px 0px currentColor' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px 0px currentColor'; }}
            >
              <span>Download Resume</span>
              <span className="w-2 h-2 border-r-2 border-b-2 border-current rotate-45 -translate-y-[1px] group-hover:translate-y-[1px] transition-transform duration-300"></span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Bottom-right stats */}
      <div className="absolute bottom-10 right-6 md:right-10 z-10 hidden md:block">
        <div className="font-mono text-xs text-foreground text-right leading-relaxed font-medium bg-card/80 backdrop-blur-sm p-2.5 border border-foreground/10">
          <p>const experience = "2+ years";</p>
          <p>const projects = 2;</p>
          <p>const passion = Infinity;</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="w-5 h-5 text-foreground/60 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
