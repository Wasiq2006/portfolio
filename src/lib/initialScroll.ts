/**
 * Where the home page should start scrolling on a full page load.
 *
 * - reload        → always the top (hero). A reload means "start over"; it must not
 *                   jump back to wherever you were, or to a leftover #hash in the URL.
 * - back_forward  → restore the saved position (expected behaviour for the Back button).
 * - navigate      → follow a #hash if the link had one (shared links like /#contact),
 *                   otherwise the top.
 */
export type NavigationType = 'navigate' | 'reload' | 'back_forward' | 'prerender' | undefined;

export type InitialScroll = { kind: 'top' } | { kind: 'hash'; hash: string } | { kind: 'position'; y: number };

export function initialScroll(navType: NavigationType, hash: string, savedY: string | null): InitialScroll {
  if (navType === 'reload') return { kind: 'top' };
  if (navType === 'back_forward') {
    const y = Number(savedY);
    if (savedY !== null && Number.isFinite(y) && y > 0) return { kind: 'position', y };
    return hash ? { kind: 'hash', hash } : { kind: 'top' };
  }
  return hash ? { kind: 'hash', hash } : { kind: 'top' };
}

/** How this page load happened, from the Navigation Timing API. */
export function currentNavigationType(): NavigationType {
  const entry = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
  return entry?.type as NavigationType;
}
