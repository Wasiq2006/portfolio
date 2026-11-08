import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playClick, playHover } from '@/hooks/useSoundEffects';
import { projectStatus, type Project } from '@/data/projects';
import { LatestWorkLabel, ProjectLinkButtons, ProjectTags } from './ProjectParts';

/**
 * Desktop layout: a studio-style index. One bold row per project; clicking a
 * row expands it (accordion, one open at a time). The first project starts open.
 */
const ProjectIndex = ({ projects }: { projects: Project[] }) => {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);

  return (
    <div>
      <ul className="border-t-4 border-foreground">
        {projects.map((project, i) => {
          const isOpen = openId === project.id;
          const panelId = `project-panel-${project.id}`;
          const number = String(i + 1).padStart(2, '0');

          return (
            <li key={project.id} className="border-b-2 border-foreground">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onMouseEnter={playHover}
                  onClick={() => {
                    playClick();
                    setOpenId(isOpen ? null : project.id);
                  }}
                  className="group w-full grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,16rem)_7rem_2rem] lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,20rem)_8rem_2rem] items-center gap-4 py-6 text-left transition-colors duration-200 hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none px-2 -mx-2"
                >
                  <span className="font-mono text-sm text-current opacity-50">{number}</span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
                    <span className="text-3xl lg:text-5xl font-black tracking-tighter leading-[0.95] break-words transition-transform duration-300 group-hover:translate-x-2">
                      {project.title}
                    </span>
                    {project.featured && <LatestWorkLabel className="shrink-0 group-hover:bg-background group-hover:text-foreground" />}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider opacity-60 truncate">
                    {project.tags.slice(0, 3).join(' · ')}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-80">
                    {projectStatus(project)}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className={`w-6 h-6 justify-self-end transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:rotate-45'}`}
                  />
                </button>
              </h3>

              {/* grid-rows 0fr -> 1fr animates to the content's natural height without measuring it */}
              <div
                id={panelId}
                role="region"
                aria-label={project.title}
                // Collapsed panels: links inside must not be reachable by Tab.
                ref={(el) => {
                  if (el) el.inert = !isOpen;
                }}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[4rem_minmax(0,1fr)] gap-4 pb-8 pt-1">
                    <span aria-hidden />
                    <div className="space-y-6 max-w-3xl">
                      <p className="body-text">{project.description}</p>
                      <ProjectTags tags={project.tags} />
                      <ProjectLinkButtons project={project} />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProjectIndex;
