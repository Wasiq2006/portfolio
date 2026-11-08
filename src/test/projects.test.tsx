import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProjectIndex from '@/components/projects/ProjectIndex';
import ProjectDeck from '@/components/projects/ProjectDeck';
import { PROJECTS, projectStatus } from '@/data/projects';

vi.mock('@/hooks/useSoundEffects', () => ({ playClick: vi.fn(), playHover: vi.fn() }));
// Skip fly-out animations so state changes are immediate in tests.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  useReducedMotion: () => true,
}));

const withRouter = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
const flush = () => new Promise((r) => setTimeout(r, 0));

describe('projects data', () => {
  it('derives a status from the links each project has', () => {
    expect(PROJECTS.map(projectStatus)).toEqual(['Open source', 'Open source', 'Live', 'Write-up']);
  });

  it('has unique ids and exactly one featured project', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length);
    expect(PROJECTS.filter((p) => p.featured)).toHaveLength(1);
  });
});

describe('ProjectIndex (desktop)', () => {
  it('opens the first project by default and one row at a time', () => {
    withRouter(<ProjectIndex projects={PROJECTS} />);
    const [first, second] = screen.getAllByRole('button', { expanded: undefined });

    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows only the buttons a project has links for', () => {
    withRouter(<ProjectIndex projects={PROJECTS} />);
    const blogPanel = document.getElementById('project-panel-android-home-server')!;
    expect(within(blogPanel).getByRole('link', { name: /read write-up/i })).toHaveAttribute(
      'href',
      '/blog/android-home-server'
    );
    expect(within(blogPanel).queryByRole('link', { name: /source/i })).toBeNull();
  });
});

describe('ProjectDeck (phone)', () => {
  const topTitle = () => screen.getByText(/^\d\d \/ \d\d · /).textContent;

  it('has no arrow buttons, only dots', () => {
    withRouter(<ProjectDeck projects={PROJECTS} />);
    expect(screen.queryByRole('button', { name: /next project|previous project/i })).toBeNull();
    expect(screen.getAllByRole('button', { name: /^Show / })).toHaveLength(PROJECTS.length);
  });

  it('loops in both directions with the arrow keys', async () => {
    withRouter(<ProjectDeck projects={PROJECTS} />);
    const deck = screen.getByRole('region', { name: 'Projects' });
    const press = async (key: string) => {
      fireEvent.keyDown(deck, { key });
      await flush();
    };

    expect(topTitle()).toBe('01 / 04 · Shehri AI');
    await press('ArrowLeft'); // back from the first card wraps to the last
    expect(topTitle()).toBe('04 / 04 · Android Based Home Server');
    await press('ArrowRight'); // forward from the last wraps to the first
    expect(topTitle()).toBe('01 / 04 · Shehri AI');
    await press('ArrowRight');
    expect(topTitle()).toBe('02 / 04 · WRAT');
  });

  it('jumps straight to a project from its dot', () => {
    withRouter(<ProjectDeck projects={PROJECTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show Android Based Home Server' }));
    expect(topTitle()).toBe('04 / 04 · Android Based Home Server');
  });

  it('keeps card stacking local so cards never draw over the mobile menu', () => {
    withRouter(<ProjectDeck projects={PROJECTS} />);
    // Cards use z-index 47-50 to stack; `isolate` stops those competing with page layers.
    const stack = screen.getByRole('heading', { name: 'Shehri AI' }).closest('.grid')!;
    expect(stack).toHaveClass('isolate');
  });

  it('hides the cards behind the top one from keyboard and screen readers', () => {
    withRouter(<ProjectDeck projects={PROJECTS} />);
    const topHeading = screen.getByRole('heading', { name: 'Shehri AI' });
    // Behind cards are aria-hidden, so only the top card's heading is in the accessibility tree.
    expect(screen.getAllByRole('heading')).toEqual([topHeading]);
  });
});
