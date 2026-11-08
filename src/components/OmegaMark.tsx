import omega from '@/data/omega.json';

const ROWS = omega.rows;
const COLS = ROWS[0].length;

interface OmegaMarkProps {
  /** Dot diameter as any CSS length, e.g. '12px' or 'clamp(8px, 2vw, 14px)'. */
  dotSize?: string;
  /** Show the faint "off" dots of the full grid behind the ω (LED-matrix look). */
  showUnlit?: boolean;
  /** Opacity of the unlit dots. */
  unlitOpacity?: number;
  className?: string;
}

/**
 * The site's mark: a lowercase omega (ω) drawn as a 9×7 dot matrix.
 * Dots use `currentColor`, so it follows the theme. Every dot has the
 * `omega-dot` class plus `omega-dot--lit` / `omega-dot--unlit` for animation.
 */
const OmegaMark = ({ dotSize = '10px', showUnlit = true, unlitOpacity = 0.12, className = '' }: OmegaMarkProps) => (
  <div
    aria-hidden
    className={`grid ${className}`}
    style={{
      gridTemplateColumns: `repeat(${COLS}, ${dotSize})`,
      gridAutoRows: dotSize,
      // Gap of half a dot gives the evenly spaced LED-matrix look.
      gap: `calc(${dotSize} * 0.5)`,
    }}
  >
    {ROWS.flatMap((row, y) =>
      row.split('').map((cell, x) => {
        const lit = cell === '1';
        if (!lit && !showUnlit) return <span key={`${x}-${y}`} />;
        return (
          <span
            key={`${x}-${y}`}
            className={`omega-dot ${lit ? 'omega-dot--lit' : 'omega-dot--unlit'} block rounded-full bg-current`}
            style={lit ? undefined : { opacity: unlitOpacity }}
          />
        );
      })
    )}
  </div>
);

export default OmegaMark;
