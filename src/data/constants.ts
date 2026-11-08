// ──────────────────────────────────────
// Single source of truth for all profile data
// ──────────────────────────────────────

export const PROFILE = {
  name: 'Wasiq Mansoor',
  shortName: 'Wasiq Mansoor',
  alias: 'Wasiq',
  email: 'wasiqmansoor2006@gmail.com',
  website: 'www.wasiq.tech',
} as const;

/** Canonical origin. Keep in sync with SITE_URL in scripts/generate-blog-static-pages.js. */
export const SITE_URL = 'https://www.wasiq.tech';

export const SOCIAL_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/Wasiq2006',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-wasiq-mansoor-35332927a',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:wasiqmansoor2006@gmail.com',
  },
] as const;

export type SocialLinkId = (typeof SOCIAL_LINKS)[number]['id'];

/** Helper to get a social link by id */
export const getSocialLink = (id: SocialLinkId) =>
  SOCIAL_LINKS.find((link) => link.id === id)!;
