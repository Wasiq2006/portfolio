import {
  Code2,
  Server,
  Cpu,
  Wrench,
  Brain,
  Layers,
  Box,
} from 'lucide-react';
import SectionBlock from './SectionBlock';
import GithubGraph from './GithubGraph';

const skillCategories = [
  {
    title: 'Cybersecurity Fundamentals',
    icon: <Server className="w-5 h-5" />,
    color: 'bg-red-50',
    skills: [
      'Network Security',
      'Cryptography',
      'OSI Model',
      'Penetration Testing',
      'Threat Analysis',
      'Vulnerability Assessment',
      'Security Protocols',
    ],
  },
  {
    title: 'Artificial Intelligence',
    icon: <Brain className="w-5 h-5" />,
    color: 'bg-orange-50',
    skills: [
      'Computer Vision',
      'YOLOv8',
      'Object Detection',
      'Model Inference',
      'Severity Scoring',
      'FastAPI',
    ],
  },
  {
    title: 'Linux & System Administration',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-green-50',
    skills: [
      'Linux Kernel',
      'Shell Scripting',
      'System Configuration',
      'User Management',
      'Process Management',
      'File Systems',
      'Network Configuration',
    ],
  },
  {
    title: 'Security Tools & Techniques',
    icon: <Wrench className="w-5 h-5" />,
    color: 'bg-purple-50',
    skills: [
      'Wireshark',
      'Metasploit',
      'Burp Suite',
      'Nmap',
      'OWASP',
      'IDS/IPS',
      'Firewall Configuration',
    ],
  },
  {
    title: 'Programming Languages',
    icon: <Cpu className="w-5 h-5" />,
    color: 'bg-blue-50',
    skills: [
      'Python',
      'Powershell',
      'C++',
      'Bash/Shell',
      'SQL',
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: <Layers className="w-5 h-5" />,
    color: 'bg-gray-50',
    skills: [
      'Git',
      'Docker',
      'Kubernetes',
      'CI/CD Pipelines',
      'AWS',
      'Kali Linux',
      'GitHub',
      'Jenkins',
      'Terraform',
      'Monitoring Tools',
    ],
  },
];

const SkillsSection = () => {
  return (
    <SectionBlock id="skills" title="Technical Arsenal">
      <div className="flex flex-col gap-16">
        {/* Skill Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <div
              key={category.title}
              className="group border-2 border-foreground p-6 bg-card hover:-translate-y-1 transition-all duration-300 relative rounded-none"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 border-2 border-foreground bg-foreground text-background group-hover:bg-card group-hover:text-foreground transition-colors rounded-none">
                  {category.icon}
                </div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 border border-foreground/10 text-[11px] font-mono hover:border-foreground hover:bg-foreground/5 transition-all cursor-default rounded-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Final "Load" Card */}
          <div className="border-2 border-foreground p-6 bg-foreground/5 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity rounded-none">
            <Box className="w-8 h-8 mb-4 opacity-20" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-medium">
              // Always Learning...
            </p>
          </div>
        </div>

        {/* Activity Section */}
        <div className="w-full pt-12 border-t-4 border-foreground border-dashed">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-none animate-pulse" />
                Live Pulse
              </h3>
              <div className="h-[2px] flex-1 bg-foreground/10"></div>
            </div>
            <GithubGraph />
          </div>
        </div>
      </div>
    </SectionBlock>
  );
};

export default SkillsSection;
