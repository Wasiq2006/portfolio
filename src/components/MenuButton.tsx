import omega from '@/data/omega.json';
import { playClick, playHover } from '@/hooks/useSoundEffects';

/** ✕ on the same 9×7 grid as the ω, so the dots can morph between the two. */
const CLOSE_ROWS = [
  '010000010',
  '001000100',
  '000101000',
  '000010000',
  '000101000',
  '001000100',
  '010000010',
];
const OPEN_ROWS = omega.rows;

/** Morph delay per dot: scattered-looking but deterministic, 0-120 ms. */
const delayFor = (x: number, y: number) => ((x * 7 + y * 13) % 9) * 15;

/**
 * Dot-matrix glyph that shows ω when closed and morphs into ✕ when open.
 * Drawn as SVG circles: at this tiny size, CSS boxes snap to device pixels
 * unevenly (dots turn into dashes), while SVG circles render identically.
 */
export const MenuGlyph = ({ open }: { open: boolean }) => {
  const rows = open ? CLOSE_ROWS : OPEN_ROWS;
  return (
    // 9×7 grid, dot centres 2 units apart; ~21×16px on screen.
    <svg aria-hidden viewBox="-0.3 -0.3 17.6 13.6" width="21" height="16" fill="currentColor">
      {rows.flatMap((row, y) =>
        row.split('').map((cell, x) => {
          const lit = cell === '1';
          return (
            <circle
              key={`${x}-${y}`}
              data-lit={lit}
              cx={0.5 + x * 2}
              cy={0.5 + y * 2}
              r={0.72}
              className="transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none"
              style={{
                opacity: lit ? 1 : 0,
                transform: lit ? 'scale(1)' : 'scale(0.3)',
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transitionDelay: `${delayFor(x, y)}ms`,
              }}
            />
          );
        })
      )}
    </svg>
  );
};

interface MenuButtonProps {
  open: boolean;
  onToggle: () => void;
  controls: string;
}

/**
 * Mobile menu button: the ω in a small bordered, shadowed box that matches the
 * sound toggle exactly (that one is a 36px button scaled to 75% on phones:
 * 27px box, 1.5px border, 3px shadow). The ω turns into ✕ while the menu is open.
 *
 * The visible box is 27px, but the button itself is an invisible 44×44px tap area
 * around it, so it stays easy to hit with a thumb.
 */
const MenuButton = ({ open, onToggle, controls }: MenuButtonProps) => (
  <button
    type="button"
    onClick={() => {
      playClick();
      onToggle();
    }}
    onMouseEnter={playHover}
    aria-expanded={open}
    aria-controls={controls}
    aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
    // 44×44 tap area; the negative margin keeps the visible box aligned with the page edge.
    className="group w-11 h-11 -ml-[8.5px] flex items-center justify-center rounded-none"
  >
    <span
      // Inverted while open, as a clear "pressed" state. Hover inversion only on devices with a
      // real pointer: on phones a tap leaves :hover stuck on.
      className={`w-[27px] h-[27px] flex items-center justify-center border-[1.5px] border-foreground transition-colors duration-300 group-active:translate-x-[1.5px] group-active:translate-y-[1.5px] ${
        open
          ? 'bg-foreground text-background'
          : 'bg-card text-foreground [@media(hover:hover)]:group-hover:bg-foreground [@media(hover:hover)]:group-hover:text-background'
      }`}
      // Shadow in the border colour, so it stays visible when the box is inverted.
      style={{ boxShadow: '3px 3px 0px 0px hsl(var(--foreground))' }}
    >
      <MenuGlyph open={open} />
    </span>
  </button>
);

export default MenuButton;
