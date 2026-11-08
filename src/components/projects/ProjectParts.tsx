import { Github, ExternalLink, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { playClick } from '@/hooks/useSoundEffects';
import type { Project } from '@/data/projects';

const buttonClass =
  'flex items-center justify-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-foreground hover:text-background rounded-none';
const buttonShadow = { boxShadow: '4px 4px 0px 0px currentColor' };

/** Source / Live demo / Read write-up buttons, shown only for links the project has. */
export const ProjectLinkButtons = ({ project }: { project: Project }) => {
  const { source, live, blog } = project.links;
  if (!source && !live && !blog) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {source && (
        <a href={source} target="_blank" rel="noopener noreferrer" onClick={playClick} className={buttonClass} style={buttonShadow}>
          <Github className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden />
          Source
        </a>
      )}
      {live && (
        <a href={live} target="_blank" rel="noopener noreferrer" onClick={playClick} className={buttonClass} style={buttonShadow}>
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden />
          Live demo
        </a>
      )}
      {blog && (
        <Link to={blog} onClick={playClick} className={buttonClass} style={buttonShadow}>
          <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden />
          Read write-up
        </Link>
      )}
    </div>
  );
};

export const ProjectTags = ({ tags }: { tags: string[] }) => (
  <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
    {tags.map((tag) => (
      <li key={tag}>
        <Badge variant="secondary" className="font-mono text-[10px] md:text-xs font-bold border border-foreground/10 px-2 py-1">
          {tag}
        </Badge>
      </li>
    ))}
  </ul>
);

export const LatestWorkLabel = ({ className = '' }: { className?: string }) => (
  <span
    className={`inline-block bg-foreground text-background px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter border-2 border-foreground rounded-none ${className}`}
  >
    Latest work
  </span>
);
