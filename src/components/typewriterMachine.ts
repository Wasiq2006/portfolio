/**
 * Pure state machine for the hero typewriter:
 *   typing → holding → deleting → (empty pause) → next role typing → ...
 *
 * Text is always sliced from the ROLE (never from the previous text), so a new
 * role can't "pop in" pre-typed — that was the old bug, where
 * `role.slice(0, text.length - 1)` with an empty text became `slice(0, -1)`.
 */
export type Phase = 'typing' | 'holding' | 'deleting';

export interface TypewriterState {
  roleIndex: number;
  text: string;
  phase: Phase;
}

export const initialState: TypewriterState = { roleIndex: 0, text: '', phase: 'typing' };

export function step(s: TypewriterState, roles: readonly string[]): TypewriterState {
  const role = roles[s.roleIndex];
  switch (s.phase) {
    case 'typing': {
      const text = role.slice(0, s.text.length + 1);
      return { ...s, text, phase: text.length >= role.length ? 'holding' : 'typing' };
    }
    case 'holding':
      return { ...s, phase: 'deleting' };
    case 'deleting':
      if (s.text.length > 0) return { ...s, text: s.text.slice(0, -1) };
      return { roleIndex: (s.roleIndex + 1) % roles.length, text: '', phase: 'typing' };
  }
}

export const TIMING = {
  /** Typing: 55-115 ms per character, varied so it feels human rather than robotic. */
  typeMin: 55,
  typeJitter: 60,
  /** How long a finished role stays on screen. */
  hold: 1800,
  /** Deleting is quicker than typing. */
  delete: 32,
  /** Short beat on the empty line before the next role starts. */
  emptyPause: 350,
} as const;

/** How long to wait in state `s` before taking the next step. `random` is 0..1. */
export function delayFor(s: TypewriterState, random: number): number {
  if (s.phase === 'holding') return TIMING.hold;
  if (s.phase === 'deleting') return s.text.length > 0 ? TIMING.delete : TIMING.emptyPause;
  return TIMING.typeMin + random * TIMING.typeJitter;
}

/** The cursor stays solid while characters change and blinks only while idle. */
export const cursorBlinks = (s: TypewriterState) =>
  s.phase === 'holding' || (s.phase === 'deleting' && s.text.length === 0);
