import { useRef, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { playHover, playClick } from '@/hooks/useSoundEffects';
import Scroll3DCard from './Scroll3DCard';
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';

const projects = [
  {
    title: 'WRAT',
    isNew: true,
    description:
      'A Python-based Remote Administration Tool that uses Discord WebSockets for Command and Control (C2), enabling remote monitoring, diagnostics, screen/webcam surveillance, and interactive PowerShell control.',
    tags: [
      'Python',
      'Remote Administration Tool',
      'Discord WebSockets',
      'Cybersecurity',
      'C2',
    ],
    githubUrl: 'https://github.com/Wasiq2006/WRAT',
  },
  {
    title: 'ZabCal',
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

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const ProjectCard = ({ project, index, total, scrollYProgress }: ProjectCardProps) => {
  const navigate = useNavigate();

  const getScaleRange = () => {
    if (index === 0) return [0, 0, 0.5];
    if (index === 1) return [0, 0.5, 1];
    if (index === 2) return [0.5, 1, 1];
    return [0, 0.5, 1];
  };

  const getScaleOutput = () => {
    if (index === 0) return [1, 1, 0.75];
    if (index === 1) return [0.75, 1, 0.75];
    if (index === 2) return [0.75, 1, 1];
    return [0.75, 1, 0.75];
  };

  const scale = useTransform(scrollYProgress, getScaleRange(), getScaleOutput());

  const getOpacityRange = () => {
    if (index === 0) return [0, 0.05, 0.45, 0.55];
    if (index === 1) return [0, 0.45, 0.55, 1];
    if (index === 2) return [0.45, 0.55, 1, 1];
    return [0, 0.45, 0.55, 1];
  };

  const getOpacityOutput = () => {
    if (index === 0) return [1, 1, 1, 0];
    if (index === 1) return [0, 1, 1, 0];
    if (index === 2) return [0, 1, 1, 1];
    return [0, 1, 1, 0];
  };

  const opacity = useTransform(scrollYProgress, getOpacityRange(), getOpacityOutput());

  return (
    <motion.div
      style={{ opacity, scale }}
      className="w-full max-w-2xl px-4 md:px-0"
    >
      <Scroll3DCard className="w-full h-auto">
        <div
          className="group relative border-4 border-foreground p-6 md:p-8 flex flex-col justify-between hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 bg-card h-full rounded-none touch-pan-x touch-pan-y"
          style={{ boxShadow: '10px 10px 0px 0px transparent', touchAction: 'pan-x pan-y' }}
          onMouseEnter={(e) => {
            playHover();
            (e.currentTarget as HTMLElement).style.boxShadow = '10px 10px 0px 0px currentColor';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '10px 10px 0px 0px transparent';
          }}
        >
          {'isNew' in project && project.isNew && (
            <div className="absolute -top-3 -right-3 bg-foreground text-background px-3 py-1 text-[10px] font-black uppercase tracking-tighter border-4 border-foreground z-10 rotate-12 group-hover:rotate-6 transition-transform rounded-none">
              LATEST WORK
            </div>
          )}
          <div>
            <h3 className="text-xl md:text-2xl font-black text-foreground group-hover:underline decoration-4 underline-offset-4">
              {project.title}
            </h3>
            <p className="body-text mt-4 text-sm md:text-base font-normal leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-6">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[10px] md:text-xs font-bold border border-foreground/10 px-2 py-1"
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
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none"
                style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
              >
                <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Source
              </a>
            )}
            {project.title === 'Android Based Home Server' ? (
              <button
                onClick={() => {
                  playClick();
                  navigate('/blog/android-home-server');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none w-full sm:w-auto"
                style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
              >
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Read Blog
              </button>
            ) : project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none"
                style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
              >
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Live Demo
              </a>
            ) : null}
          </div>
        </div>
      </Scroll3DCard>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (typeof latest !== 'number' || isNaN(latest)) return;
    const index = Math.min(projects.length - 1, Math.round(latest * (projects.length - 1)));
    setCurrentIndex(index);
  });

  // Translate the entire track horizontally
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(projects.length - 1) * 100}vw`]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        
        {/* Header - Fixed in view */}
        <div className="absolute top-20 md:top-32 w-full max-w-6xl left-1/2 -translate-x-1/2 px-6 flex justify-between items-start z-50 pointer-events-none">
          <h2 className="section-title text-4xl md:text-5xl lg:text-7xl">Projects.</h2>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div
              className="font-mono text-xs md:text-sm font-black border-2 border-foreground px-3 py-1 bg-card transition-all duration-300"
              style={{ boxShadow: '4px 4px 0px 0px currentColor' }}
            >
              {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Filmstrip Track */}
        <motion.div 
          className="flex h-full items-center will-change-transform pt-12 md:pt-0" 
          style={{ x, width: `${projects.length * 100}vw` }}
        >
          {projects.map((project, index) => (
            <div 
              key={project.title} 
              className="w-[100vw] flex-shrink-0 flex items-center justify-center"
            >
              <ProjectCard
                project={project}
                index={index}
                total={projects.length}
                scrollYProgress={scrollYProgress}
              />
            </div>
          ))}
        </motion.div>

        {/* Footer / View All Projects Link */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 z-50 flex md:justify-start pointer-events-auto">
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
      </div>
    </section>
  );
};

export default ProjectsSection;
