import { getSwipeDirection } from '@/components/projects/swipe';

// Spec for the swipe rule in src/components/projects/swipe.ts.
// Swipe RIGHT = next, swipe LEFT = previous.
// Tuning the thresholds in swipe.ts? Keep these cases passing.
describe('getSwipeDirection', () => {
  const W = 340; // typical phone card width in px

  it('springs back for a tiny, slow drag (someone wobbling while scrolling)', () => {
    expect(getSwipeDirection(-15, -40, W)).toBeNull();
    expect(getSwipeDirection(20, 30, W)).toBeNull();
  });

  it('goes next for a long drag to the right, even if released slowly', () => {
    expect(getSwipeDirection(W * 0.5, 10, W)).toBe('next');
  });

  it('goes back for a long drag to the left', () => {
    expect(getSwipeDirection(-W * 0.5, -10, W)).toBe('prev');
  });

  it('counts a short, fast flick', () => {
    expect(getSwipeDirection(50, 900, W)).toBe('next');
    expect(getSwipeDirection(-50, -900, W)).toBe('prev');
  });

  it('follows the release direction when the flick reverses at the end', () => {
    // Dragged left a bit, then flicked hard right: the user changed their mind.
    expect(getSwipeDirection(-40, 1000, W)).toBe('next');
  });
});
