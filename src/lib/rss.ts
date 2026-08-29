import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '~/config';
import { languages, routes, ui, type Lang } from '~/i18n/ui';
import { postPath } from '~/i18n/utils';
import { getPosts } from '~/lib/content';

/** One feed per language, built from that language's published posts. */
export async function buildFeed(lang: Lang, context: APIContext) {
  const posts = await getPosts(lang);

  return rss({
    title: `${SITE.name} — ${languages[lang]}`,
    description: ui[lang]['blog.description'],
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: postPath(lang, post.slug),
    })),
    customData: `<language>${lang}</language><atom:link href="${new URL(routes[lang].rss, context.site ?? SITE.url)}" rel="self" type="application/rss+xml"/>`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  });
}
