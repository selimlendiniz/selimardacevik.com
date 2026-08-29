# selimardacevik.com

Personal website and blog for Selim Arda Çevik. It has two audiences: people
evaluating him professionally (recruiters, interviewers, collaborators) and
readers of the blog. Everything on the site should be fast to load, easy to
scan, and honest — this page is handed out during job interviews.

## Stack

- **Astro 5** — static output, zero client JS by default
- **MDX** — blog posts and any page that mixes prose with components
- **Tailwind CSS** — styling, including dark mode
- **TypeScript** — strict mode
- **pnpm** — package manager (never use npm or yarn here)
- **Vercel** — hosting, custom domain `selimardacevik.com`

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # local dev server (http://localhost:4321)
pnpm build         # production build into dist/
pnpm preview       # serve the production build locally
pnpm check         # astro check: type-check .astro/.ts files
```

Run `pnpm build` and `pnpm check` before claiming a change works. `pnpm dev`
alone does not catch content-collection schema errors or broken links in the
static output.

## Languages and routing

The site is bilingual. English is the default locale and lives at the root;
Turkish lives under `/tr`.

| Page      | English              | Turkish                  |
| --------- | -------------------- | ------------------------ |
| Home      | `/`                  | `/tr/`                   |
| Blog list | `/blog/`             | `/tr/blog/`              |
| Post      | `/blog/<slug>/`      | `/tr/blog/<slug>/`       |
| Projects  | `/projects/`         | `/tr/projeler/`          |
| CV        | `/cv/`               | `/tr/cv/`                |

Rules:

- Use Astro's built-in i18n routing with `defaultLocale: 'en'` and
  `prefixDefaultLocale: false`.
- All UI strings (nav labels, dates, buttons, meta text) come from a
  translation dictionary in `src/i18n/`. Never hardcode a user-facing string
  in a component.
- A post does not have to exist in both languages. When a translation is
  missing, the language switcher points at that language's blog index rather
  than a 404.
- Every page emits `hreflang` alternate links for the languages it does have.

## Content

Blog posts are MDX files in the repository — there is no CMS. One file per
post per language:

```
src/content/blog/en/my-post.mdx
src/content/blog/tr/my-post.mdx
```

The filename is the slug and is shared across languages, which is what links
a post to its translation.

Frontmatter schema (enforced in `src/content.config.ts`):

```yaml
---
title: "Post title"
description: "One or two sentences, used for the post list and meta tags."
pubDate: 2026-08-29        # required, ISO date
updatedDate: 2026-09-02    # optional
tags: ["astro", "typescript"]
draft: false               # drafts are excluded from production builds
---
```

Never loosen or bypass the schema to make a post build. Fix the frontmatter.

Projects live in a `projects` collection with the same pattern. Long-form CV
content lives in `src/content/cv/`, so the CV page and any PDF export read
from one source.

## Structure

```
src/
  config.ts       # name, tagline, intro, social links, CV pdf path
  content.config.ts  # collection schemas
  components/     # .astro components, one purpose each
    pages/        # the body of each page, shared by both languages
  layouts/        # BaseLayout: html shell, head, header, footer
  lib/            # content queries (content.ts) and the RSS builder (rss.ts)
  pages/          # routes; src/pages/tr/ mirrors the English tree
  content/        # blog/<lang>/, projects/<lang>/, cv/<lang>.json
  i18n/           # ui.ts (routes + strings), utils.ts (helpers)
  styles/         # global.css: Tailwind import, theme tokens, dark variant
public/           # static assets served as-is (favicon, cv.pdf)
```

Pages under `src/pages/` are thin wrappers: they pick the language, set the
title/description/alternates, and render a component from
`src/components/pages/`. Page markup is written once and used by both
languages — do not fork a page component per locale.

## Conventions

- Prefer a plain `.astro` component over a framework island. Add a React or
  Svelte island only when a feature genuinely needs client-side state, and
  give it the narrowest `client:*` directive that works.
- Style with Tailwind utilities. Put shared design decisions (colors, fonts,
  spacing scale) in the Tailwind theme, not in repeated utility strings.
- Dark mode uses Tailwind's `dark:` variant driven by a `class` on `<html>`,
  with the user's choice persisted and system preference as the default.
- Images go through Astro's `<Image />` so they get sized and optimized.
- Every page sets a title, description, canonical URL, and Open Graph tags.
- Keep the dependency list small. Ask before adding a package; most things
  this site needs are already in Astro or Tailwind.
- Accessibility is not optional: real landmark elements, visible focus
  states, alt text on meaningful images, contrast that passes WCAG AA.

## Build output expectations

- The site must build with zero `pnpm astro check` errors.
- The blog index and each post are statically generated — no runtime data
  fetching in the default path.
- `/rss.xml` (English) and `/tr/rss.xml` (Turkish) are generated from the
  blog collection.
- A `sitemap` covering both locales is generated on build.
- Every page carries `hreflang` links for the languages it exists in, plus
  `x-default` pointing at the English version.

## Deployment

Vercel builds from the default branch and deploys to `selimardacevik.com`.
Pull requests get preview deployments. Do not commit secrets — this is a
static site and should need no runtime environment variables; if one becomes
necessary, it goes in Vercel's project settings, never in the repo.

## Working on this repo

- Biographical text, project descriptions, and CV facts come from Selim. Do
  not invent employers, dates, titles, or accomplishments — ask instead.
- When adding a feature, check whether an existing component or i18n key
  already covers it before creating a new one.
- Keep changes scoped. This is a small site; a change to the blog list should
  not restructure the layout system.
