import { SITE } from '~/config';
import { routes, type Lang } from '~/i18n/ui';
import type { Post } from '~/lib/content';

/** The one Person node every other schema points at. */
export function personSchema(lang: Lang, site: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${new URL('/', site)}#person`,
    name: SITE.name,
    url: new URL(routes[lang].home, site).href,
    email: `mailto:${SITE.email}`,
    jobTitle: SITE.tagline[lang],
    description: SITE.intro[lang],
    sameAs: [SITE.social.github, SITE.social.linkedin],
  };
}

export function websiteSchema(lang: Lang, site: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${new URL('/', site)}#website`,
    url: new URL(routes[lang].home, site).href,
    name: SITE.name,
    inLanguage: lang,
    author: { '@id': `${new URL('/', site)}#person` },
  };
}

export function blogPostingSchema(post: Post, lang: Lang, url: URL, site: URL | string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    datePublished: post.data.pubDate.toISOString(),
    ...(post.data.updatedDate && { dateModified: post.data.updatedDate.toISOString() }),
    inLanguage: lang,
    keywords: post.data.tags,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url.href },
    author: { '@id': `${new URL('/', site)}#person` },
    publisher: { '@id': `${new URL('/', site)}#person` },
    ...(image && { image: new URL(image, site).href }),
  };
}
