import { cursorBlinks, delayFor, initialState, step, TIMING, type TypewriterState } from '@/components/typewriterMachine';

const ROLES = ['Security Researcher', 'Cyber Security', 'Artificial Intelligence', 'Linux System Administrator'];

/** Run the machine for n steps and record every state. */
const run = (n: number) => {
  const states: TypewriterState[] = [initialState];
  for (let i = 0; i < n; i++) states.push(step(states.at(-1)!, ROLES));
  return states;
};

describe('typewriter state machine', () => {
  it('types every role one character at a time, from empty (no pop-in)', () => {
    const states = run(400);
    for (let i = 1; i < states.length; i++) {
      const prev = states[i - 1];
      const cur = states[i];
      const role = ROLES[cur.roleIndex];
      // Visible text is always a prefix of the current role, never a leftover of the previous one.
      expect(role.startsWith(cur.text)).toBe(true);
      // Text only ever changes by exactly one character per step.
      expect(Math.abs(cur.text.length - prev.text.length)).toBeLessThanOrEqual(1);
      // A new role always starts empty.
      if (cur.roleIndex !== prev.roleIndex) expect(cur.text).toBe('');
    }
  });

  it('cycles through all roles in order and loops back to the first', () => {
    const seen: number[] = [];
    for (const s of run(400)) if (seen.at(-1) !== s.roleIndex) seen.push(s.roleIndex);
    expect(seen.slice(0, 5)).toEqual([0, 1, 2, 3, 0]);
  });

  it('holds each finished role before deleting it', () => {
    const states = run(60);
    const full = states.findIndex((s) => s.text === ROLES[0]);
    expect(states[full].phase).toBe('holding');
    expect(delayFor(states[full], 0.5)).toBe(TIMING.hold);
    expect(states[full + 1]).toMatchObject({ phase: 'deleting', text: ROLES[0] });
  });

  it('types at a human, varied speed and deletes faster', () => {
    expect(delayFor({ roleIndex: 0, text: 'Se', phase: 'typing' }, 0)).toBe(TIMING.typeMin);
    expect(delayFor({ roleIndex: 0, text: 'Se', phase: 'typing' }, 1)).toBe(TIMING.typeMin + TIMING.typeJitter);
    expect(delayFor({ roleIndex: 0, text: 'Se', phase: 'deleting' }, 0.5)).toBeLessThan(TIMING.typeMin);
  });

  it('keeps the cursor solid while typing and blinks it only while idle', () => {
    expect(cursorBlinks({ roleIndex: 0, text: 'Sec', phase: 'typing' })).toBe(false);
    expect(cursorBlinks({ roleIndex: 0, text: 'Sec', phase: 'deleting' })).toBe(false);
    expect(cursorBlinks({ roleIndex: 0, text: ROLES[0], phase: 'holding' })).toBe(true);
    expect(cursorBlinks({ roleIndex: 0, text: '', phase: 'deleting' })).toBe(true);
  });
});
