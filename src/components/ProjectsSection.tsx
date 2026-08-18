import { Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionBlock from './SectionBlock';
import { Badge } from './ui/badge';
import { playHover, playClick } from '@/hooks/useSoundEffects';
import Scroll3DCard from './Scroll3DCard';

const projects = [
  {
    title: 'ZabCal',
    isNew: true,
    description:
      'A comprehensive CGPA calculator web application designed specifically for SZABIST students. Calculate your GPA easily with an intuitive interface.',
    tags: [
      'React',
      'Web App',
      'CGPA Calculator',
      'SZABIST',
      'TypeScript',
      'Vercel',
    ],
    githubUrl: 'https://github.com/Wasiq2006/zabcal',
    liveUrl: 'https://zabcal.vercel.app/',
  },
  {
    title: 'Android Based Home Server',
    description:
      'Fully functional home server built on Android 14 device with Jellyfin, Samba, and cybersecurity lab.',
    tags: [
      'Android',
      'Jellyfin',
      'Samba',
      'Home Server',
      'Cybersecurity Lab',
      'Linux',
    ],
    githubUrl: '#',
    liveUrl: '/blog/android-home-server',
  },
];

const ProjectsSection = () => {
  const navigate = useNavigate();

  return (
    <SectionBlock id="projects" title="Projects">
      <div
        className="flex md:grid md:grid-cols-2 lg:grid-cols-2 gap-8 overflow-x-auto md:overflow-x-visible pt-6 pb-12 md:py-0 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0 touch-pan-x touch-pan-y"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {projects.map((project) => (
          <Scroll3DCard
            key={project.title}
            className="min-w-[300px] w-full md:w-auto snap-start flex-shrink-0 md:flex-shrink"
          >
            <div
              className="group relative border-4 border-foreground p-8 flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 bg-card h-full rounded-none"
              style={{ boxShadow: '10px 10px 0px 0px transparent' }}
              onMouseEnter={(e) => { playHover(); (e.currentTarget as HTMLElement).style.boxShadow = '10px 10px 0px 0px currentColor'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '10px 10px 0px 0px transparent'; }}
            >
              {'isNew' in project && project.isNew && (
                <div className="absolute -top-3 -right-3 bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase tracking-tighter border-4 border-foreground z-10 rotate-12 group-hover:rotate-6 transition-transform rounded-none">
                  LATEST WORK
                </div>
              )}
              <div>
                <h3 className="text-xl font-black text-foreground group-hover:underline decoration-4 underline-offset-4">
                  {project.title}
                </h3>
                <p className="body-text mt-4 text-sm font-normal leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-mono text-[10px] font-bold border border-foreground/10 px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-foreground/10">
                {project.title !== 'Android Based Home Server' && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none"
                    style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
                  >
                    <Github className="w-3.5 h-3.5" />
                    Source
                  </a>
                )}
                {project.title === 'Android Based Home Server' ? (
                  <button
                    onClick={() => {
                      playClick();
                      navigate('/blog/android-home-server');
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none w-full"
                    style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Read Blog
                  </button>
                ) : (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClick}
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none"
                    style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </Scroll3DCard>
        ))}
      </div>

      <div className="mt-12 flex justify-center md:justify-start">
        <a
          href="https://github.com/Wasiq2006"
          target="_blank"
          rel="noopener noreferrer"
          onClick={playClick}
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-1 hover:gap-4 transition-all"
        >
          <Github className="w-4 h-4" />
          View All Projects
        </a>
      </div>
    </SectionBlock>
  );
};

export default ProjectsSection;
