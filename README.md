# selimardacevik.com

Personal website and blog. Bilingual (English at the root, Turkish under
`/tr`), statically generated, deployed on Vercel.

## Stack

Astro · MDX · Tailwind CSS · TypeScript · pnpm

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview    # serve the production build
pnpm check      # type-check
```

## Writing a post

Create `src/content/blog/<lang>/<slug>.mdx`. The filename is the URL slug and
links a post to its translation in the other language:

```mdx
---
title: 'Post title'
description: 'One or two sentences.'
pubDate: 2026-08-29
tags: ['astro']
draft: false
---

Post body in MDX.
```

Drafts are visible in `pnpm dev` and excluded from production builds. A post
does not need to exist in both languages.

Projects live in `src/content/projects/<lang>/`, CV data in
`src/content/cv/<lang>.json`, and site-wide details (name, tagline, links) in
`src/config.ts`.

Conventions for this repository are documented in [CLAUDE.md](./CLAUDE.md).
