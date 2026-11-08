import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cursorBlinks, delayFor, initialState, step } from './typewriterMachine';

/**
 * `< role />` typewriter under the hero name. Lives in its own component so each
 * keystroke re-renders only this line, not the whole 3D hero.
 */
const Typewriter = ({ roles }: { roles: readonly string[] }) => {
  const reducedMotion = useReducedMotion() ?? false;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (reducedMotion) return;
    // One timer per step, always cleaned up, so nothing fires after unmount.
    const timer = setTimeout(() => setState((s) => step(s, roles)), delayFor(state, Math.random()));
    return () => clearTimeout(timer);
  }, [state, roles, reducedMotion]);

  const text = reducedMotion ? roles[0] : state.text;
  const blink = reducedMotion || cursorBlinks(state);

  return (
    <div className="mt-6 h-8 flex items-center justify-center font-mono text-xs md:text-sm whitespace-nowrap">
      {/* Screen readers get the roles once, not a stream of letters. */}
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden className="flex items-center">
        <span className="tracking-[0.2em] text-foreground/50">{'< '}</span>
        <span className="tracking-[0.15em] text-foreground/80 font-bold" data-testid="typewriter-text">
          {text}
        </span>
        <span className={`text-foreground/80 ${blink ? 'animate-caret-blink' : ''}`}>|</span>
        <span className="tracking-[0.2em] text-foreground/50">{' />'}</span>
      </span>
    </div>
  );
};

export default Typewriter;
