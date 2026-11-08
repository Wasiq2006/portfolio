# CLAUDE.md — Muhammad Wasiq's Portfolio

Context and conventions for AI assistants working on this codebase.

## Project Overview

Personal portfolio for Muhammad Wasiq Mansoor (Cybersecurity & Cloud Security Engineer), live at **https://www.wasiq.tech**. It is a static, client-side React SPA with a neo-brutalist look: matrix-rain hero, an interactive terminal (Ctrl+K), a GitHub contribution graph, scroll-driven 3D cards, a markdown blog, sound effects and a two-theme toggle.

There is **no backend**. It deploys to Vercel as static files (`vercel.json`).

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (`strict` off) |
| Bundler | Vite 5 with SWC plugin |
| Styling | Tailwind CSS 3 + CSS variables, `tailwindcss-animate` |
| Animation | framer-motion, GSAP, Lenis (smooth scroll) |
| Routing | React Router DOM v6 |
| Icons | lucide-react |
| Analytics | `@vercel/analytics` |
| Testing | Vitest + Testing Library + jsdom |
| Package manager | npm |

## Directory Structure

```
public/                 # Served as-is: favicon.svg, resume.pdf, robots.txt, images/
scripts/
  generate-blog-static-pages.js   # Post-build: per-post HTML for link previews + sitemap.xml
  optimize-og-images.js           # Makes <image>_og.jpg previews from blog PNGs
src/
  App.tsx               # ThemeProvider, router, theme-transition overlay, lazy BlogDetail
  data/
    constants.ts        # PROFILE, SOCIAL_LINKS, SITE_URL — single source of profile data
    blog.json           # Blog posts (markdown in `content`)
  pages/                # Index (all sections), BlogDetail (/blog/:id), NotFound
  components/           # One file per section + effects (Terminal, CustomCursor, EasterEgg, ...)
    ThemeProvider.tsx   # Owns theme + transition state
    ui/badge.tsx        # Only remaining shadcn primitive
  hooks/
    useTheme.ts         # ThemeContext + useTheme() (must be under <ThemeProvider>)
    useSoundEffects.ts  # Web Audio click/hover/terminal sounds
    use-mobile.tsx      # 768px breakpoint
  test/                 # setup.ts (matchMedia mock) + *.test.tsx
```

## Commands

```bash
npm run dev          # Dev server at http://localhost:8080
npm run build        # vite build + generate blog pages and sitemap → dist/
npm run preview      # Serve dist/
npm run lint         # ESLint
npm test             # Vitest (once)
npm run type-check   # tsc --noEmit
```

## Key Conventions

- Use the `@/` alias for imports from `src/`.
- Profile data, links and the site URL live in `src/data/constants.ts`. Don't hardcode them in components.
- **Canonical origin is `https://www.wasiq.tech`** (with `www`). It is defined as `SITE_URL` in both `src/data/constants.ts` and `scripts/generate-blog-static-pages.js`; keep them in sync.
- Theme: two themes, `light` and `midnight-indigo`, applied as a class on `<html>`. Read and toggle them via `useTheme()`; never create a second source of theme state.
- Wrap new portfolio sections in `<SectionBlock id=... title=...>` and add them to `src/pages/Index.tsx` plus a nav link in `Navbar.tsx`.
- Before adding a dependency, check it's actually needed; unused shadcn/Radix starter packages were removed on purpose.

## Blog

- Posts live in `src/data/blog.json` (`id`, `title`, `brief`, `publishedAt`, `readTime`, `image`, `mediumUrl`, `content`).
- `BlogDetail.tsx` has its own small markdown renderer (headings, lists, code blocks, quotes, images, links).
- On build, `generate-blog-static-pages.js` writes `dist/blog/<id>/index.html` with that post's title/OG/canonical tags (crawlers like WhatsApp don't run JS) and generates `dist/sitemap.xml`. Adding a post to `blog.json` is enough; don't hand-edit a sitemap.
- For a new post image `Foo.png`, add it to the `imageFiles` list in `scripts/optimize-og-images.js`, then run `node scripts/optimize-og-images.js` to create `Foo_og.jpg` (small enough for WhatsApp previews).

## Implementation Notes

- `HeroSection.tsx` matrix rain uses `requestAnimationFrame` and respects `prefers-reduced-motion`; always cancel the loop in the effect cleanup.
- `Terminal.tsx` registers a global Ctrl/Cmd+K listener; commands are `case` branches in its command handler.
- The contact form opens the visitor's mail client (`mailto:`), with no network request.
- `GithubGraph.tsx` shows the `Wasiq2006` GitHub calendar.
- `SmoothScroll.tsx` runs Lenis and starts after the `loading-animation-complete` event from `LoadingPage`.

## Git

- Default branch: `main`. Deploys happen through Vercel's Git integration.
