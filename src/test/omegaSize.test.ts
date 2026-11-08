import { omegaDotSize } from '@/components/omegaSize';

// [label, viewport width, viewport height]
const VIEWPORTS: Array<[string, number, number]> = [
  ['small phone', 320, 568],
  ['phone', 390, 844],
  ['phone landscape', 844, 390],
  ['tablet', 768, 1024],
  ['laptop', 1280, 800],
  ['full HD', 1920, 1080],
  ['1440p', 2560, 1440],
  ['4K at 100%', 3840, 2160],
  ['ultrawide', 3440, 1440],
];

describe('omegaDotSize', () => {
  it.each(VIEWPORTS)('%s (%ix%i): even whole-pixel dots, so dots and gaps render identically', (_, w, h) => {
    const dot = omegaDotSize(w, h);
    expect(Number.isInteger(dot)).toBe(true);
    expect(dot % 2).toBe(0);
  });

  it.each(VIEWPORTS)('%s (%ix%i): fits within 55% of the width, 48% of the height and 640px', (_, w, h) => {
    const dot = omegaDotSize(w, h);
    const omegaWidth = 13 * dot; // 9 dots + 8 half-dot gaps
    expect(omegaWidth).toBeLessThanOrEqual(Math.min(w * 0.55, h * 0.48, 640));
  });

  it('follows the limiting dimension: a rotated phone gets a smaller ω, not an overflowing one', () => {
    expect(omegaDotSize(844, 390)).toBeLessThan(omegaDotSize(390, 844));
  });

  it('grows with the screen, then stops at the cap', () => {
    const sizes = [
      [390, 844],
      [768, 1024],
      [1920, 1080],
      [2560, 1440],
    ].map(([w, h]) => omegaDotSize(w, h));
    expect([...sizes].sort((a, b) => a - b)).toEqual(sizes);
    expect(omegaDotSize(3840, 2160)).toBe(omegaDotSize(2560, 1440)); // both capped
  });

  it('never goes below the minimum dot size on tiny screens', () => {
    expect(omegaDotSize(200, 200)).toBe(8);
  });
});
