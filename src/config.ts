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
  tagline: {
    en: 'Platform engineer',
    tr: 'Platform mühendisi',
  },
  intro: {
    en: 'I work across infrastructure and application code: the pipelines, containers, and environments a team ships through, and the product code that runs on top of them. This site collects what I build and what I write about it.',
    tr: 'Altyapı ile uygulama kodu arasında çalışıyorum: bir ekibin ürünü sahaya çıkardığı hatlar, container\'lar ve ortamlar; bir de üstünde koşan ürün kodu. Bu site geliştirdiğim işleri ve yazdıklarımı topluyor.',
  },
  email: 'sardacevik@gmail.com',
  social: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
  },
  /** Path to the downloadable CV in public/, or null to hide the button. */
  cvPdf: null as string | null,
} as const;
