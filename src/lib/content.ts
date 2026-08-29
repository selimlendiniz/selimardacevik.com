import { getCollection, type CollectionEntry } from 'astro:content';
import { parseEntryId, type Lang } from '~/i18n/utils';

export type BlogEntry = CollectionEntry<'blog'>;
export type ProjectEntry = CollectionEntry<'projects'>;

export type Post = BlogEntry & { lang: Lang; slug: string };
export type Project = ProjectEntry & { lang: Lang; slug: string };

const includeDrafts = import.meta.env.DEV;

function withLocale<T extends { id: string }>(entry: T): T & { lang: Lang; slug: string } {
  return { ...entry, ...parseEntryId(entry.id) };
}

/** Published posts for one language, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const entries = await getCollection('blog', (entry: BlogEntry) =>
    includeDrafts ? true : entry.data.draft !== true,
  );
  return entries
    .map(withLocale)
    .filter((entry) => entry.lang === lang)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Every published post in every language — used for building routes. */
export async function getAllPosts(): Promise<Post[]> {
  const entries = await getCollection('blog', (entry: BlogEntry) =>
    includeDrafts ? true : entry.data.draft !== true,
  );
  return entries.map(withLocale);
}

export async function getProjects(lang: Lang): Promise<Project[]> {
  const entries = await getCollection('projects');
  return entries
    .map(withLocale)
    .filter((entry) => entry.lang === lang)
    .sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

/** Tag → post count, for one language. */
export async function getTags(lang: Lang): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts(lang);
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Which languages a post slug exists in. A missing translation is normal, so
 * callers fall back to that language's blog index.
 */
export async function translationsOf(slug: string): Promise<Lang[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.slug === slug).map((post) => post.lang);
}
