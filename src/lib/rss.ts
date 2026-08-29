import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { SITE } from '~/config';
import { languages, routes, ui, type Lang } from '~/i18n/ui';
import { postPath } from '~/i18n/utils';
import { getPosts } from '~/lib/content';

const parser = new MarkdownIt({ html: true, linkify: true });

/**
 * Feeds carry the whole post, not just the description. Bodies are rendered
 * from Markdown here rather than through Astro, so a post that leans on MDX
 * components will show their plain output in the feed.
 */
function renderBody(body: string | undefined, site: URL | string): string {
  const html = sanitizeHtml(parser.render(body ?? ''), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
      code: ['class'],
      span: ['class'],
      pre: ['class'],
    },
  });
  // Feed readers have no page context, so relative links must be absolute.
  return html.replace(/(href|src)="\/([^"]*)"/g, (_match, attr, path) => {
    return `${attr}="${new URL(`/${path}`, site).href}"`;
  });
}

/** One feed per language, built from that language's published posts. */
export async function buildFeed(lang: Lang, context: APIContext) {
  const site = context.site ?? SITE.url;
  const posts = await getPosts(lang);

  return rss({
    title: `${SITE.name} — ${languages[lang]}`,
    description: ui[lang]['blog.description'],
    site,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: postPath(lang, post.slug),
      content: renderBody(post.body, site),
    })),
    customData: `<language>${lang}</language><atom:link href="${new URL(routes[lang].rss, site)}" rel="self" type="application/rss+xml"/>`,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
  });
}
