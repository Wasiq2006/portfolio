// ──────────────────────────────────────
// Single source of truth for projects.
// Used by the desktop index, the phone deck and the terminal `projects` command.
// ──────────────────────────────────────

export interface ProjectLinks {
  /** Source code (external). */
  source?: string;
  /** Live demo (external). */
  live?: string;
  /** In-site blog write-up route, e.g. /blog/android-home-server. */
  blog?: string;
}

export interface Project {
  /** Stable id used for keys and DOM ids. */
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** Shown with a "Latest work" label. */
  featured?: boolean;
  links: ProjectLinks;
}

export const PROJECTS: Project[] = [
  {
    id: 'shehri-ai',
    title: 'Shehri AI',
    featured: true,
    description:
      'An AI-powered civic reporting platform for potholes and garbage. YOLOv8 models detect and score issues from photos, geotag them via EXIF GPS, and plot them on a live city heatmap, served by a hardened, rate-limited FastAPI backend.',
    tags: ['Python', 'FastAPI', 'YOLOv8', 'Computer Vision', 'React', 'Firebase', 'Leaflet'],
    links: { source: 'https://github.com/Wasiq2006/Shehri-AI' },
  },
  {
    id: 'wrat',
    title: 'WRAT',
    description:
      'A Python-based Remote Administration Tool that uses Discord WebSockets for Command and Control (C2), enabling remote monitoring, diagnostics, screen/webcam surveillance, and interactive PowerShell control.',
    tags: ['Python', 'Remote Administration Tool', 'Discord WebSockets', 'Cybersecurity', 'C2'],
    links: { source: 'https://github.com/Wasiq2006/WRAT' },
  },
  {
    id: 'zabcal',
    title: 'ZabCal',
    description:
      'A comprehensive CGPA calculator web application designed specifically for SZABIST students. Calculate your GPA easily with an intuitive interface.',
    tags: ['React', 'Web App', 'CGPA Calculator', 'SZABIST', 'TypeScript', 'Vercel'],
    links: {
      source: 'https://github.com/Wasiq2006/zabcal',
      live: 'https://zabcal.vercel.app/',
    },
  },
  {
    id: 'android-home-server',
    title: 'Android Based Home Server',
    description:
      'Fully functional home server built on Android 14 device with Jellyfin, Samba, and cybersecurity lab.',
    tags: ['Android', 'Jellyfin', 'Samba', 'Home Server', 'Cybersecurity Lab', 'Linux'],
    links: { blog: '/blog/android-home-server' },
  },
];

/** Short status label derived from which links a project has. */
export const projectStatus = (project: Project): 'Live' | 'Write-up' | 'Open source' | 'Private' => {
  if (project.links.live) return 'Live';
  if (project.links.blog) return 'Write-up';
  if (project.links.source) return 'Open source';
  return 'Private';
};
