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
pnpm build         # production build into dist/, then the Pagefind index
pnpm build:astro   # the Astro build alone, without Pagefind
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
| Blog list | `/blog/`, `/blog/2/` | `/tr/blog/`, `/tr/blog/2/` |
| Post      | `/blog/<slug>/`      | `/tr/blog/<slug>/`       |
| Tag       | `/blog/tags/<tag>/`  | `/tr/blog/tags/<tag>/`   |
| Tag index | `/blog/tags/`        | `/tr/blog/tags/`         |
| Search    | `/search/`           | `/tr/ara/`               |
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
cover: "../_media/post.png"  # optional, optimized by astro:assets
coverAlt: "What the cover shows"
ogImage: "/og-post.png"    # optional, overrides the default link preview
---
```

Cover images live in `src/content/blog/_media/` and are referenced by a path
relative to the post. They are resolved by `astro:assets`, so they get resized
and served as WebP; a cover also becomes the post's link preview image unless
`ogImage` overrides it.

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
- Link previews fall back to `public/og-default.png`. Regenerate that card from
  `scripts/og-source.html` — the instructions are in the file's comment.
- Pages carry schema.org data built in `src/lib/schema.ts`: a single `Person`
  node (home and CV), `WebSite` on the home page, `BlogPosting` on posts. Keep
  the `@id` values stable so the nodes stay linked.
- `/cv/` is the printable CV. Its print rules live at the bottom of
  `global.css`; anything that should not print gets `data-print-hide`. Check
  print output when changing that page.
- Keep the dependency list small. Ask before adding a package; most things
  this site needs are already in Astro or Tailwind.
- Accessibility is not optional: real landmark elements, visible focus
  states, alt text on meaningful images, contrast that passes WCAG AA.
- Headings in posts are wrapped in a link to their own id by
  `rehype-autolink-headings`. The `#` marker is drawn in CSS on purpose: an
  extra text node would end up in the table of contents Astro derives from the
  headings.

## Build output expectations

- The site must build with zero `pnpm astro check` errors.
- The blog index and each post are statically generated — no runtime data
  fetching in the default path.
- `/rss.xml` (English) and `/tr/rss.xml` (Turkish) are generated from the
  blog collection.
- `robots.txt` points at the sitemap index.
- Feeds carry the full post body, rendered from Markdown by `markdown-it` in
  `src/lib/rss.ts` rather than through Astro. A post that leans on MDX
  components will show their plain output in the feed.
- Search is Pagefind, indexed from `dist/` after the Astro build. Only elements
  marked `data-pagefind-body` are indexed — that is the post `<article>` — and
  Pagefind keeps a separate index per language, so a search on `/tr/ara/`
  returns Turkish posts only. The index does not exist on the dev server; use
  `pnpm build && pnpm preview` to try search locally.
- Blog lists are paginated at 10 posts per page; pages after the first are
  `noindex`.
- A `sitemap` covering both locales is generated on build. Pages that are
  `noindex` — the search pages and blog list pages after the first — are kept
  out of it by the `filter` in `astro.config.mjs`; a sitemap that lists
  noindex URLs is reported as an error in Search Console.
- Every page carries `hreflang` links for the languages it exists in, plus
  `x-default` pointing at the English version.

## Deployment

Vercel builds from the default branch and serves the site at
`www.selimardacevik.com`; the apex redirects there. Absolute URLs — canonical
links, Open Graph, RSS, sitemap — come from `site` in `astro.config.mjs` and
must name the host that actually serves, or previews and canonicals point
through a redirect.
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
