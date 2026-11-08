export type SwipeResult = 'next' | 'prev' | null;

/** Drag at least this fraction of the card width to change cards. */
const DISTANCE_RATIO = 0.25;
/** Or let go faster than this (px/s): a quick flick counts even if short. */
const FLICK_VELOCITY = 500;

/**
 * Decide what a finished horizontal drag on the top card of the phone deck means.
 * Swipe RIGHT = next project, swipe LEFT = previous project.
 *
 * @param offsetX   How far the card was dragged, in px. Positive = dragged right.
 * @param velocityX Release speed in px/s. Positive = moving right when let go.
 * @param cardWidth Width of the card in px, so the distance rule scales with screen size.
 * @returns 'next' (swiped right), 'prev' (swiped left), or null (spring back).
 */
export function getSwipeDirection(offsetX: number, velocityX: number, cardWidth: number): SwipeResult {
  // A fast release wins: it says where the user meant to throw the card,
  // even if they dragged the other way first.
  if (Math.abs(velocityX) >= FLICK_VELOCITY) return velocityX > 0 ? 'next' : 'prev';
  // Otherwise it must be a deliberate, long drag; small wobbles while scrolling spring back.
  if (Math.abs(offsetX) >= cardWidth * DISTANCE_RATIO) return offsetX > 0 ? 'next' : 'prev';
  return null;
}
