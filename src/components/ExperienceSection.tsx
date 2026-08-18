import SectionBlock from './SectionBlock';
import { playHover } from '@/hooks/useSoundEffects';

interface ExperienceItem {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  description: React.ReactNode;
}

const experiences: ExperienceItem[] = [
  {
    role: 'Community Admin & Linux Mentor',
    company: 'CS-Connect Pakistan',
    companyUrl: 'https://csconnect.pk/',
    period: '2025 - Present',
    description: (
      <>
        <ul className="list-disc list-inside space-y-2">
          <li>Manage the community by monitoring the groups, helping students</li>
          <li>Help people get into Linux and Open-Source</li>
          <li>Research and Develop(R&D) and QA Tester For <a href="https://unicalc.csconnect.pk/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Unicalc</a> project</li>
        </ul>
      </>
    ),
  },
];

const ExperienceSection = () => (
  <SectionBlock id="experience" title="Experience">
    <div className="space-y-12">
      {experiences.length === 0 ? (
        <p className="body-text text-foreground/60">
          No professional experience yet. I'm actively working on hands-on projects and building my portfolio.
        </p>
      ) : (
        experiences.map((exp) => (
          <div
            key={exp.role}
            className="relative pl-8 md:pl-0 border-l md:border-l-0 border-foreground/20 md:grid md:grid-cols-[1fr_2fr] md:gap-8 pb-12 last:pb-0"
            onMouseEnter={playHover}
          >
            <div className="md:text-right md:pr-8 md:border-r border-foreground/20 relative">
              <div className="hidden md:block absolute top-1 -right-[5px] w-[9px] h-[9px] rounded-none bg-foreground"></div>
              <div className="md:hidden absolute top-1 -left-[5px] w-[9px] h-[9px] rounded-none bg-foreground"></div>
              <h4 className="font-mono text-xs tracking-widest text-foreground/60 uppercase mb-1">
                {exp.period}
              </h4>
              <h3 className="font-bold text-base md:text-lg">
                {exp.companyUrl ? (
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </h3>
            </div>
            <div className="mt-2 md:mt-0">
              <h3 className="text-base font-bold text-foreground md:hidden mb-2">
                {exp.role}
              </h3>
              <h3 className="text-lg font-bold text-foreground hidden md:block mb-3">
                {exp.role}
              </h3>
              <p className="body-text text-sm">{exp.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </SectionBlock>
);

export default ExperienceSection;
