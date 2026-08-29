/**
 * Site-wide facts. This is the only file that should need editing when
 * personal details change.
 *
 * PLACEHOLDER values are marked below — replace them with real information
 * before the site goes live.
 */
export const SITE = {
  url: 'https://selimardacevik.com',
  name: 'Selim Arda Çevik',
  /** PLACEHOLDER — one short line describing what you do. */
  tagline: {
    en: 'Software developer',
    tr: 'Yazılım geliştirici',
  },
  /** PLACEHOLDER — two or three sentences for the home page. */
  intro: {
    en: 'I build software. This site collects what I work on and what I write about it.',
    tr: 'Yazılım geliştiriyorum. Bu site üzerinde çalıştığım işleri ve yazdıklarımı topluyor.',
  },
  email: 'sardacevik@gmail.com',
  social: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
  },
  /** Path to the downloadable CV in public/, or null to hide the button. */
  cvPdf: null as string | null,
} as const;
