import {
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';
import { PROFILE, SOCIAL_LINKS } from '@/data/constants';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

const Finale = () => {
  const currentYear = new Date().getFullYear();

  const marqueeTags = [
    `${PROFILE.shortName} 🚀`,
    'Cyber Security & Artificial Intelligence | Linux Admin',
    'Building secure infrastructure & threat prevention systems 🔒',
    'Securing systems, automating workflows, solving critical vulnerabilities',
  ];

  return (
    <section className="relative w-full bg-background border-t-8 border-foreground pt-20 overflow-hidden">
      {/* ... marquee ... */}
      <div className="absolute top-0 left-0 w-full py-4 bg-foreground overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex items-center shrink-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center">
              {marqueeTags.map((tag) => (
                <span
                  key={tag}
                  className="text-background font-mono text-xs uppercase tracking-[0.3em] mx-10"
                >
                  {tag}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* ... content ... */}
        <div className="relative mb-20 text-center">
          <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-none tracking-tighter text-foreground/5 absolute -top-1/2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            THANK YOU
          </h2>
          <p className="text-xl md:text-3xl font-black uppercase tracking-tight italic z-10 relative">
            Let's build something{' '}
            <span className="text-background bg-foreground px-4 py-1 not-italic rounded-none tracking-normal">
              unforgettable
            </span>{' '}
            together.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full place-items-center max-w-lg mx-auto">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.id];
            if (!Icon) return null;
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group flex flex-col items-center justify-center p-8 border-2 border-foreground bg-card hover:bg-foreground transition-all duration-300 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] rounded-none"
                style={{ boxShadow: '8px 8px 0px 0px currentColor' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0px 0px currentColor'; }}
              >
                <Icon className="w-8 h-8 group-hover:text-card transition-colors duration-300" />
                <span className="mt-4 font-mono text-xs uppercase tracking-widest font-black group-hover:text-background">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Extreme Bottom Bar */}
      <div className="w-full bg-background pt-10 pb-24 md:pb-10 px-6 mt-auto border-t border-foreground/10">
        <div className="max-w-6xl mx-auto flex justify-center items-center opacity-70">
          <p className="text-[10px] md:text-[11px] font-mono text-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] text-center">
            © {currentYear} {PROFILE.name}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Finale;
