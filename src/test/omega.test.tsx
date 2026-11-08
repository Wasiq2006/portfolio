import { render } from '@testing-library/react';
import OmegaMark from '@/components/OmegaMark';
import omega from '@/data/omega.json';

describe('OmegaMark', () => {
  it('uses a 9×7 bitmap with only 0/1 cells', () => {
    expect(omega.rows).toHaveLength(7);
    omega.rows.forEach((row) => expect(row).toMatch(/^[01]{9}$/));
  });

  it('draws one lit dot per 1 in the bitmap, plus the faint grid', () => {
    const litCount = omega.rows.join('').split('').filter((c) => c === '1').length;
    const { container } = render(<OmegaMark />);
    expect(container.querySelectorAll('.omega-dot--lit')).toHaveLength(litCount);
    expect(container.querySelectorAll('.omega-dot--unlit')).toHaveLength(9 * 7 - litCount);
  });

  it('can hide the faint grid', () => {
    const { container } = render(<OmegaMark showUnlit={false} />);
    expect(container.querySelectorAll('.omega-dot--unlit')).toHaveLength(0);
  });

  it('is hidden from screen readers (decorative)', () => {
    const { container } = render(<OmegaMark />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
