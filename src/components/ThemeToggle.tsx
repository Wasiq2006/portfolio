import { useTheme } from '@/hooks/useTheme';
import { Palette } from 'lucide-react';
import { playClick, playHover } from '@/hooks/useSoundEffects';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={(e) => {
        playClick();
        // Grow the reveal from the button's centre (works for keyboard activation too).
        const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      onMouseEnter={playHover}
      className="nav-link p-2 active:opacity-50 transition-opacity flex items-center justify-center"
      aria-label={`Switch to ${theme === 'light' ? 'midnight indigo' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'midnight indigo' : 'light'} theme`}
    >
      <Palette size={18} />
    </button>
  );
};

export default ThemeToggle;
