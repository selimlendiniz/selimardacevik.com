import { defaultLang, languages, routes, ui, type Lang, type RouteKey, type UIKey } from './ui';

export function isLang(value: string): value is Lang {
  return value in languages;
}

/** Reads the locale out of a URL: /tr/... is Turkish, everything else English. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first && isLang(first) ? first : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function route(lang: Lang, key: RouteKey): string {
  return routes[lang][key];
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'tr' : 'en';
}

/**
 * Content entry ids look like `en/my-post`. Split them into locale and slug so
 * one collection can serve both languages and translations stay linked by slug.
 */
export function parseEntryId(id: string): { lang: Lang; slug: string } {
  const [maybeLang, ...rest] = id.split('/');
  if (maybeLang && isLang(maybeLang) && rest.length > 0) {
    return { lang: maybeLang, slug: rest.join('/') };
  }
  return { lang: defaultLang, slug: id };
}

export function postPath(lang: Lang, slug: string): string {
  return `${routes[lang].blog}${slug}/`;
}

export function tagPath(lang: Lang, tag: string): string {
  return `${routes[lang].blog}tags/${encodeURIComponent(tag)}/`;
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function readingTime(body: string | undefined, lang: Lang): string {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} ${ui[lang]['blog.minRead']}`;
}

export { defaultLang, languages, routes, ui };
export type { Lang, RouteKey, UIKey };
