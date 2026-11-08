import { Github } from 'lucide-react';
import { playClick } from '@/hooks/useSoundEffects';
import { PROJECTS } from '@/data/projects';
import { getSocialLink } from '@/data/constants';
import SectionBlock from './SectionBlock';
import ProjectIndex from './projects/ProjectIndex';
import ProjectDeck from './projects/ProjectDeck';

const ProjectsSection = () => (
  <SectionBlock id="projects" title="Projects">
    {/* Both layouts render; CSS picks one, so there is no flash of the wrong layout on load. */}
    <div className="hidden md:block">
      <ProjectIndex projects={PROJECTS} />
    </div>
    {/* Bleed to the screen edges, then clip sideways: a card thrown off-screen must not
        widen the page (that made the fixed navbar buttons shift on swipe right).
        `clip` (unlike `hidden`) keeps vertical overflow and sticky positioning intact. */}
    <div className="md:hidden -mx-6 px-6 overflow-x-clip">
      <ProjectDeck projects={PROJECTS} />
    </div>

    {/* Centred on phones so the floating scroll-to-top button doesn't cover it. */}
    <div className="mt-12 flex justify-center md:justify-start">
      <a
        href={getSocialLink('github')?.href ?? 'https://github.com/Wasiq2006'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={playClick}
        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-1 hover:gap-4 transition-all"
      >
        <Github className="w-4 h-4" aria-hidden />
        View all projects
      </a>
    </div>
  </SectionBlock>
);

export default ProjectsSection;
