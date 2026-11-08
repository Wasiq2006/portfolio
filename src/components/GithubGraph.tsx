import { GitHubCalendar } from 'react-github-calendar';
import { useTheme } from '@/hooks/useTheme';

const GithubGraph = () => {
  const { theme } = useTheme();

  return (
    <div className="border-4 border-foreground p-4 bg-card text-foreground hover:shadow-[8px_8px_0px_0px_currentColor] transition-all duration-300">
      <h3 className="font-mono text-xl font-bold mb-4 border-b-2 border-foreground pb-2 uppercase tracking-tighter">
        GitHub Activity_
      </h3>
      {/* ~430 SVG squares: content-visibility lets the browser skip styling them
          while off-screen, which keeps theme switches cheap at the top of the page. */}
      <div className="flex justify-center overflow-x-auto pb-2 [content-visibility:auto] [contain-intrinsic-size:auto_160px]">
        <GitHubCalendar
          username="Wasiq2006"
          colorScheme={theme === 'midnight-indigo' ? 'dark' : 'light'}
          style={{
            fontFamily: 'monospace',
          }}
          theme={{
            light: ['#e5e5e5', '#a3a3a3', '#737373', '#404040', '#171717'],
            dark: ['#232838', '#3d4560', '#636d8f', '#a3abc7', '#eef0f7'],
          }}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
        />
      </div>
      <div className="mt-2 text-right font-mono text-xs text-gray-600">
        // contribs over last year
      </div>
    </div>
  );
};

export default GithubGraph;
