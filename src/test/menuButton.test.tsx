import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import MenuButton from '@/components/MenuButton';
import omega from '@/data/omega.json';

vi.mock('@/hooks/useSoundEffects', () => ({ playClick: vi.fn(), playHover: vi.fn() }));

const Harness = () => {
  const [open, setOpen] = useState(false);
  return <MenuButton open={open} onToggle={() => setOpen((o) => !o)} controls="menu" />;
};

/** Read the lit dots back out of the DOM as 9-char rows. */
const litRows = (button: HTMLElement) => {
  const cells = [...button.querySelectorAll('[data-lit]')].map((d) => (d.getAttribute('data-lit') === 'true' ? '1' : '0'));
  return Array.from({ length: 7 }, (_, y) => cells.slice(y * 9, y * 9 + 9).join(''));
};

describe('MenuButton (mobile ω menu)', () => {
  it('shows the ω while closed and an ✕ while open', () => {
    render(<Harness />);
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(litRows(button)).toEqual(omega.rows);

    fireEvent.click(button);
    const rows = litRows(screen.getByRole('button', { name: 'Close navigation menu' }));
    // ✕: symmetric, with the centre dot lit
    expect(rows[3][4]).toBe('1');
    expect(rows).toEqual([...rows].reverse());
    rows.forEach((r) => expect(r).toBe([...r].reverse().join('')));
  });

  it('exposes its state to screen readers', () => {
    render(<Harness />);
    const button = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'menu');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAccessibleName('Close navigation menu');
  });

  it('looks as small as the sound box (27px) but keeps a 44px touch target', () => {
    render(<Harness />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-11', 'h-11');
    expect(button.firstElementChild).toHaveClass('w-[27px]', 'h-[27px]');
  });
});
