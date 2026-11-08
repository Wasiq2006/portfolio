import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'framer-motion';
import { playClick } from '@/hooks/useSoundEffects';
import type { Project } from '@/data/projects';
import { LatestWorkLabel, ProjectLinkButtons, ProjectTags } from './ProjectParts';
import { getSwipeDirection } from './swipe';

type Direction = 'next' | 'prev';

/** How many cards are visible in the stack (top card + peeking ones). */
const VISIBLE_DEPTH = 3;
/** Thrown cards travel this many card widths, so they fully leave the screen. */
const FLY_DISTANCE = 1.3;
/** Dragging left past this many px brings the previous card in underneath. */
const PEEK_PREV_AT = 8;
const settle = { type: 'spring', stiffness: 380, damping: 34 } as const;

/**
 * Stack order (top first). Normally: active, next, next+1, ...
 * While the top card is dragged left, the previous card moves into second place,
 * so the card you're about to go back to is the one revealed underneath.
 */
const stackOrder = (active: number, total: number, peekPrev: boolean): number[] => {
  const order = Array.from({ length: total }, (_, k) => (active + k) % total);
  if (!peekPrev || total < 3) return order;
  const prev = order.pop()!;
  order.splice(1, 0, prev);
  return order;
};

interface DeckCardProps {
  project: Project;
  depth: number;
  reducedMotion: boolean;
  onDragSide: (side: 'left' | 'right' | null) => void;
  onThrown: (dir: Direction) => void;
  registerThrow: (fn: ((dir: Direction) => Promise<void>) | null) => void;
}

const DeckCard = ({ project, depth, reducedMotion, onDragSide, onThrown, registerThrow }: DeckCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  // Pivot from the bottom edge, like a card held between fingers.
  const rotate = useTransform(x, [-320, 0, 320], [-16, 0, 16]);
  const fade = useMotionValue(1);
  const isTop = depth === 0;
  const wasTop = useRef(isTop);
  const width = () => cardRef.current?.offsetWidth || 320;

  // A thrown card returns to the stack: reset its position (it's off-screen) and fade it in.
  useEffect(() => {
    if (wasTop.current && !isTop) {
      x.set(0);
      if (!reducedMotion) {
        fade.set(0);
        animate(fade, 1, { duration: 0.35, delay: 0.05 });
      }
    }
    wasTop.current = isTop;
  }, [isTop, reducedMotion, x, fade]);

  // Behind cards must not be reachable by keyboard.
  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = !isTop;
  }, [isTop]);

  const throwCard = useCallback(
    async (dir: Direction, velocity = 0) => {
      if (!reducedMotion) {
        // Next flies off to the right, previous to the left (matches the swipe direction).
        const target = (dir === 'next' ? 1 : -1) * width() * FLY_DISTANCE;
        // Carry the finger's release speed into the throw, so it feels continuous.
        await animate(x, target, {
          type: 'spring',
          velocity,
          stiffness: 260,
          damping: 32,
          restDelta: 40,
          restSpeed: 400,
        });
      }
      onThrown(dir);
    },
    [reducedMotion, x, onThrown]
  );

  // Let the deck's arrow keys throw the top card the same way a swipe does.
  useEffect(() => {
    if (!isTop) return;
    registerThrow((dir) => throwCard(dir));
    return () => registerThrow(null);
  }, [isTop, registerThrow, throwCard]);

  const handleDrag = () => {
    const v = x.get();
    onDragSide(v > PEEK_PREV_AT ? 'right' : v < -PEEK_PREV_AT ? 'left' : null);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const result = getSwipeDirection(info.offset.x, info.velocity.x, width());
    if (result) {
      throwCard(result, info.velocity.x);
    } else {
      onDragSide(null);
      animate(x, 0, { ...settle, velocity: info.velocity.x });
    }
  };

  const hidden = depth >= VISIBLE_DEPTH;

  return (
    // Outer layer: position in the stack. Inner layer: the drag.
    <motion.div
      className="[grid-area:1/1]"
      style={{ zIndex: 50 - depth }}
      initial={false}
      animate={{
        scale: 1 - depth * 0.05,
        y: depth * 14,
        rotate: depth === 0 ? 0 : depth % 2 ? 2.5 : -2.5,
        opacity: hidden ? 0 : 1,
      }}
      transition={reducedMotion ? { duration: 0 } : settle}
      aria-hidden={!isTop}
    >
      <motion.div
        ref={cardRef}
        drag={isTop ? 'x' : false}
        dragMomentum={false}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.03 }}
        style={{ x, rotate, opacity: fade, transformOrigin: '50% 100%', touchAction: 'pan-y' }}
        className={`relative h-full border-4 border-foreground bg-card p-6 flex flex-col gap-5 rounded-none select-none ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {project.featured && <LatestWorkLabel className="absolute -top-3 -right-2 rotate-6" />}
        <h3 className="text-2xl font-black tracking-tighter leading-none">{project.title}</h3>
        <p className="body-text text-sm">{project.description}</p>
        <ProjectTags tags={project.tags} />
        <div className="mt-auto pt-4 border-t border-foreground/10">
          <ProjectLinkButtons project={project} />
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Phone layout: a looping stack of cards. Swipe right for the next project,
 * left to go back. Also driven by the dots and the arrow keys.
 */
const ProjectDeck = ({ projects }: { projects: Project[] }) => {
  const total = projects.length;
  const [active, setActive] = useState(0);
  const [peekPrev, setPeekPrev] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;
  const throwRef = useRef<((dir: Direction) => Promise<void>) | null>(null);
  const busy = useRef(false);

  const registerThrow = useCallback((fn: ((dir: Direction) => Promise<void>) | null) => {
    throwRef.current = fn;
  }, []);

  // Dragging left means "go back", so show the previous card underneath.
  const onDragSide = useCallback((side: 'left' | 'right' | null) => setPeekPrev(side === 'left'), []);

  const onThrown = useCallback(
    (dir: Direction) => {
      setPeekPrev(false);
      setActive((a) => (dir === 'next' ? (a + 1) % total : (a - 1 + total) % total));
    },
    [total]
  );

  const keyThrow = async (dir: Direction) => {
    if (busy.current) return;
    busy.current = true;
    playClick();
    if (dir === 'prev') setPeekPrev(true);
    await throwRef.current?.(dir);
    busy.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      keyThrow(e.key === 'ArrowRight' ? 'next' : 'prev');
    }
  };

  if (total === 0) return null;
  const order = stackOrder(active, total, peekPrev);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-foreground"
    >
      {/* All cards share one grid cell, so the deck is as tall as the tallest card.
          `isolate` keeps the cards' z-indexes local to the deck, so they can never
          draw over page-level layers like the mobile menu curtain. */}
      <div className="grid pb-8 isolate">
        {projects.map((project, i) => (
          <DeckCard
            key={project.id}
            project={project}
            depth={order.indexOf(i)}
            reducedMotion={reducedMotion}
            onDragSide={onDragSide}
            onThrown={onThrown}
            registerThrow={registerThrow}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="flex gap-2">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              onClick={() => {
                playClick();
                setPeekPrev(false);
                setActive(i);
              }}
              aria-label={`Show ${project.title}`}
              aria-current={i === active}
              className="p-1.5 -m-1.5"
            >
              <span
                className={`block w-2.5 h-2.5 border-2 border-foreground transition-colors ${i === active ? 'bg-foreground' : 'bg-transparent'}`}
              />
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] font-bold" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {projects[active].title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">← Swipe →</span>
      </div>
    </div>
  );
};

export default ProjectDeck;
