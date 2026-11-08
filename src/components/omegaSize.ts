/**
 * Responsive sizing for the loader's dot-matrix ω.
 *
 * The ω is 9 dots wide with half-dot gaps: 9 + 8 × 0.5 = 13 dot-widths wide,
 * and 7 + 6 × 0.5 = 10 dot-widths tall.
 */
const WIDTH_IN_DOTS = 13;

/** ω width as a share of the viewport width (wins on portrait phones). */
const WIDTH_SHARE = 0.55;
/** ω width as a share of the viewport height (wins on desktops and landscape phones). */
const HEIGHT_SHARE = 0.48;
/** Never wider than this, so it stays a mark and not a wall on big monitors. */
const MAX_WIDTH_PX = 640;
/** Never smaller than this dot size, so tiny screens still read as ω. */
const MIN_DOT_PX = 8;

/**
 * Dot diameter in whole CSS pixels for a given viewport.
 * Uses the limiting dimension (whichever share is smaller) so the ω fits in any
 * orientation, and rounds down to an EVEN integer so the half-dot gaps are whole
 * pixels too: every dot and gap renders identically, like a real LED matrix.
 */
export function omegaDotSize(viewportWidth: number, viewportHeight: number): number {
  const targetWidth = Math.min(viewportWidth * WIDTH_SHARE, viewportHeight * HEIGHT_SHARE, MAX_WIDTH_PX);
  const dot = Math.floor(targetWidth / WIDTH_IN_DOTS / 2) * 2;
  return Math.max(MIN_DOT_PX, dot);
}
